import { MLPrediction } from "./mlService";
import {
  ACTION_MATRIX,
  Action,
  CAMERA_RISK,
  CameraRisk,
  DISEASE_THRESHOLDS,
  EnvRisk,
} from "../config/decisionConfig";

export type { Action, CameraRisk, EnvRisk };

export interface Readings {
  temp?: number;
  humidity?: number;
  soil_moisture?: number;
}

export interface Decision {
  action: Action;
  should_spray: boolean;
  urgency: "none" | "normal" | "urgent";
  /** Water quantity to spray in mL, derived from disease severity % */
  dosage_ml: number;
  env_risk: EnvRisk;
  camera_risk: CameraRisk;
  /** Environment + threshold detail for debugging */
  reason: string;
  /** Human-readable recommendation for the device/UI */
  message: string;
  /** Alert message when environment is favourable but no spray is needed */
  env_alert?: string;
}

// ── Dosage lookup ────────────────────────────────────────────────────────────
// Based on the disease severity table (illustrative demo values):
//   Healthy (0%)       →  0 mL
//   Low     (1–10%)    → 10 mL
//   Moderate(11–25%)   → 20 mL
//   High    (26–50%)   → 30 mL
//   Very high (>50%)   → 40 mL
export const dosageFromSeverity = (pct: number | undefined): number => {
  if (pct === undefined || pct <= 0) return 0;
  if (pct <= 10) return 10;
  if (pct <= 25) return 20;
  if (pct <= 50) return 30;
  return 40;
};

const prettyDisease = (disease: string): string => {
  const spaced = disease.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

// ── Environmental risk ───────────────────────────────────────────────────────
export const assessEnvRisk = (
  disease: string,
  readings: Readings
): { risk: EnvRisk; reason: string } => {
  const rule = DISEASE_THRESHOLDS[disease];
  if (!rule) {
    return {
      risk: "not_favourable",
      reason: `no environmental rule for "${disease}"`,
    };
  }

  const tempOk =
    readings.temp !== undefined &&
    readings.temp >= rule.temp.min &&
    readings.temp <= rule.temp.max;
  const humidityOk =
    readings.humidity !== undefined && readings.humidity >= rule.humidity.min;
  const moistureOk =
    readings.soil_moisture !== undefined &&
    readings.soil_moisture >= rule.soil_moisture.min;

  const parts = [
    readings.temp === undefined
      ? "temp missing"
      : `temp ${readings.temp}C ${tempOk ? "in" : "outside"} ${rule.temp.min}-${rule.temp.max}`,
    readings.humidity === undefined
      ? "humidity missing"
      : `humidity ${readings.humidity}% ${humidityOk ? ">=" : "<"} ${rule.humidity.min}`,
    readings.soil_moisture === undefined
      ? "soil_moisture missing"
      : `soil_moisture ${readings.soil_moisture}% ${moistureOk ? ">=" : "<"
      } ${rule.soil_moisture.min}`,
  ];

  const favourable = tempOk && humidityOk && moistureOk;

  return {
    risk: favourable ? "favourable" : "not_favourable",
    reason: `${parts.join(", ")} -> ${favourable ? `favours ${disease}` : `not favourable for ${disease}`
      }`,
  };
};

// ── Camera risk ──────────────────────────────────────────────────────────────
export const assessCameraRisk = (
  disease: string,
  score: number | undefined
): CameraRisk => {
  if (disease === "no_disease" || score === undefined) {
    return "none";
  }
  if (score < CAMERA_RISK.lowMax) {
    return "low";
  }
  if (score < CAMERA_RISK.highMin) {
    return "medium";
  }
  return "high";
};

// ── Master decide function ────────────────────────────────────────────────────
export const decide = (
  prediction: MLPrediction,
  readings: Readings
): Decision => {
  const { risk: envRisk, reason } = assessEnvRisk(prediction.disease, readings);
  const cameraRisk = assessCameraRisk(
    prediction.disease,
    prediction.disease_percent
  );

  const action = ACTION_MATRIX[envRisk][cameraRisk];
  const should_spray = action === "spray" || action === "spray_urgent";
  const urgency: Decision["urgency"] =
    action === "spray_urgent" ? "urgent" : action === "spray" ? "normal" : "none";

  // Dosage is purely severity-driven (from the image table)
  const dosage_ml = dosageFromSeverity(prediction.disease_percent);
  const name = prettyDisease(prediction.disease);

  let message: string;
  let env_alert: string | undefined;

  if (action === "alert_only") {
    env_alert = `Environmental conditions favour ${name}. Monitor closely.`;
    message = `Conditions favour ${name}. No spray needed yet – keep monitoring.`;
  } else if (action === "spray") {
    message = `${name} detected. Apply ${dosage_ml} mL of water spray.`;
  } else if (action === "spray_urgent") {
    message = `${name} – severe infection. Apply ${dosage_ml} mL urgently.`;
  } else {
    message = "No action required.";
  }

  return {
    action,
    should_spray,
    urgency,
    dosage_ml,
    env_risk: envRisk,
    camera_risk: cameraRisk,
    reason,
    message,
    ...(env_alert ? { env_alert } : {}),
  };
};
