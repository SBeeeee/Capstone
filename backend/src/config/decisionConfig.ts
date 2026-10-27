export type EnvRisk = "favourable" | "not_favourable";
export type CameraRisk = "none" | "low" | "medium" | "high";
export type Action = "no_action" | "alert_only" | "spray" | "spray_urgent";

export interface DiseaseThreshold {
  temp: { min: number; max: number };
  humidity: { min: number };
}

export const DISEASE_THRESHOLDS: Record<string, DiseaseThreshold> = {
  downy_mildew: {
    temp: { min: 12, max: 27 },
    humidity: { min: 85 },
  },
  black_rot: {
    temp: { min: 24, max: 35 },
    humidity: { min: 82 },
  },
  bacterial_spot_rot: {
    temp: { min: 20, max: 25 },
    humidity: { min: 85 },
  },
};

export const CAMERA_RISK = { lowMax: 20, highMin: 60 };

export const ACTION_MATRIX: Record<EnvRisk, Record<CameraRisk, Action>> = {
  // Env conditions favour the disease
  favourable: {
    none: "alert_only", // conditions favourable but no camera evidence → alert only
    low: "alert_only",  // low camera risk → alert only
    medium: "spray",
    high: "spray_urgent",
  },
  // Env conditions do NOT favour the disease
  not_favourable: {
    none: "no_action",
    low: "no_action",
    medium: "spray",        // disease visible even without favourable env → still spray
    high: "spray_urgent",
  },
};
