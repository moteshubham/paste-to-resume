import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../data/base_resume.json");

export function loadBaseResume() {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

export function saveBaseResume(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

