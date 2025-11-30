import { Request, Response } from "express";
import { loadBaseResume } from "../services/resumeStorage";

export const getQuickFields = (req: Request, res: Response) => {
  const resume = loadBaseResume();

  const basics = resume.basics || {};
  const profiles = basics.profiles || [];

  const quick = {
    name: basics.name || "",
    email: basics.email || "",
    phone: basics.phone || "",
    location: basics.location?.city || "",
    summary: basics.summary || "",
    profiles: profiles.map((p: any) => ({
      network: p.network || "",
      url: p.url || ""
    })),
    skills: Array.isArray(resume.skills)
      ? resume.skills.flatMap((s: any) => s.keywords || [])
      : [],
    latestJob:
      Array.isArray(resume.work) && resume.work.length > 0
        ? {
            company: resume.work[0].company || "",
            position: resume.work[0].position || "",
            startDate: resume.work[0].startDate || "",
            endDate: resume.work[0].endDate || ""
          }
        : {},
    education: Array.isArray(resume.education)
      ? resume.education.map((e: any) => ({
          institution: e.institution || "",
          area: e.area || "",
          studyType: e.studyType || "",
          startDate: e.startDate || "",
          endDate: e.endDate || ""
        }))
      : []
  };

  res.json({ ok: true, quick });
};


