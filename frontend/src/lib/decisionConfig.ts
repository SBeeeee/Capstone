// Display mirror of backend/src/config/decisionConfig.ts (keep in sync).
// Used for explainer visuals, the risk-fusion matrix and threshold meters.

type BadgeVariant = "healthy" | "warning" | "critical" | "info" | "neutral";

export type EnvRisk = "favourable" | "not_favourable";
export type CameraRisk = "none" | "low" | "medium" | "high";
export type Action = "no_action" | "alert_only" | "spray" | "spray_urgent";

export interface DiseaseThreshold {
  temp: { min: number; max: number };
  humidity: { min: number };
  soil_moisture: { min: number };
}

export const DISEASE_THRESHOLDS: Record<string, DiseaseThreshold> = {
  downy_mildew: {
    temp: { min: 12, max: 27 },
    humidity: { min: 85 },
    soil_moisture: { min: 60 },
  },
  black_rot: {
    temp: { min: 24, max: 35 },
    humidity: { min: 82 },
    soil_moisture: { min: 60 },
  },
  bacterial_spot_rot: {
    temp: { min: 20, max: 25 },
    humidity: { min: 85 },
    soil_moisture: { min: 70 },
  },
};

export const CAMERA_RISK = { lowMax: 20, highMin: 60 };

export const ACTION_MATRIX: Record<EnvRisk, Record<CameraRisk, Action>> = {
  favourable: {
    none: "alert_only",
    low: "alert_only",
    medium: "spray",
    high: "spray_urgent",
  },
  not_favourable: {
    none: "no_action",
    low: "no_action",
    medium: "spray",
    high: "spray_urgent",
  },
};

export const ACTION_META: Record<
  Action,
  {
    label: string;
    short: string;
    variant: BadgeVariant;
    description: string;
    box: string;
    icon: string;
    dot: string;
  }
> = {
  no_action: {
    label: "No Action",
    short: "None",
    variant: "neutral",
    description: "Both signals clear — nothing to do.",
    box: "bg-primary-50 border-primary-100",
    icon: "bg-primary-100 text-primary-600",
    dot: "bg-earth-400",
  },
  alert_only: {
    label: "Alert Only",
    short: "Alert",
    variant: "info",
    description: "Conditions favour disease, image shows little — monitor, no spray.",
    box: "bg-blue-50 border-blue-200",
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
  },
  spray: {
    label: "Spray",
    short: "Spray",
    variant: "warning",
    description: "Disease confirmed — spray recommended.",
    box: "bg-secondary-50 border-secondary-200",
    icon: "bg-secondary-100 text-secondary-700",
    dot: "bg-secondary-500",
  },
  spray_urgent: {
    label: "Spray Urgent",
    short: "Urgent",
    variant: "critical",
    description: "Severe disease — spray urgently.",
    box: "bg-red-50 border-red-200",
    icon: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
};

export const ENV_RISK_LABEL: Record<EnvRisk, string> = {
  favourable: "Favourable",
  not_favourable: "Not favourable",
};

export const CAMERA_RISK_LABEL: Record<CameraRisk, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const envRiskVariant: Record<EnvRisk, BadgeVariant> = {
  favourable: "warning",
  not_favourable: "neutral",
};

export const cameraRiskVariant: Record<CameraRisk, BadgeVariant> = {
  none: "healthy",
  low: "healthy",
  medium: "warning",
  high: "critical",
};

export const CAMERA_RISK_ORDER: CameraRisk[] = ["none", "low", "medium", "high"];
export const ENV_RISK_ORDER: EnvRisk[] = ["favourable", "not_favourable"];
