import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { QuickFields } from "../types/resume";
import { toast } from "sonner";
import { FiCopy, FiX } from "react-icons/fi";

export default function QuickCopyPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QuickFields | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    api
      .getQuickFields()
      .then((res) => setData(res.quick))
      .catch(() => toast.error("Failed to load quick data"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  function Copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">

      {/* Drawer */}
      <div className="w-[360px] bg-white h-full p-5 overflow-y-auto shadow-xl animate-slide-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quick Copy</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded">
            <FiX size={18} />
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {data && (
          <div className="space-y-6">

            {/* Contact */}
            <section>
              <h3 className="font-semibold mb-2">Contact</h3>
              <div className="space-y-2">
                <Item label="Email" value={data.email} onCopy={Copy} />
                <Item label="Phone" value={data.phone} onCopy={Copy} />
                <Item label="Location" value={data.location} onCopy={Copy} />
              </div>
            </section>

            {/* Profiles */}
            <section>
              <h3 className="font-semibold mb-2">Profiles</h3>
              {data.profiles.map((p, i) => (
                <Item
                  key={i}
                  label={p.network}
                  value={p.url}
                  onCopy={Copy}
                />
              ))}
            </section>

            {/* Skills */}
            <section>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-300"
                    onClick={() => Copy(s)}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {/* Latest Job */}
            <section>
              <h3 className="font-semibold mb-2">Latest Job</h3>
              <Item label="Company" value={data.latestJob.company} onCopy={Copy} />
              <Item label="Position" value={data.latestJob.position} onCopy={Copy} />
              <Item label="Start Date" value={data.latestJob.startDate} onCopy={Copy} />
              <Item label="End Date" value={data.latestJob.endDate} onCopy={Copy} />
            </section>

            {/* Education */}
            <section>
              <h3 className="font-semibold mb-2">Education</h3>
              {data.education.map((e, i) => (
                <div key={i} className="space-y-1 border-b pb-2 mb-3">
                  <Item label="Institution" value={e.institution} onCopy={Copy} />
                  <Item label="Degree" value={e.studyType} onCopy={Copy} />
                  <Item label="Field" value={e.area} onCopy={Copy} />
                  <Item label="Start Date" value={e.startDate} onCopy={Copy} />
                  <Item label="End Date" value={e.endDate} onCopy={Copy} />
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function Item({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (v: string) => void;
}) {
  if (!value) return null;

  return (
    <div className="flex items-center justify-between border p-2 rounded-md bg-gray-50">
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
      <button
        className="p-2 hover:bg-gray-200 rounded"
        onClick={() => onCopy(value)}
      >
        <FiCopy size={14} />
      </button>
    </div>
  );
}

