import { Router } from "express";
import upload from "../middleware/upload";
import { analyzeImage } from "../controllers/analyzeController";

const router = Router();

router.post("/", upload.single("image"), analyzeImage);

export default router;
