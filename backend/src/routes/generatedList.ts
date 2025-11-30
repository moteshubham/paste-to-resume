import { Router } from "express";
import { listGeneratedResumes } from "../controllers/generatedListController";

const router = Router();

router.get("/generated/list", listGeneratedResumes);

export default router;


