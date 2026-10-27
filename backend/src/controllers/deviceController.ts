import { Request, Response } from "express";
import { readLabel } from "../services/ocrService";
import { stripLabel } from "../services/imageService";
import {
  findByLabelKey,
  findOrCreateByLabelKey,
  incrementPesticideUsed,
  updatePlantStatus,
} from "../services/plantService";
import { analyzePlantImage } from "../services/mlService";
import { decide } from "../services/decisionService";
import { computeTrend } from "../services/trendService";
import { uploadImage } from "../services/cloudinaryService";
import DailyLog from "../models/DailyLog";
import SprayEvent from "../models/SprayEvent";
import { AUTO_REGISTER_ON_SCAN, normalizeLabel } from "../config/identification";

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

export const scanPlant = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const { device_id, soil, moisture, temperature, humidity } = req.body;
    const manualLabel =
      typeof req.body.label === "string" ? req.body.label.trim() : "";

    const ocr = await readLabel(req.file.buffer);
    const plantKey =
      ocr.plantKey ?? (manualLabel ? normalizeLabel(manualLabel) : null);
    const displayLabel = ocr.label ?? (manualLabel || null);

    if (!plantKey) {
      return res.status(422).json({
        error: "No plant label detected",
        ocr_text: ocr.text,
        ocr_confidence: Math.round(ocr.confidence),
      });
    }

    let resolved: { plant: any; created: boolean };
    if (AUTO_REGISTER_ON_SCAN) {
      resolved = await findOrCreateByLabelKey(plantKey, displayLabel || undefined);
    } else {
      const existing = await findByLabelKey(plantKey);
      if (!existing) {
        return res.status(404).json({
          error: "Plant not registered",
          ocr_text: ocr.text,
        });
      }
      resolved = { plant: existing, created: false };
    }

    const cleaned = await stripLabel(req.file.buffer, ocr.bbox);
    const prediction = await analyzePlantImage(cleaned, "scan.png", "image/png");
    const imageUrl = await uploadImage(req.file.buffer);

    const envData = {
      temp: toNumber(temperature),
      humidity: toNumber(humidity),
      soil_moisture: toNumber(moisture),
      soil: toNumber(soil),
    };

    // Decision logic uses disease_percent (= affected_pct from ML) as the
    // camera-risk signal, same as before.
    const decision = decide(prediction, {
      temp: envData.temp,
      humidity: envData.humidity,
      soil_moisture: envData.soil_moisture,
    });

    const previousLog = await DailyLog.findOne({
      plant_id: resolved.plant.plant_id,
    }).sort({ date: -1 });

    const log = await DailyLog.create({
      plant_id: resolved.plant.plant_id,
      date: new Date(),
      image_url: imageUrl,
      disease_percent: prediction.disease_percent,
      severity_score: prediction.disease_percent, // affected_pct is our severity proxy
      env_data: envData,
      diagnosis: prediction.disease,
      recommended_pesticide: prediction.recommended_pesticide,
      recommended_dosage_ml: prediction.recommended_dosage_ml,
      source_device_id: device_id,
      ocr_confidence: Math.round(ocr.confidence),
      env_risk: decision.env_risk,
      camera_risk: decision.camera_risk,
      action: decision.action,
      should_spray: decision.should_spray,
      urgency: decision.urgency,
      decision_reason: decision.reason,
      decision_message: decision.message,
    });

    if (decision.should_spray) {
      const now = new Date();
      await SprayEvent.create({
        plant_id: resolved.plant.plant_id,
        date: now,
        triggered_by_log_id: log._id,
        pesticide_used: decision.pesticide,
        amount_ml: decision.dosage_ml,
        spray_time: now,
        status: "pending",
      });
      await incrementPesticideUsed(resolved.plant.plant_id, decision.dosage_ml);
    }

    // Trend — use disease_percent (affected_pct) as the severity signal
    const severity = prediction.disease_percent;
    const previousSeverity =
      previousLog && typeof previousLog.severity_score === "number"
        ? previousLog.severity_score
        : undefined;
    const { trend, delta } = computeTrend(severity, previousSeverity);

    await updatePlantStatus(resolved.plant.plant_id, {
      severity,
      diagnosis: prediction.disease,
      trend,
      trend_delta: delta,
      last_updated: new Date(),
    });

    // ── Final scan verdict ──────────────────────────────────────────────────
    res.json({
      device_id: device_id || null,
      plant_id: resolved.plant.plant_id,
      log_id: log._id,
      timestamp: log.date,

      identification: {
        ocr_text: ocr.text,
        matched: true,
        created: resolved.created,
        ocr_confidence: Math.round(ocr.confidence),
        source: ocr.plantKey ? "ocr" : "manual",
      },

      diagnosis: {
        disease: prediction.disease,
        confidence: prediction.confidence,
        ml_status: prediction.ml_status,
        status_reason: prediction.status_reason,
        reliable: prediction.reliable,
        stage: prediction.stage,
        disease_percent: prediction.disease_percent,
        lesion_count: prediction.lesion_count,
        ml_message: prediction.ml_message,
        class_probabilities: prediction.class_probabilities,
        regions: prediction.regions,
        insect: prediction.insect,
      },

      environment: {
        readings: {
          temperature: envData.temp ?? null,
          humidity: envData.humidity ?? null,
          soil: envData.soil ?? null,
          moisture: envData.soil_moisture ?? null,
        },
      },

      decision,

      advice: prediction.advice,
      insect_advice: prediction.insect_advice,

      // Base-64 overlay image from ML (may be null)
      overlay_jpeg_b64: prediction.overlay_jpeg_b64,

      image_url: imageUrl,
    });
  } catch (error: any) {
    console.error("Scan error:", error);
    const status = error?.isAxiosError ? 503 : 500;
    res.status(status).json({ error: error.message || "Scan failed" });
  }
};
