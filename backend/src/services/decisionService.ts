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
  pesticide: string;
  dosage_ml: number;
  env_risk: EnvRisk;
  camera_risk: CameraRisk;
  reason: string;
  message: string;
}

const prettyDisease = (disease: string): string => {
  const spaced = disease.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

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
      : `soil_moisture ${readings.soil_moisture}% ${
          moistureOk ? ">=" : "<"
        } ${rule.soil_moisture.min}`,
  ];

  const favourable = tempOk && humidityOk && moistureOk;

  return {
    risk: favourable ? "favourable" : "not_favourable",
    reason: `${parts.join(", ")} -> ${
      favourable ? `favours ${disease}` : `not favourable for ${disease}`
    }`,
  };
};

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

  const pesticide = prediction.recommended_pesticide;
  const dosage_ml = prediction.recommended_dosage_ml;
  const name = prettyDisease(prediction.disease);
  const envClause = envRisk === "favourable" ? " under favourable conditions" : "";

  let message: string;
  if (action === "alert_only") {
    message = `Conditions favour ${name}. Monitor - no spray needed.`;
  } else if (action === "spray") {
    message = `${name} detected${envClause}. Spray with ${pesticide} (${dosage_ml} ml).`;
  } else if (action === "spray_urgent") {
    message = `${name} severe${envClause}. Spray urgently with ${pesticide} (${dosage_ml} ml).`;
  } else {
    message = "No action required.";
  }

  return {
    action,
    should_spray,
    urgency,
    pesticide,
    dosage_ml,
    env_risk: envRisk,
    camera_risk: cameraRisk,
    reason,
    message,
  };
};
