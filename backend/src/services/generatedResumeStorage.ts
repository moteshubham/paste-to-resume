import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../data/generated_resume.json");

export const saveGeneratedResume = (data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: "Failed to save generated resume" };
  }
};

