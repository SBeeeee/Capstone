import Plant, { IPlant } from "../models/Plant";
import DailyLog from "../models/DailyLog";
import SprayEvent from "../models/SprayEvent";
import { normalizeLabel } from "../config/identification";

interface RegisterPlantInput {
  plant_id?: string;
  label?: string;
  crop_type?: string;
  position?: { row: number; col: number };
  bbox_region?: { x: number; y: number; w: number; h: number };
  date_planted?: Date;
  auto_registered?: boolean;
}

const derivePlantId = (label: string): string =>
  label.trim().toUpperCase().replace(/\s+/g, "-");

export const registerPlant = async (input: RegisterPlantInput): Promise<IPlant> => {
  const label = input.label?.trim();
  const plantId = input.plant_id?.trim() || (label ? derivePlantId(label) : "");
  const labelKey = normalizeLabel(label || plantId);

  const bbox = input.bbox_region || { x: 0, y: 0, w: 0, h: 0 };
  const centroid = {
    x: bbox.x + bbox.w / 2,
    y: bbox.y + bbox.h / 2,
  };

  const plant = new Plant({
    plant_id: plantId,
    label,
    label_key: labelKey,
    auto_registered: input.auto_registered ?? false,
    crop_type: input.crop_type || "cauliflower",
    position: input.position || { row: 0, col: 0 },
    bbox_region: bbox,
    centroid,
    date_planted: input.date_planted,
  });

  return await plant.save();
};

export const getAllPlants = async (): Promise<IPlant[]> => {
  return await Plant.find().sort({ plant_id: 1 });
};

export const getPlantById = async (plantId: string): Promise<IPlant | null> => {
  return await Plant.findOne({ plant_id: plantId });
};

export const findByLabelKey = async (key: string): Promise<IPlant | null> => {
  return await Plant.findOne({ label_key: key });
};

export const findOrCreateByLabelKey = async (
  key: string,
  label?: string
): Promise<{ plant: IPlant; created: boolean }> => {
  const existing = await findByLabelKey(key);
  if (existing) {
    return { plant: existing, created: false };
  }

  try {
    const plant = await registerPlant({ label: label || key, auto_registered: true });
    return { plant, created: true };
  } catch (error: any) {
    if (error?.code === 11000) {
      const raced = await findByLabelKey(key);
      if (raced) {
        return { plant: raced, created: false };
      }
    }
    throw error;
  }
};

export const getPlantLogs = async (plantId: string) => {
  return await DailyLog.find({ plant_id: plantId }).sort({ date: -1 });
};

export const getPlantSprays = async (plantId: string) => {
  return await SprayEvent.find({ plant_id: plantId }).sort({ date: -1 });
};

export const updatePlantStatus = async (
  plantId: string,
  status: IPlant["current_status"]
): Promise<IPlant | null> => {
  return await Plant.findOneAndUpdate(
    { plant_id: plantId },
    { current_status: status },
    { new: true }
  );
};

export const incrementPesticideUsed = async (
  plantId: string,
  amountMl: number
): Promise<IPlant | null> => {
  return await Plant.findOneAndUpdate(
    { plant_id: plantId },
    { $inc: { total_pesticide_used_ml: amountMl } },
    { new: true }
  );
};
