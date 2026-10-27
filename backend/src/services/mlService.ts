import axios from "axios";

const ML_API_URL =
  process.env.ML_API_URL || "https://plant-disease-1-cada.onrender.com";

// ─── Raw API shapes ──────────────────────────────────────────────────────────

export interface MLInsect {
  found: boolean;
  eaten_pct: number;
  hole_count: number;
  stage: string;
}

export interface MLRegion {
  type: string;
  disease: string;
  affected_pct: number;
  lesion_count: number;
  stage: string;
}

export interface MLPlant {
  stage: string;
  affected_pct: number;
  lesion_count: number;
  insect: MLInsect;
  regions: MLRegion[];
}

export interface MLAdvice {
  about: string;
  check_first: string;
  actions: string[];
  general: string[];
}

export interface MLApiResponse {
  status: string;        // "confident" | "uncertain" | etc.
  reliable: boolean;
  prediction: string;    // e.g. "black_rot"
  confidence: number;    // 0–1
  message: string;
  class_probabilities: Record<string, number>;
  plant: MLPlant;
  overlay_jpeg_b64: string | null;
  advice: MLAdvice | null;
  insect_advice: string | null;
}

// ─── Internal prediction shape used by the rest of the app ──────────────────

export interface MLPrediction {
  disease: string;
  confidence: number;
  /** Overall plant stage: "none" | "mild" | "moderate" | "severe" */
  stage: string;
  /** Percentage of the plant affected (0–100) */
  disease_percent: number;
  /** Lesion count from the plant-level analysis */
  lesion_count: number;
  /** Whether the ML result is considered reliable */
  reliable: boolean;
  /** Full human-readable diagnosis message from the ML service */
  ml_message: string;
  recommended_pesticide: string;
  recommended_dosage_ml: number;
  /** Per-class probability scores */
  class_probabilities: Record<string, number>;
  /** Region-level breakdown */
  regions: MLRegion[];
  /** Insect findings */
  insect: MLInsect;
  /** Base-64 encoded overlay JPEG (may be null) */
  overlay_jpeg_b64: string | null;
  /** Advice block from the ML service (may be null) */
  advice: MLAdvice | null;
  /** Insect-specific advice (may be null) */
  insect_advice: string | null;
}

// ─── Pesticide lookup ────────────────────────────────────────────────────────

const PESTICIDE_MAP: Record<string, { pesticide: string; dosage_ml: number }> =
{
  bacterial_spot_rot: { pesticide: "Copper Hydroxide", dosage_ml: 15 },
  black_rot: { pesticide: "Mancozeb", dosage_ml: 20 },
  downy_mildew: { pesticide: "Chlorothalonil", dosage_ml: 18 },
  no_disease: { pesticide: "None required", dosage_ml: 0 },
};

// ─── Mapping ─────────────────────────────────────────────────────────────────

function mapToMLPrediction(api: MLApiResponse): MLPrediction {
  const treatment = PESTICIDE_MAP[api.prediction] ?? {
    pesticide: "Consult agronomist",
    dosage_ml: 0,
  };

  return {
    disease: api.prediction,
    confidence: api.confidence,
    stage: api.plant?.stage ?? "none",
    disease_percent: api.plant?.affected_pct ?? 0,
    lesion_count: api.plant?.lesion_count ?? 0,
    reliable: api.reliable,
    ml_message: api.message,
    recommended_pesticide: treatment.pesticide,
    recommended_dosage_ml: treatment.dosage_ml,
    class_probabilities: api.class_probabilities ?? {},
    regions: api.plant?.regions ?? [],
    insect: api.plant?.insect ?? {
      found: false,
      eaten_pct: 0,
      hole_count: 0,
      stage: "none",
    },
    overlay_jpeg_b64: api.overlay_jpeg_b64 ?? null,
    advice: api.advice ?? null,
    insect_advice: api.insect_advice ?? null,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function analyzePlantImage(
  imageBuffer: Buffer,
  filename: string,
  mimeType: string = "image/jpeg"
): Promise<MLPrediction> {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
  formData.append("file", blob, filename);

  const res = await axios.post<MLApiResponse>(
    `${ML_API_URL}/predict`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // 60 s – remote Render service can be slow on cold start
    }
  );

  return mapToMLPrediction(res.data);
}
