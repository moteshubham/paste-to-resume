import { Request, Response } from "express";
import { generatePdfFromJson } from "../services/pdfService";

export const testPdf = async (req: Request, res: Response) => {
  const jsonData = req.body || { test: true };
  const result = await generatePdfFromJson(jsonData);

  res.json({ ok: true, result });
};

