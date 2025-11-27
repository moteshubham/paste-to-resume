// This file will build the final prompt sent to Gemini.
// For now, only a placeholder function.

export const buildResumePrompt = (baseResume: any, jobDescription: string) => {
  return `
You will receive a base JSON resume and a job description.
For now this is only a placeholder prompt.

Base Resume:
${JSON.stringify(baseResume, null, 2)}

Job Description:
${jobDescription}
  `;
};

