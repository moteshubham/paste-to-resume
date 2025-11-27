import express from "express";
import dotenv from "dotenv";
import healthRouter from "./routes/health";
import resumeRouter from "./routes/resume";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", resumeRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

