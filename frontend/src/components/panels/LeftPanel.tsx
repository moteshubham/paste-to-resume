import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { useResume } from "../../context/ResumeContext";

export default function LeftPanel() {
  const { setGenerated } = useResume();
  const [jd, setJd] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [baseFileName, setBaseFileName] = useState("");
  const [uploadedPdf, setUploadedPdf] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ jd: false, jobRole: false, company: false });

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

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".pdf")) {
      toast.error("Upload a valid PDF file");
      return;
    }

    setUploadedPdf(file.name);
    toast.loading("Parsing resume...");

    try {
      const res = await api.parseUploadedFile(file);

      // Parsed JSON from backend → update global state
      setGenerated({
        json: res.parsed,
        pdfUrl: null
      });

      toast.dismiss();
      toast.success("Resume parsed into JSON");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to parse PDF");
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-lg font-semibold mb-2 transition-all duration-150">Job Description</h2>
        <textarea
          className={`w-full h-48 p-3 rounded-md border ${
            errors.jd ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-[#611c27] bg-white/90`}
          placeholder="Paste JD here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 transition-all duration-150">Job Details</h2>
        <input
          type="text"
          placeholder="Job Role"
          className={`w-full p-2 mb-2 border rounded-md ${
            errors.jobRole ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-[#611c27]`}
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company Name"
          className={`w-full p-2 border rounded-md ${
            errors.company ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-[#611c27]`}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 transition-all duration-150">Base Resume</h2>

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

      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Resume (PDF → JSON)</h2>

        <label className="block w-full p-3 text-center border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-100 transition">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handlePdfUpload}
          />
          {uploadedPdf ? (
            <span className="text-sm text-gray-700">Uploaded: {uploadedPdf}</span>
          ) : (
            <span className="text-sm text-gray-600">Upload PDF Resume</span>
          )}
        </label>

        <p className="text-xs text-gray-500 mt-1">
          This will extract your resume text & convert it into JSON Resume format.
        </p>
      </div>

      <button
        disabled={loading}
        className={`w-full py-3 rounded-md font-semibold transition flex items-center justify-center gap-2
          ${loading ? "bg-gray-400" : "bg-[#611c27] hover:bg-[#4e1620] text-white"}
        `}
        onClick={async () => {
          // reset visual errors
          setErrors({ jd: false, jobRole: false, company: false });

          const newErr = {
            jd: !jd.trim(),
            jobRole: !jobRole.trim(),
            company: !company.trim()
          };

          setErrors(newErr);

          if (Object.values(newErr).some(Boolean)) {
            toast.error("Fill required fields");
            return;
          }

          setLoading(true);
          toast.loading("Generating resume...");

          try {
            const res = await api.generateResume({ jd, jobRole, company });

            setGenerated({
              json: res.resume,
              pdfUrl: res.pdf?.filename ? api.pdfUrl(res.pdf.filename) : null
            });

            toast.dismiss();
            toast.success("Resume generated");
          } catch (err: any) {
            toast.dismiss();
            toast.error(err.message || "Something went wrong");
          }

          setLoading(false);
        }}
      >
        {loading && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Generating..." : "Generate Tailored Resume"}
      </button>
    </div>
  );
}
