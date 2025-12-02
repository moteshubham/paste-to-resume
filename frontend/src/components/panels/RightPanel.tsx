import { useResume } from "../../context/ResumeContext";
import { useState } from "react";
import { toast } from "sonner";
import { FiZoomIn, FiZoomOut, FiRefreshCw, FiDownload } from "react-icons/fi";

export default function RightPanel() {
  const { generated } = useResume();
  const [zoom, setZoom] = useState(1);

  function handleDownload() {
    if (!generated.pdfUrl) {
      toast.error("No PDF generated");
      return;
    }
    const a = document.createElement("a");
    a.href = generated.pdfUrl;
    a.download = generated.pdfUrl.split("/").pop() || "resume.pdf";
    a.click();
  }

  function reloadPdf() {
    if (!generated.pdfUrl) return;
    const url = generated.pdfUrl + "?r=" + Date.now(); // cache-bust
    const iframe = document.getElementById("pdf-frame") as HTMLIFrameElement;
    if (iframe) iframe.src = url;
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">PDF Preview</h2>

      {!generated.pdfUrl ? (
        <p className="text-gray-600 text-sm">
          Generate a resume to preview the PDF here.
        </p>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-3 bg-white p-2 rounded-md shadow-sm border">
            <button
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
            >
              <FiZoomIn size={18} />
            </button>

            <button
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.6))}
            >
              <FiZoomOut size={18} />
            </button>

            <button
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => setZoom(1)}
            >
              Reset
            </button>

            <button
              className="p-2 hover:bg-gray-200 rounded"
              onClick={reloadPdf}
            >
              <FiRefreshCw size={18} />
            </button>

            <button
              className="ml-auto px-3 py-2 bg-[#611c27] text-white rounded-md hover:bg-[#4e1620]"
              onClick={handleDownload}
            >
              <div className="flex items-center gap-2">
                <FiDownload />
                Download
              </div>
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="border rounded-md overflow-auto bg-gray-50 flex-1 fade-in">
            <iframe
              id="pdf-frame"
              src={generated.pdfUrl}
              className="w-full h-full"
              style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
