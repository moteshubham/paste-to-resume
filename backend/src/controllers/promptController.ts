import { Request, Response } from "express";
import { buildResumePrompt } from "../services/promptBuilder";
import { loadBaseResume } from "../services/resumeStorage";

export const testPrompt = (req: Request, res: Response) => {
  const jd = req.body.jd || "JD placeholder here";
  const base = loadBaseResume();
  const prompt = buildResumePrompt(base, jd);

  res.json({ ok: true, prompt });
};

