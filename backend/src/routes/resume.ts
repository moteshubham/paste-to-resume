import { Router } from "express";
import { getBaseResume, setBaseResume } from "../controllers/resumeController";

const router = Router();

router.get("/resume/base", getBaseResume);
router.post("/resume/base", setBaseResume);

export default router;
