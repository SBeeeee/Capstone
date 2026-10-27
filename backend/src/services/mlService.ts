import axios from "axios";

const ML_API_URL =
  process.env.ML_API_URL || "https://plant-disease-1-cada.onrender.com";

// ─── Raw API shapes ───────────────────────────────────────────────────────────

/** Values the ML service puts in the top-level `status` field */
export type MLStatus =
  | "confident"
  | "uncertain"
  | "not_cauliflower"
  | "retake_photo"
  | "out_of_scope"
  | "no_evidence";

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
  stage: string;           // none | early | moderate | severe | critical
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
  status: MLStatus;
  status_reason?: string;  // set when status is retake_photo / out_of_scope etc.
  reliable: boolean;
  prediction: string | null; // bacterial_spot_rot | black_rot | downy_mildew | no_disease | insect_damage | null
  confidence: number;
  message: string;
  class_probabilities: Record<string, number>;
  plant: MLPlant;
  overlay_jpeg_b64: string | null;
  advice: MLAdvice | null;
  insect_advice: string | null;
}

/** Shape returned by POST /jobs */
interface JobSubmitResponse {
  job_id: string;
  status: string;
  result_url: string;
}

/** Shape returned by GET /jobs/{job_id} */
interface JobPollResponse {
  job_id: string;
  status: "queued" | "running" | "done" | "error";
  filename?: string;
  result?: MLApiResponse;
  detail?: string;
}

// ─── Internal prediction shape used by the rest of the app ───────────────────

export interface MLPrediction {
  disease: string;               // prediction value (or "unknown")
  confidence: number;
  /** ML top-level status — determines how to treat the result */
  ml_status: MLStatus;
  status_reason: string | null;
  /** true only for "confident" and "uncertain" */
  reliable: boolean;
  stage: string;
  disease_percent: number;
  lesion_count: number;
  ml_message: string;
  recommended_pesticide: string;
  recommended_dosage_ml: number;
  class_probabilities: Record<string, number>;
  regions: MLRegion[];
  insect: MLInsect;
  overlay_jpeg_b64: string | null;
  advice: MLAdvice | null;
  insect_advice: string | null;
}

// ─── Pesticide lookup ─────────────────────────────────────────────────────────

const PESTICIDE_MAP: Record<string, { pesticide: string; dosage_ml: number }> =
{
  bacterial_spot_rot: { pesticide: "Copper Hydroxide", dosage_ml: 15 },
  black_rot: { pesticide: "Mancozeb", dosage_ml: 20 },
  downy_mildew: { pesticide: "Chlorothalonil", dosage_ml: 18 },
  no_disease: { pesticide: "None required", dosage_ml: 0 },
  insect_damage: { pesticide: "Consult agronomist for insecticide", dosage_ml: 0 },
};

// ─── Mapping ──────────────────────────────────────────────────────────────────

function mapToMLPrediction(api: MLApiResponse): MLPrediction {
  const disease = api.prediction ?? "unknown";
  const treatment = PESTICIDE_MAP[disease] ?? {
    pesticide: "Consult agronomist",
    dosage_ml: 0,
  };

  return {
    disease,
    confidence: api.confidence,
    ml_status: api.status,
    status_reason: api.status_reason ?? null,
    reliable: api.reliable,
    stage: api.plant?.stage ?? "none",
    disease_percent: api.plant?.affected_pct ?? 0,
    lesion_count: api.plant?.lesion_count ?? 0,
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

// ─── Async helpers ────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 5_000;   // poll every 5 s
const POLL_MAX_ATTEMPTS = 120;     // 10 minutes max
const JOB_TIMEOUT_MS = 120_000; // 2 min for submit / poll requests

async function submitJob(
  imageBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
  formData.append("file", blob, filename);

  const res = await axios.post<JobSubmitResponse>(
    `${ML_API_URL}/jobs`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: JOB_TIMEOUT_MS,
    }
  );
  return res.data.job_id;
}

async function pollJob(jobId: string): Promise<MLApiResponse> {
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    await sleep(POLL_INTERVAL_MS);

    const res = await axios.get<JobPollResponse>(
      `${ML_API_URL}/jobs/${jobId}`,
      { timeout: JOB_TIMEOUT_MS }
    );
    const job = res.data;

    if (job.status === "done") {
      if (!job.result) {
        throw new Error("ML job completed but result is empty");
      }
      return job.result;
    }

    if (job.status === "error") {
      throw new Error(`ML job failed: ${job.detail ?? "unknown error"}`);
    }

    // queued | running → keep polling
  }

  throw new Error("ML job timed out after 10 minutes");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Submit an image to the ML service via the async job queue and return a
 * structured MLPrediction once the job completes.
 *
 * Flow: POST /jobs  →  poll GET /jobs/{id} every 5 s  →  map result
 */
export async function analyzePlantImage(
  imageBuffer: Buffer,
  filename: string,
  mimeType: string = "image/jpeg"
): Promise<MLPrediction> {
  const jobId = await submitJob(imageBuffer, filename, mimeType);
  const result = await pollJob(jobId);
  return mapToMLPrediction(result);
}
