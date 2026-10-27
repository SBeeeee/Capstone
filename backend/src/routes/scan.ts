import { Router } from "express";
import upload from "../middleware/upload";
import { scanPlant } from "../controllers/deviceController";

const router = Router();

router.post("/", upload.single("image"), scanPlant);

export default router;
