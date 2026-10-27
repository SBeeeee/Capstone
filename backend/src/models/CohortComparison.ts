import mongoose, { Schema, Document } from "mongoose";

export interface ICohortComparison extends Document {
  date: Date;
  plant_ids_compared: string[];
  verdict: "environmental" | "individual";
  reasoning: string;
}

const CohortComparisonSchema = new Schema<ICohortComparison>(
  {
    date: { type: Date, required: true },
    plant_ids_compared: [{ type: String }],
    verdict: {
      type: String,
      enum: ["environmental", "individual"],
      required: true,
    },
    reasoning: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICohortComparison>(
  "CohortComparison",
  CohortComparisonSchema
);
