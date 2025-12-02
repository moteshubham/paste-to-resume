import { useResume } from "../../context/ResumeContext";
import { JsonView, defaultStyles } from "react-json-view-lite";

export default function CenterPanel() {
  const { generated } = useResume();

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">
        Generated Resume JSON
      </h2>

      {!generated.json ? (
        <p className="text-gray-600 text-sm">
          Generate a resume to view JSON here.
        </p>
      ) : (
        <div className="bg-white border rounded-md p-3 shadow-sm max-h-[85vh] overflow-auto">
          <JsonView
            data={generated.json}
            style={defaultStyles}
          />
        </div>
      )}
    </div>
  );
}
