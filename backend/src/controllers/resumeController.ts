import { Request, Response } from "express";
import { loadBaseResume, saveBaseResume } from "../services/resumeStorage";
import { validateBaseResume } from "../services/validationService";

export const getBaseResume = (req: Request, res: Response) => {
  const data = loadBaseResume();
  res.json({ ok: true, data });
};

export const setBaseResume = (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object") {
      return res.status(400).json({ ok: false, error: "Invalid body" });
    }
    const { valid, errors } = validateBaseResume(body);
    if (!valid) {
      return res.status(400).json({ ok: false, error: "Invalid resume format", details: errors });
    }
    saveBaseResume(body);
    res.json({ ok: true, message: "Base resume updated" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server error" });
  }
};

