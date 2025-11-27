import { Router } from "express";
import { testJsonExtract } from "../controllers/jsonTestController";

const router = Router();

router.post("/json/extract-test", testJsonExtract);

export default router;

