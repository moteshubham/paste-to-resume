import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "sonner";
import { FiX, FiFileText } from "react-icons/fi";
import { useResume } from "../context/ResumeContext";

export default function HistoryPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const { setGenerated } = useResume();

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    api
      .getGeneratedList()
      .then((res) => setList(res.files || []))
      .catch(() => toast.error("Failed to load history"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  async function openResume(filename: string) {
    toast.loading("Loading resume...");

    try {
      const jsonRes = await api.getGeneratedResume(filename);

      setGenerated({
        json: jsonRes.json,
        pdfUrl: api.pdfUrl(filename.replace(".json", ".pdf")),
      });

      toast.dismiss();
      toast.success("Resume loaded");

      onClose();
    } catch (err: any) {
      toast.dismiss();
      toast.error("Failed to load resume");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-start">

      {/* Drawer */}
      <div className="w-[340px] bg-white h-full p-5 overflow-y-auto shadow-xl animate-slide-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">History</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded">
            <FiX size={18} />
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item.filename}
              className="p-3 border rounded-md shadow-sm hover:bg-gray-100 cursor-pointer transition flex items-center gap-2"
              onClick={() => openResume(item.filename)}
            >
              <FiFileText size={18} className="text-gray-600" />
              <div>
                <div className="font-medium text-sm">{item.filename}</div>
                <div className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {list.length === 0 && !loading && (
            <p className="text-gray-600 text-sm">No resume history yet.</p>
          )}
        </div>

      </div>

    </div>
  );
}

