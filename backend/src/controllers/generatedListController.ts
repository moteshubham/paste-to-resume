import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const listGeneratedResumes = (req: Request, res: Response) => {
  const dir = path.join(__dirname, "../../generated_resumes");

  if (!fs.existsSync(dir)) {
    return res.json({ ok: true, files: [] });
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const fullPath = path.join(dir, f);
      const stats = fs.statSync(fullPath);

      return {
        filename: f,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    });

  res.json({ ok: true, files });
};


