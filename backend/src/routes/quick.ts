import { Router } from "express";
import { getQuickFields } from "../controllers/quickFieldsController";

const router = Router();

router.get("/resume/quick", getQuickFields);

export default router;


