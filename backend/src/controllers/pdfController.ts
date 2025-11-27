import { Request, Response } from "express";
import { generatePdfFromResume } from "../services/pdfService";
import { loadBaseResume } from "../services/resumeStorage";

export const testPdf = async (req: Request, res: Response) => {
  const resume = loadBaseResume();
  const result = await generatePdfFromResume(resume);

  res.json({ ok: true, pdf: result });
};

