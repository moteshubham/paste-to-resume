import express from "express";
import dotenv from "dotenv";
import healthRouter from "./routes/health";
import resumeRouter from "./routes/resume";
import geminiRouter from "./routes/gemini";
import promptRouter from "./routes/prompt";
import pdfRouter from "./routes/pdf";
import generateRouter from "./routes/generate";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", resumeRouter);
app.use("/api", geminiRouter);
app.use("/api", promptRouter);
app.use("/api", pdfRouter);
app.use("/api", generateRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

