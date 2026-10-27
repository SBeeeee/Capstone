import sharp from "sharp";
import { createWorker } from "tesseract.js";
import {
  LABEL_PATTERN,
  LABEL_TOP_BAND,
  LabelBox,
  normalizeLabel,
} from "../config/identification";

export { normalizeLabel };

export interface LabelRead {
  text: string;
  plantKey: string | null;
  label: string | null;
  confidence: number;
  bbox?: LabelBox;
}

interface LabelCandidate {
  text: string;
  plantKey: string | null;
  label: string | null;
  confidence: number;
  bbox?: LabelBox;
}

const WORK_WIDTH = 1200;

let workerPromise: Promise<any> | null = null;

const getWorker = async (): Promise<any> => {
  if (!workerPromise) {
    workerPromise = createWorker("eng");
  }
  return workerPromise;
};

const buildLabel = (group: string): string => `Plant ${group.toUpperCase()}`;

const lineBBox = (words: any[], scale: number): LabelBox | undefined => {
  const boxes = words
    .map((word) => word?.bbox)
    .filter((box) => box && typeof box.x0 === "number");

  if (!boxes.length) {
    return undefined;
  }

  const x0 = Math.min(...boxes.map((box) => box.x0));
  const y0 = Math.min(...boxes.map((box) => box.y0));
  const x1 = Math.max(...boxes.map((box) => box.x1));
  const y1 = Math.max(...boxes.map((box) => box.y1));

  return {
    x: Math.round(x0 * scale),
    y: Math.round(y0 * scale),
    w: Math.round((x1 - x0) * scale),
    h: Math.round((y1 - y0) * scale),
  };
};

const extractLabel = (
  data: any,
  scale: number
): { plantKey: string | null; label: string | null; bbox?: LabelBox } => {
  const blocks = data?.blocks ?? [];

  for (const block of blocks) {
    for (const paragraph of block?.paragraphs ?? []) {
      for (const line of paragraph?.lines ?? []) {
        const words: any[] = line?.words ?? [];
        const lineText = words
          .map((word) => word?.text ?? "")
          .join(" ")
          .trim();
        const match = lineText.match(LABEL_PATTERN);
        if (match) {
          return {
            plantKey: normalizeLabel(`plant${match[1]}`),
            label: buildLabel(match[1]),
            bbox: lineBBox(words, scale),
          };
        }
      }
    }
  }

  const fallback = String(data?.text ?? "").match(LABEL_PATTERN);
  if (fallback) {
    return {
      plantKey: normalizeLabel(`plant${fallback[1]}`),
      label: buildLabel(fallback[1]),
    };
  }

  return { plantKey: null, label: null };
};

const recognize = async (image: Buffer, scale: number): Promise<LabelCandidate> => {
  const worker = await getWorker();
  const { data } = await worker.recognize(image, {}, { blocks: true, text: true });
  const { plantKey, label, bbox } = extractLabel(data, scale);

  return {
    text: String((data as any)?.text ?? "").trim(),
    plantKey,
    label,
    confidence: Number((data as any)?.confidence ?? 0),
    bbox,
  };
};

// Tesseract expects dark text on a light background, but labels are often
// light-on-dark (e.g. white text on a dark badge). So we try both polarities,
// and fall back to the whole image if the top band yields nothing.
const toRead = (candidate: LabelCandidate): LabelRead => ({
  text: candidate.text,
  plantKey: candidate.plantKey,
  label: candidate.label,
  confidence: candidate.confidence,
  bbox: candidate.bbox,
});

export const readLabel = async (buffer: Buffer): Promise<LabelRead> => {
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const workWidth = Math.min(width || WORK_WIDTH, WORK_WIDTH);
  const scale = width ? width / workWidth : 1;
  const bandHeight = Math.max(1, Math.round(height * LABEL_TOP_BAND));

  const candidates: LabelCandidate[] = [];

  const bandBase = await sharp(buffer)
    .extract({ left: 0, top: 0, width, height: bandHeight })
    .grayscale()
    .normalise()
    .resize({ width: workWidth })
    .png()
    .toBuffer();

  const bandNormal = await recognize(bandBase, scale);
  if (bandNormal.plantKey) return toRead(bandNormal);
  candidates.push(bandNormal);

  const bandInverted = await recognize(
    await sharp(bandBase).negate().png().toBuffer(),
    scale
  );
  if (bandInverted.plantKey) return toRead(bandInverted);
  candidates.push(bandInverted);

  const fullBase = await sharp(buffer)
    .grayscale()
    .normalise()
    .resize({ width: workWidth })
    .png()
    .toBuffer();

  const fullNormal = await recognize(fullBase, scale);
  if (fullNormal.plantKey) return toRead(fullNormal);
  candidates.push(fullNormal);

  const fullInverted = await recognize(
    await sharp(fullBase).negate().png().toBuffer(),
    scale
  );
  if (fullInverted.plantKey) return toRead(fullInverted);
  candidates.push(fullInverted);

  const best = candidates.reduce(
    (a, b) => (b.confidence > a.confidence ? b : a),
    candidates[0]
  );
  return toRead(best);
};
