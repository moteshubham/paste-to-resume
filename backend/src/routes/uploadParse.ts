import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware";
import { parseUploadedResume } from "../controllers/uploadParseController";
import { uploadLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/upload/parse", uploadLimiter, upload.single("file"), parseUploadedResume);

export default router;


