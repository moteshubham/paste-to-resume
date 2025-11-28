import { Request, Response } from "express";
import { loadBaseResume } from "../services/resumeStorage";
import { buildResumePrompt } from "../services/promptBuilder";
import { sendToGemini } from "../services/geminiService";
import { extractJson } from "../utils/jsonExtractor";
import { validateBaseResume } from "../services/validationService";
import { saveGeneratedResume } from "../services/generatedResumeStorage";
import { generatePdfFromJson } from "../services/pdfService";

export const generateResume = async (req: Request, res: Response) => {
  try {
    const { jd } = req.body;

    if (!jd || typeof jd !== "string") {
      return res.status(400).json({ ok: false, error: "Job description missing or invalid" });
    }

    // Step 1: Load base resume
    const baseResume = loadBaseResume();

    // Step 2: Build prompt
    const prompt = buildResumePrompt(baseResume, jd);

    // Step 3: Call Gemini (real SDK)
    const geminiResponse = await sendToGemini(prompt);

    if (!geminiResponse.ok) {
      return res.status(500).json({ ok: false, error: "Gemini error", details: geminiResponse });
    }

    // Step 4: Extract JSON from AI output
    const extracted = extractJson(geminiResponse.raw);

    if (!extracted.ok) {
      return res.status(400).json({
        ok: false,
        error: "Invalid JSON returned by Gemini",
        details: extracted
      });
    }

    const generatedResume = extracted.json;

    // Step 5: Validate basic resume structure
    const { valid, errors } = validateBaseResume(generatedResume);

    if (!valid) {
      return res.status(400).json({
        ok: false,
        error: "Generated resume failed validation",
        details: errors
      });
    }

    // Step 6: Save generated resume JSON
    const saveInfo = saveGeneratedResume(generatedResume);

    // Step 7: Generate PDF (mock for now)
    const pdfInfo = await generatePdfFromJson(generatedResume);

    return res.json({
      ok: true,
      saved: saveInfo,
      pdf: pdfInfo,
      resume: generatedResume
    });

  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message || "Internal server error"
    });
  }
};

