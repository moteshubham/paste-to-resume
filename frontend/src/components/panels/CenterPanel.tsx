import { useResume } from "../../context/ResumeContext";
import { JsonView, defaultStyles } from "react-json-view-lite";
import { toast } from "sonner";
import { api } from "../../services/api";
import { FiSave, FiRepeat, FiDownload } from "react-icons/fi";

export default function CenterPanel() {
  const { generated, setGenerated } = useResume();

  async function saveAsBase() {
    if (!generated.json) return toast.error("No JSON to save");

    try {
      await api.saveBaseResume(generated.json);
      toast.success("Saved as base resume");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function regenerateFromJson() {
    if (!generated.json) return toast.error("Nothing to regenerate");

    toast.loading("Regenerating resume...");

    try {
      const res = await api.generateResume({
        jd: "",
        jobRole: "",
        company: ""
      });

      setGenerated({
        json: res.resume,
        pdfUrl: res.pdf?.filename
          ? api.pdfUrl(res.pdf.filename)
          : null
      });

      toast.dismiss();
      toast.success("Regenerated");
    } catch (err: any) {
      toast.dismiss();
      toast.error("Failed to regenerate");
    }
  }

  function downloadJson() {
    if (!generated.json) return toast.error("No JSON to download");

    const blob = new Blob(
      [JSON.stringify(generated.json, null, 2)],
      { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resume.json";
    a.click();
  }

  return (
    <div className="h-full flex flex-col">

      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Generated Resume JSON</h2>

        {/* Action Bar */}
        {generated.json && (
          <div className="flex items-center gap-3">
            
            <button
              onClick={saveAsBase}
              className="p-2 border rounded-md hover:bg-gray-200 transition"
              title="Save as Base Resume"
            >
              <FiSave size={18} />
            </button>

            <button
              onClick={regenerateFromJson}
              className="p-2 border rounded-md hover:bg-gray-200 transition"
              title="Regenerate with this JSON"
            >
              <FiRepeat size={18} />
            </button>

            <button
              onClick={downloadJson}
              className="p-2 border rounded-md hover:bg-gray-200 transition"
              title="Download JSON"
            >
              <FiDownload size={18} />
            </button>
          </div>
        )}
      </div>

      {/* JSON Editor */}
      {!generated.json ? (
        <p className="text-gray-600 text-sm">
          Generate a resume or upload a PDF to view JSON here.
        </p>
      ) : (
        <div className="bg-white border rounded-md p-3 shadow-sm max-h-[85vh] overflow-auto fade-in">
          <JsonView
            data={generated.json}
            style={defaultStyles}
          />
        </div>
      )}

    </div>
  );
}
