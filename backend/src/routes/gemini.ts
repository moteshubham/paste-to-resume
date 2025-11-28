import { Router } from "express";
import { testGemini } from "../controllers/geminiController";
import { geminiLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/gemini/test", geminiLimiter, testGemini);

export default router;

