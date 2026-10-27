import sharp from "sharp";
import { LABEL_TOP_BAND, LabelBox } from "../config/identification";

export const stripLabel = async (
  buffer: Buffer,
  bbox?: LabelBox
): Promise<Buffer> => {
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  if (bbox && bbox.w > 0 && bbox.h > 0) {
    const left = Math.max(0, Math.min(bbox.x, width - 1));
    const top = Math.max(0, Math.min(bbox.y, height - 1));
    const w = Math.max(1, Math.min(bbox.w, width - left));
    const h = Math.max(1, Math.min(bbox.h, height - top));

    const patch = await sharp({
      create: { width: w, height: h, channels: 3, background: { r: 255, g: 255, b: 255 } },
    })
      .png()
      .toBuffer();

    return sharp(buffer)
      .composite([{ input: patch, left, top }])
      .png()
      .toBuffer();
  }

  const bandHeight = Math.max(1, Math.round(height * LABEL_TOP_BAND));
  if (bandHeight >= height) {
    return sharp(buffer).png().toBuffer();
  }

  return sharp(buffer)
    .extract({ left: 0, top: bandHeight, width, height: height - bandHeight })
    .png()
    .toBuffer();
};

export default stripLabel;
