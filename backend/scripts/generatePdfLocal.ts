import fs from "fs";
import path from "path";
import { generatePdfFromJson } from "../src/services/pdfService";

/**
 * Standalone script to generate PDF resume from base_resume.json
 * Run with: npx ts-node scripts/generatePdfLocal.ts
 * or: npm run generate:pdf
 */
async function main() {
  const baseResumePath = path.join(__dirname, "../data/base_resume.json");
  
  if (!fs.existsSync(baseResumePath)) {
    console.error(`Error: Base resume file not found at ${baseResumePath}`);
    process.exit(1);
  }

  try {
    console.log("Reading base_resume.json...");
    const resumeData = JSON.parse(fs.readFileSync(baseResumePath, "utf-8"));
    
    console.log("Generating PDF...");
    const result = await generatePdfFromJson(resumeData, "Local Test", "Development");
    
    if (result.ok) {
      console.log(`✅ PDF generated successfully!`);
      console.log(`📄 File: ${result.filename}`);
      console.log(`📁 Path: ${result.savedTo}`);
      console.log(`🌐 URL: ${result.path}`);
    } else {
      console.error("❌ Failed to generate PDF");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    process.exit(1);
  }
}

main();

