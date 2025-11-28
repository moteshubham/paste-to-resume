import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { sanitize } from "../utils/sanitizeFilename";

const templatePath = path.join(__dirname, "../../pdf/resume_template.html");
const outputDir = path.join(__dirname, "../../pdfs");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function renderHtmlFromResume(resume: any) {
  const rawTemplate = fs.readFileSync(templatePath, "utf-8");

  const name = resume?.basics?.name || "";
  const contactParts: string[] = [];
  if (resume?.basics?.email) contactParts.push(resume.basics.email);
  if (resume?.basics?.phone) contactParts.push(resume.basics.phone);
  if (resume?.basics?.location?.city) contactParts.push(resume.basics.location.city);
  const contact = contactParts.join(" | ");

  const summary = resume?.basics?.summary || "";

  const skillsArr = Array.isArray(resume.skills) ? resume.skills : (resume.skills?.keywords || []);
  const skillsHtml = (skillsArr || []).map((s: any) => `<span>${String(s)}</span>`).join("");

  const work = Array.isArray(resume.work) ? resume.work : [];
  const workHtml = work.map((w: any) => {
    const title = w.position || w.name || "";
    const company = w.company || "";
    const dates = [w.startDate, w.endDate].filter(Boolean).join(" - ");
    const highlights = Array.isArray(w.highlights) ? `<ul>${w.highlights.map((h: string) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>` : "";
    return `<div class="work-item"><span class="position">${escapeHtml(title)}</span> — <span class="company">${escapeHtml(company)}</span> <div class="dates">${escapeHtml(dates)}</div>${highlights}</div>`;
  }).join("");

  const education = Array.isArray(resume.education) ? resume.education : [];
  const eduHtml = education.map((e: any) => {
    const institution = e.institution || "";
    const area = e.area || "";
    const studyType = e.studyType || "";
    const dates = [e.startDate, e.endDate].filter(Boolean).join(" - ");

    return `
    <div class="edu-item">
      <div class="institution"><strong>${escapeHtml(institution)}</strong></div>
      <div class="studyType">${escapeHtml(studyType)} — ${escapeHtml(area)}</div>
      <div class="dates">${escapeHtml(dates)}</div>
    </div>
  `;
  }).join("");

  let html = rawTemplate;
  html = html.replace("{{name}}", escapeHtml(name));
  html = html.replace("{{contact}}", escapeHtml(contact));
  html = html.replace("{{summary}}", escapeHtml(summary));
  html = html.replace("{{skills}}", skillsHtml);
  html = html.replace("{{workItems}}", workHtml);
  html = html.replace("{{educationItems}}", eduHtml);

  return html;
}

function escapeHtml(str: string) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const generatePdfFromJson = async (data: any, jobRole?: string, company?: string) => {
  const role = sanitize(jobRole || "");
  const comp = sanitize(company || "");
  const timestamp = Date.now();

  const filename = `Shubham_Mote_${role}_${comp}_${timestamp}.pdf`;
  const outPath = path.join(outputDir, filename);

  const html = renderHtmlFromResume(data);

  // Launch puppeteer and render PDF
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: outPath, format: "A4", printBackground: true, margin: { top: "20mm", bottom: "20mm", left: "16mm", right: "16mm" } });
  } finally {
    await browser.close();
  }

  return { ok: true, filename, path: `/pdfs/${filename}`, savedTo: outPath };
};
