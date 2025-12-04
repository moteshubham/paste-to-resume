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
  if (resume?.basics?.email) contactParts.push(`<span>${escapeHtml(resume.basics.email)}</span>`);
  if (resume?.basics?.phone) contactParts.push(`<span>${escapeHtml(resume.basics.phone)}</span>`);
  if (resume?.basics?.location?.city) contactParts.push(`<span>${escapeHtml(resume.basics.location.city)}</span>`);
  // Add profiles (LinkedIn, GitHub, etc.)
  if (Array.isArray(resume?.basics?.profiles)) {
    resume.basics.profiles.forEach((profile: any) => {
      if (profile.network) {
        // Extract username from URL or use username field
        let displayText = profile.username || "";
        if (!displayText && profile.url) {
          // Try to extract username from URL (e.g., github.com/username -> username)
          const urlMatch = profile.url.match(/\/([^\/]+)\/?$/);
          if (urlMatch) displayText = urlMatch[1];
          else displayText = profile.url;
        }
        if (displayText) {
          contactParts.push(`<span>${escapeHtml(profile.network)}: ${escapeHtml(displayText)}</span>`);
        }
      }
    });
  }
  const contact = contactParts.join("");

  const summary = resume?.basics?.summary || "";

  // Fix skills rendering - extract keywords from skill objects
  let skillsHtml = "";
  if (Array.isArray(resume.skills)) {
    const allKeywords: string[] = [];
    resume.skills.forEach((skill: any) => {
      if (skill && typeof skill === 'object') {
        // If skill has keywords array, use those
        if (Array.isArray(skill.keywords)) {
          allKeywords.push(...skill.keywords);
        } else if (skill.name) {
          // If it's an object with a name, use the name
          allKeywords.push(skill.name);
        }
      } else if (typeof skill === 'string') {
        // If it's already a string, use it directly
        allKeywords.push(skill);
      }
    });
    skillsHtml = allKeywords.map((keyword: string) => `<span>${escapeHtml(String(keyword))}</span>`).join("");
  } else if (resume.skills?.keywords && Array.isArray(resume.skills.keywords)) {
    // Fallback: if skills is an object with keywords array
    skillsHtml = resume.skills.keywords.map((keyword: string) => `<span>${escapeHtml(String(keyword))}</span>`).join("");
  }

  const work = Array.isArray(resume.work) ? resume.work : [];
  const workHtml = work.map((w: any) => {
    const title = w.position || w.name || "";
    const company = w.company || "";
    const dates = [w.startDate, w.endDate].filter(Boolean).join(" - ");
    const highlights = Array.isArray(w.highlights)
      ? `<ul>${w.highlights.map((h: string) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
      : "";
    return `<div class="work-item">
      <div class="work-header">
        <div>
          <span class="work-title">${escapeHtml(title)}</span> — <span class="work-company">${escapeHtml(company)}</span>
        </div>
        <div class="work-dates">${escapeHtml(dates)}</div>
      </div>
      ${highlights}
    </div>`;
  }).join("");

  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const projectHtml = projects.map((p: any) => {
    const name = p.name || "";
    const description = p.description || "";
    const highlights = Array.isArray(p.highlights)
      ? `<ul>${p.highlights.map((h: string) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
      : "";

    return `
    <div class="project-item">
      <div><strong>${escapeHtml(name)}</strong></div>
      <div>${escapeHtml(description)}</div>
      ${highlights}
    </div>
  `;
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
  html = html.replace("{{contact}}", contact); // contact already has HTML, don't escape
  html = html.replace("{{summary}}", escapeHtml(summary));
  html = html.replace("{{skills}}", skillsHtml); // skillsHtml already has HTML
  html = html.replace("{{workItems}}", workHtml); // workHtml already has HTML
  html = html.replace("{{projectItems}}", projectHtml); // projectHtml already has HTML
  html = html.replace("{{educationItems}}", eduHtml); // eduHtml already has HTML

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
    await page.pdf({ path: outPath, format: "A4", printBackground: true, margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" } });
  } finally {
    await browser.close();
  }

  return { ok: true, filename, path: `/pdfs/${filename}`, savedTo: outPath };
};
