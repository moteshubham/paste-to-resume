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
    model: "gemini-2.5-flash" // later can switch to pro
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
    // FIRST ATTEMPT
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const trimmed = text.trim();

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      return { ok: true, raw: text };
    }

    // SECOND ATTEMPT — FORCE JSON
    const retryPrompt = `${prompt}

The previous output was not valid JSON.
Return ONLY valid JSON now. No markdown. No explanation.
`;

    const retryResult = await model.generateContent(retryPrompt);
    const retryText = retryResult.response.text();

    return { ok: true, raw: retryText, retry: true };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Gemini error"
    };
  }
};

