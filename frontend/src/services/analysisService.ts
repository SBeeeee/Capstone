import apiClient from "./apiClient";

export interface Decision {
  action: "no_action" | "alert_only" | "spray" | "spray_urgent";
  should_spray: boolean;
  urgency: "none" | "normal" | "urgent";
  pesticide: string;
  dosage_ml: number;
  env_risk: "favourable" | "not_favourable";
  camera_risk: "none" | "low" | "medium" | "high";
  reason: string;
  message: string;
}

export interface ScanResult {
  device_id: string | null;
  plant_id: string;
  log_id: string;
  timestamp: string;
  identification: {
    ocr_text: string;
    matched: boolean;
    created: boolean;
    ocr_confidence: number;
    source: "ocr" | "manual";
  };
  diagnosis: {
    disease: string;
    confidence: number;
    severity_score: number;
    disease_percent: number;
  };
  environment: {
    readings: {
      temperature: number | null;
      humidity: number | null;
      soil: number | null;
      moisture: number | null;
    };
  };
  decision: Decision;
}

export async function scanPlant(formData: FormData): Promise<ScanResult> {
  const res = await apiClient.post<ScanResult>("/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
