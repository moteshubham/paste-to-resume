import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getGeneratedResume = (req: Request, res: Response) => {
  const { filename } = req.params;

  if (!filename || !filename.endsWith(".json")) {
    return res.status(400).json({ ok: false, error: "Invalid filename" });
  }

  const filePath = path.join(__dirname, "../../generated_resumes", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: "File not found" });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);

    return res.json({ ok: true, json });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: "Invalid JSON file" });
  }
};


