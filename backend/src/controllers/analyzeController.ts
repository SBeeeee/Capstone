import { Request, Response } from "express";
import { uploadImage } from "../services/cloudinaryService";
import { analyzePlantImage } from "../services/mlService";
import DailyLog from "../models/DailyLog";

export const analyzeImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const { plant_id, env_data } = req.body;

    // Call ML service with the image buffer directly
    const prediction = await analyzePlantImage(
      req.file.buffer,
      req.file.originalname
    );

    // Upload image to Cloudinary for storage
    const imageUrl = await uploadImage(req.file.buffer);

    // Store daily log if plant_id provided
    if (plant_id) {
      const envParsed = env_data ? JSON.parse(env_data) : {};
      await DailyLog.create({
        plant_id,
        date: new Date(),
        image_url: imageUrl,
        disease_percent: prediction.disease_percent,
        severity_score: prediction.disease_percent, // severity mapped from affected_pct
        env_data: {
          temp: envParsed.temp,
          humidity: envParsed.humidity,
          soil_moisture: envParsed.soil_moisture,
        },
        diagnosis: prediction.disease,
        recommended_pesticide: prediction.recommended_pesticide,
        recommended_dosage_ml: prediction.recommended_dosage_ml,
      });
    }

    res.json({
      plant_id: plant_id || null,
      diagnosis: prediction.disease,
      confidence: prediction.confidence,
      reliable: prediction.reliable,
      stage: prediction.stage,
      disease_percent: prediction.disease_percent,
      lesion_count: prediction.lesion_count,
      ml_message: prediction.ml_message,
      recommended_pesticide: prediction.recommended_pesticide,
      recommended_dosage_ml: prediction.recommended_dosage_ml,
      class_probabilities: prediction.class_probabilities,
      regions: prediction.regions,
      insect: prediction.insect,
      overlay_jpeg_b64: prediction.overlay_jpeg_b64,
      advice: prediction.advice,
      insect_advice: prediction.insect_advice,
      image_url: imageUrl,
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message || "Analysis failed" });
  }
};
