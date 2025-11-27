import { Router } from "express";
import { testPrompt } from "../controllers/promptController";

const router = Router();

router.post("/prompt/test", testPrompt);

export default router;

