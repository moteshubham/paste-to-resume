import { useResume } from "../../context/ResumeContext";

export default function RightPanel() {
  const { generated } = useResume();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">PDF Preview</h2>

      {generated.pdfUrl ? (
        <iframe
          src={generated.pdfUrl}
          className="w-full h-[85vh] border rounded-md"
        />
      ) : (
        <p className="text-gray-600 text-sm">
          Generate a resume to preview the PDF here.
        </p>
      )}
    </div>
  );
}
