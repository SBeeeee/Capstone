import { Router } from "express";
import * as plantController from "../controllers/plantController";

const router = Router();

router.post("/register", plantController.registerPlant);
router.get("/", plantController.getAllPlants);
router.get("/:id", plantController.getPlantById);
router.get("/:id/logs", plantController.getPlantLogs);
router.get("/:id/sprays", plantController.getPlantSprays);

export default router;
