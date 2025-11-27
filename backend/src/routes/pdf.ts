import { Router } from "express";
import { testPdf } from "../controllers/pdfController";

const router = Router();

router.post("/pdf/test", testPdf);

export default router;

