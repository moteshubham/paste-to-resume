import { Request, Response } from "express";
import { sendToGemini } from "../services/geminiService";

export const testGemini = async (req: Request, res: Response) => {
  const prompt = req.body.prompt || "Test prompt";

  const response = await sendToGemini(prompt);

  res.json({ ok: true, gemini: response });
};

