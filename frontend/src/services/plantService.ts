import apiClient from "./apiClient";

export interface Plant {
  _id: string;
  plant_id: string;
  label?: string;
  label_key?: string;
  auto_registered?: boolean;
  crop_type: string;
  position: { row: number; col: number };
  bbox_region: { x: number; y: number; w: number; h: number };
  centroid: { x: number; y: number };
  date_registered: string;
  date_planted?: string;
  current_status: {
    severity: number;
    trend: "improving" | "worsening" | "stable";
    trend_delta?: number;
    diagnosis: string;
    last_updated: string;
  };
  total_pesticide_used_ml: number;
}

export interface DailyLog {
  _id: string;
  plant_id: string;
  date: string;
  image_url?: string;
  disease_percent?: number;
  severity_score?: number;
  env_data: {
    temp?: number;
    humidity?: number;
    soil_moisture?: number;
    soil?: number;
  };
  diagnosis?: string;
  cohort_verdict?: "isolated" | "shared" | null;
  recommended_pesticide?: string;
  recommended_dosage_ml?: number;
  dosage_adjustment_reason?: string;
  image_retake_count: number;
  source_device_id?: string;
  ocr_confidence?: number;
  env_risk?: "favourable" | "not_favourable";
  camera_risk?: "none" | "low" | "medium" | "high";
  action?: "no_action" | "alert_only" | "spray" | "spray_urgent";
  should_spray?: boolean;
  urgency?: "none" | "normal" | "urgent";
  decision_reason?: string;
  decision_message?: string;
}

export interface SprayEvent {
  _id: string;
  plant_id: string;
  date: string;
  triggered_by_log_id: string;
  pesticide_used: string;
  amount_ml: number;
  spray_time: string;
  status: "pending" | "success" | "failed";
}

export async function getAllPlants(): Promise<Plant[]> {
  const res = await apiClient.get<Plant[]>("/plants");
  return res.data;
}

export async function getPlantById(id: string): Promise<Plant> {
  const res = await apiClient.get<Plant>(`/plants/${id}`);
  return res.data;
}

export async function getPlantLogs(id: string): Promise<DailyLog[]> {
  const res = await apiClient.get<DailyLog[]>(`/plants/${id}/logs`);
  return res.data;
}

export async function getPlantSprays(id: string): Promise<SprayEvent[]> {
  const res = await apiClient.get<SprayEvent[]>(`/plants/${id}/sprays`);
  return res.data;
}
