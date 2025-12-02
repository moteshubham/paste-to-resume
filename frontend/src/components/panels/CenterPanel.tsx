import { useResume } from "../../context/ResumeContext";

export default function CenterPanel() {
  const { generated } = useResume();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Generated Resume JSON</h2>

      {generated.json ? (
        <pre className="p-3 bg-gray-100 rounded-md text-sm overflow-auto max-h-[80vh]">
          {JSON.stringify(generated.json, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-600 text-sm">
          No generated resume yet. Paste JD and click Generate.
        </p>
      )}
    </div>
  );
}
