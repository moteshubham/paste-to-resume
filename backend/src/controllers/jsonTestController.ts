import { Request, Response } from "express";
import { extractJson } from "../utils/jsonExtractor";

export const testJsonExtract = (req: Request, res: Response) => {
  const raw = req.body.raw || "";
  const result = extractJson(raw);
  res.json(result);
};

