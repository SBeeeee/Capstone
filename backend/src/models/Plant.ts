import mongoose, { Schema, Document } from "mongoose";

export interface IPlant extends Document {
  plant_id: string;
  label?: string;
  label_key: string;
  auto_registered: boolean;
  crop_type: string;
  position: { row: number; col: number };
  bbox_region: { x: number; y: number; w: number; h: number };
  centroid: { x: number; y: number };
  date_registered: Date;
  date_planted: Date;
  current_status: {
    severity: number;
    trend: "improving" | "worsening" | "stable";
    trend_delta: number;
    diagnosis: string;
    last_updated: Date;
  };
  total_pesticide_used_ml: number;
}

const PlantSchema = new Schema<IPlant>(
  {
    plant_id: { type: String, required: true, unique: true },
    label: { type: String },
    label_key: { type: String, index: true },
    auto_registered: { type: Boolean, default: false },
    crop_type: { type: String, default: "cauliflower" },
    position: {
      row: { type: Number, default: 0 },
      col: { type: Number, default: 0 },
    },
    bbox_region: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      w: { type: Number, default: 0 },
      h: { type: Number, default: 0 },
    },
    centroid: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    date_registered: { type: Date, default: Date.now },
    date_planted: { type: Date },
    current_status: {
      severity: { type: Number, default: 0 },
      trend: {
        type: String,
        enum: ["improving", "worsening", "stable"],
        default: "stable",
      },
      trend_delta: { type: Number, default: 0 },
      diagnosis: { type: String, default: "healthy" },
      last_updated: { type: Date },
    },
    total_pesticide_used_ml: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPlant>("Plant", PlantSchema);
