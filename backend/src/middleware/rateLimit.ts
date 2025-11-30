import rateLimit from "express-rate-limit";

export const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    ok: false,
    error: "Too many requests. Please wait and try again."
  }
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: {
    ok: false,
    error: "Too many uploads. Try again later."
  }
});

export const geminiLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 3,
  message: {
    ok: false,
    error: "Gemini request limit reached. Slow down."
  }
});


