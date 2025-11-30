// Builds the final prompt to send to Gemini.
// This enforces rules for tailoring the JSON resume based on a job description.

export const buildResumePrompt = (baseResume: any, jobDescription: string) => {
  return `
You are an expert resume optimizer.

Your goal:
Take the provided base JSON Resume and modify it ONLY where allowed, based on the Job Description (JD). 
Return VALID JSON ONLY. No extra text. No comments. No explanations.

---

## INPUTS

Base Resume (JSON Resume format):

${JSON.stringify(baseResume, null, 2)}

Job Description:

${jobDescription}

---

## STRICT RULES — MUST FOLLOW

1. DO NOT change:

   - basics.name

   - basics.email

   - basics.phone

   - basics.location

   - profiles[*].url

   - education[*].institution

   - education[*].startDate

   - education[*].endDate

   - work[*].company

   - work[*].startDate

   - work[*].endDate

2. You MAY update:

   - work[*].highlights → rewrite using keywords from JD but keep real project context.

   - skills → reorder, add JD-related skills, remove irrelevant ones.

   - summary → update to align with JD.

   - projects → improve wording using JD keywords but do not invent fake projects.

3. DO NOT invent:

   - new employers

   - new dates

   - new degrees

   - fake job titles unrelated to original context

4. MUST use keywords from the JD naturally.

5. MUST keep final output in JSON Resume schema:

   https://jsonresume.org/schema/

6. MUST output ONLY JSON. 

   No explanation, no markdown, no text outside JSON.

---

## OUTPUT

Return the final optimized JSON Resume object. Only JSON.

IMPORTANT:
Return ONLY valid JSON. No markdown, no comments, no text outside JSON.
If unsure, return an empty valid JSON object.
  `;
};

