// Minimal typing; rely on runtime multer behavior
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const multer: any = require("multer");
import path from "path";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (req: any, file: any, cb: (err: any, filename: string) => void) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_");
    cb(null, `${timestamp}_${safeName}`);
  }
});

export const upload = multer({ storage });


