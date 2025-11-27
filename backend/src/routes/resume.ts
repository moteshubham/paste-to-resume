import { Router } from "express";
import { getBaseResume } from "../controllers/resumeController";

const router = Router();

router.get("/resume/base", getBaseResume);

export default router;
