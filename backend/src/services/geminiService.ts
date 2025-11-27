import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY is missing. Gemini calls will fail.");
}

export const sendToGemini = async (prompt: string) => {
  // Placeholder for real Gemini API integration
  // For now, return a dummy response so the structure is ready.

  return {
    ok: true,
    mock: true,
    message: "Gemini call placeholder reached",
    promptReceived: prompt
  };
};

