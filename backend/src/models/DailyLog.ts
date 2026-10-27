import mongoose, { Schema, Document } from "mongoose";

export interface IDailyLog extends Document {
  plant_id: string;
  date: Date;
  image_url: string;
  disease_percent: number;
  severity_score: number;
  env_data: {
    temp: number;
    humidity: number;
    soil_moisture: number;
    soil: number;
  };
  diagnosis: string;
  cohort_verdict: "isolated" | "shared" | null;
  recommended_pesticide: string;
  recommended_dosage_ml: number;
  dosage_adjustment_reason: string;
  image_retake_count: number;
  source_device_id: string;
  ocr_confidence: number;
  env_risk: "favourable" | "not_favourable";
  camera_risk: "none" | "low" | "medium" | "high";
  action: "no_action" | "alert_only" | "spray" | "spray_urgent";
  should_spray: boolean;
  urgency: "none" | "normal" | "urgent";
  decision_reason: string;
  decision_message: string;
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    plant_id: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    image_url: { type: String },
    disease_percent: { type: Number },
    severity_score: { type: Number, min: 0, max: 100 },
    env_data: {
      temp: { type: Number },
      humidity: { type: Number },
      soil_moisture: { type: Number },
      soil: { type: Number },
    },
    diagnosis: { type: String },
    cohort_verdict: {
      type: String,
      enum: ["isolated", "shared", null],
      default: null,
    },
    recommended_pesticide: { type: String },
    recommended_dosage_ml: { type: Number },
    dosage_adjustment_reason: { type: String },
    image_retake_count: { type: Number, default: 0 },
    source_device_id: { type: String },
    ocr_confidence: { type: Number },
    env_risk: { type: String, enum: ["favourable", "not_favourable"] },
    camera_risk: { type: String, enum: ["none", "low", "medium", "high"] },
    action: {
      type: String,
      enum: ["no_action", "alert_only", "spray", "spray_urgent"],
    },
    should_spray: { type: Boolean, default: false },
    urgency: { type: String, enum: ["none", "normal", "urgent"] },
    decision_reason: { type: String },
    decision_message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IDailyLog>("DailyLog", DailyLogSchema);
