import mongoose, { Schema, Document } from "mongoose";

export interface ISprayEvent extends Document {
  plant_id: string;
  date: Date;
  triggered_by_log_id: mongoose.Types.ObjectId;
  pesticide_used: string;
  amount_ml: number;
  spray_time: Date;
  status: "pending" | "success" | "failed";
}

const SprayEventSchema = new Schema<ISprayEvent>(
  {
    plant_id: { type: String, required: true, index: true },
    date: { type: Date },
    triggered_by_log_id: {
      type: Schema.Types.ObjectId,
      ref: "DailyLog",
    },
    pesticide_used: { type: String },
    amount_ml: { type: Number },
    spray_time: { type: Date },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISprayEvent>("SprayEvent", SprayEventSchema);
