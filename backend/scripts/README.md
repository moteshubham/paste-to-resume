# Local PDF Generation Script

This script allows you to generate PDF resumes locally from `base_resume.json` without using the Gemini API, making it perfect for testing and iterating on PDF styling.

## Usage

### Option 1: Using npm script (Recommended)
```bash
npm run generate:pdf
```

### Option 2: Using npx directly
```bash
npx ts-node scripts/generatePdfLocal.ts
```

### Option 3: Using ts-node directly (if installed globally)
```bash
ts-node scripts/generatePdfLocal.ts
```

## What it does

1. Reads `backend/data/base_resume.json`
2. Generates a PDF using the same `generatePdfFromJson` function used by the API
3. Saves the PDF to `backend/pdfs/` directory
4. Prints the file path and location

## Output

The generated PDF will be saved as:
```
backend/pdfs/Shubham_Mote_Local_Test_Development_[timestamp].pdf
```

## Requirements

- Node.js installed
- All dependencies installed (`npm install`)
- Puppeteer (for PDF generation) - should be installed as a dependency

## Notes

- This script does NOT use the Gemini API, so you can run it multiple times without consuming API tokens
- Perfect for testing template changes and styling adjustments
- The script uses the same PDF generation logic as the production API

