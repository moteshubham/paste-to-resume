import { Router } from "express";
import { testGemini } from "../controllers/geminiController";

const router = Router();

router.post("/gemini/test", testGemini);

export default router;

