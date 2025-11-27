import { Router } from "express";
import { testPdf } from "../controllers/pdfController";

const router = Router();

router.get("/pdf/test", testPdf);

export default router;

