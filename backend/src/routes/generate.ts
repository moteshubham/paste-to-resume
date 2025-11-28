import { Router } from "express";
import { generateResume } from "../controllers/generateController";
import { generateLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/generate", generateLimiter, generateResume);

export default router;

