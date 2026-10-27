export const LABEL_PATTERN = /plant[\s\-_]*([a-z0-9]+)/i;
export const LABEL_TOP_BAND = 0.25;
export const OCR_MIN_CONFIDENCE = 60;
export const OUTPUT_FORMAT = "png";
export const AUTO_REGISTER_ON_SCAN = true;

export interface LabelBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const normalizeLabel = (text: string): string =>
  (text || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
