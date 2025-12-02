import { useResume } from "../../context/ResumeContext";
import { JsonView, defaultStyles } from "react-json-view-lite";
import { toast } from "sonner";

export default function CenterPanel() {
  const { generated, setGenerated } = useResume();

  function handleEdit(updated: any) {
    // react-json-view-lite returns updated data only
    const newJson = updated.value;

    setGenerated({
      ...generated,
      json: newJson
    });

    toast.success("Updated JSON");
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">
        Generated Resume JSON
      </h2>

      {!generated.json ? (
        <p className="text-gray-600 text-sm">
          Generate a resume to view & edit JSON here.
        </p>
      ) : (
        <div className="bg-white border rounded-md p-3 shadow-sm max-h-[85vh] overflow-auto">
          <JsonView
            data={generated.json}
            style={defaultStyles}
            editable
            onEdit={handleEdit}
            displaySize={false}
            enableClipboard
          />
        </div>
      )}
    </div>
  );
}
