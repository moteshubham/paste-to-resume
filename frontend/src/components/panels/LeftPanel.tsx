import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { useResume } from "../../context/ResumeContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function LeftPanel() {
  const { setGenerated } = useResume();
  const [jd, setJd] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [baseFileName, setBaseFileName] = useState("");

  async function handleUploadJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Upload a valid .json file");
      return;
    }

    const text = await file.text();
    try {
      const json = JSON.parse(text);
      await api.saveBaseResume(json);

      setBaseFileName(file.name);
      toast.success("Base resume saved");
    } catch (err) {
      toast.error("Invalid JSON structure");
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-lg font-semibold mb-2">Job Description</h2>
        <textarea
          className="w-full h-48 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#611c27] bg-white/90"
          placeholder="Paste JD here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Job Details</h2>
        <input
          type="text"
          placeholder="Job Role"
          className="w-full p-2 mb-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-[#611c27]"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company Name"
          className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-[#611c27]"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Base Resume</h2>

        <label className="block w-full p-3 text-center border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-100 transition">
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleUploadJson}
          />
          {baseFileName ? (
            <span className="text-sm text-gray-700">Uploaded: {baseFileName}</span>
          ) : (
            <span className="text-sm text-gray-600">Upload JSON Resume</span>
          )}
        </label>
      </div>

      <button
        className="w-full py-3 bg-[#611c27] text-white rounded-md font-semibold hover:bg-[#4e1620] transition"
        onClick={async () => {
          if (!jd.trim()) return toast.error("Paste JD first");
          if (!jobRole.trim()) return toast.error("Enter job role");
          if (!company.trim()) return toast.error("Enter company name");

          toast.loading("Generating resume...");

          try {
            const res = await api.generateResume({ jd, jobRole, company });

            // Update global state
            const pdfUrl = res.pdf?.filename 
              ? api.pdfUrl(res.pdf.filename) 
              : (res.pdf?.path ? `${BASE_URL.replace("/api", "")}${res.pdf.path}` : null);
            
            setGenerated({
              json: res.resume,
              pdfUrl
            });

            toast.dismiss();
            toast.success("Resume generated");
          } catch (err: any) {
            toast.dismiss();
            toast.error(err.message || "Failed to generate");
          }
        }}
      >
        Generate Tailored Resume
      </button>
    </div>
  );
}
