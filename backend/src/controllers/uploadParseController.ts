import { Request, Response } from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import { sendToGemini } from "../services/geminiService";
import { extractJson } from "../utils/jsonExtractor";
import { validateResume } from "../services/validationService";

export const parseUploadedResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);

    const extractedText = pdfData.text || "";

    const prompt = `
Convert the following resume text into a valid JSON Resume schema object.
Return ONLY JSON. No explanation.

Resume text:
${extractedText}
    `;

    const geminiResponse = await sendToGemini(prompt);

    if (!geminiResponse.ok) {
      return res.status(500).json({ ok: false, error: "Gemini error", details: geminiResponse });
    }

    const extracted = extractJson(geminiResponse.raw);

    if (!extracted.ok) {
      return res.status(400).json({
        ok: false,
        error: "Gemini did not return valid JSON",
        details: extracted
      });
    }

    const jsonResume = extracted.json;

    const { valid, errors } = validateResume(jsonResume);

    if (!valid) {
      return res.status(400).json({
        ok: false,
        error: "JSON Resume failed validation",
        details: errors
      });
    }

    return res.json({
      ok: true,
      parsed: jsonResume
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message || "Internal server error"
    });
  }
};


