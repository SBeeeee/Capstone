import { Request, Response } from "express";
import * as plantService from "../services/plantService";

export const registerPlant = async (req: Request, res: Response) => {
  try {
    const plant = await plantService.registerPlant(req.body);
    res.status(201).json(plant);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Plant ID already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getAllPlants = async (req: Request, res: Response) => {
  try {
    const plants = await plantService.getAllPlants();
    res.json(plants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlantById = async (req: Request, res: Response) => {
  try {
    const plant = await plantService.getPlantById(req.params.id as string);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(plant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlantLogs = async (req: Request, res: Response) => {
  try {
    const logs = await plantService.getPlantLogs(req.params.id as string);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlantSprays = async (req: Request, res: Response) => {
  try {
    const sprays = await plantService.getPlantSprays(req.params.id as string);
    res.json(sprays);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
