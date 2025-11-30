import { Router } from "express";
import { getGeneratedResume } from "../controllers/generatedGetController";

const router = Router();

router.get("/generated/:filename", getGeneratedResume);

export default router;


