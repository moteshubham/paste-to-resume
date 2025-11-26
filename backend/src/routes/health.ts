import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({ ok: true, geminiKeyPresent: hasKey });
});

export default router;

