import { Request, Response } from "express";
import { loadBaseResume } from "../services/resumeStorage";

export const getBaseResume = (req: Request, res: Response) => {
  const data = loadBaseResume();
  res.json({ ok: true, data });
};
