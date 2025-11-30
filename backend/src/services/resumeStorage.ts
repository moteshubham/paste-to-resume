import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../data/base_resume.json");   // path to the base resume file, dirname is the directory of the current file

export const loadBaseResume = () => {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
};

export const saveBaseResume = (data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

