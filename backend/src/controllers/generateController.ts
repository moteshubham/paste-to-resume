import { Request, Response } from "express";
import { loadBaseResume } from "../services/resumeStorage";
import { buildResumePrompt } from "../services/promptBuilder";
import { sendToGemini } from "../services/geminiService";
import { saveGeneratedResume } from "../services/generatedResumeStorage";
import { generatePdfFromJson } from "../services/pdfService";

export const generateResume = async (req: Request, res: Response) => {
  try {
    const { jd } = req.body;

    if (!jd || typeof jd !== "string") {
      return res.status(400).json({ ok: false, error: "Job description missing or invalid" });
    }

    // Load base JSON resume
    const base = loadBaseResume();

    // Build prompt from base resume + JD
    const prompt = buildResumePrompt(base, jd);

    // Send to Gemini (mock response for now)
    const geminiOutput = await sendToGemini(prompt);

    // For now we treat Gemini output as "generated resume"
    const generatedResume = {
      mock: true,
      geminiOutput,
      originalPrompt: prompt
    };

    // Save generated JSON resume to file
    const savedInfo = saveGeneratedResume(generatedResume);

    // Generate PDF (mock)
    const pdfResult = await generatePdfFromJson(generatedResume);

    res.json({
      ok: true,
      message: "Mock generation completed",
      saved: savedInfo,
      pdf: pdfResult
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server error" });
  }
};

