import { Router } from "express";
import { generateResume } from "../controllers/generateController";

const router = Router();

router.post("/generate", generateResume);

export default router;

