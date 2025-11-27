import dotenv from "dotenv";

dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY missing. Real Gemini calls will fail.");
}

let model: any = null;

// Initialize model (only once)
if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash" // later can switch to pro
  });
}

// Real Gemini call (JSON output expected)
export const sendToGemini = async (prompt: string) => {
  if (!model) {
    return {
      ok: false,
      error: "Gemini model not initialized",
      mock: true
    };
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      ok: true,
      raw: text
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Gemini error"
    };
  }
};

