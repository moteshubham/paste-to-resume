// Utility to extract clean JSON from Gemini responses

export const extractJson = (rawText: string) => {
  if (!rawText || typeof rawText !== "string") {
    return { ok: false, error: "Invalid Gemini response" };
  }

  let cleaned = rawText.trim();

  // Remove ```json or ``` wrappers
  cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Attempt JSON parse
  try {
    const json = JSON.parse(cleaned);
    return { ok: true, json };
  } catch (e) {
    // Try to fix common trailing comma issues
    try {
      cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
      const json = JSON.parse(cleaned);
      return { ok: true, json };
    } catch (err) {
      return {
        ok: false,
        error: "Invalid JSON after cleanup",
        raw: rawText
      };
    }
  }
};

