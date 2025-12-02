import type { ReactNode } from "react";

export default function MainLayout({
  left,
  center,
  right,
  onOpenQuickCopy,
  onOpenHistory
}: {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  onOpenQuickCopy: () => void;
  onOpenHistory: () => void;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#faf7f2] text-gray-900">
      
      {/* Top Navbar */}
      <header className="w-full px-6 py-4 border-b border-gray-300 bg-white/70 backdrop-blur-md flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">PasteToResume</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHistory}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            History
          </button>

          <button
            onClick={onOpenQuickCopy}
            className="px-4 py-2 bg-[#611c27] text-white rounded-md hover:bg-[#4e1620] transition"
          >
            Quick Copy
          </button>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* Left Panel */}
        <div className="w-full md:w-[24%] min-w-[260px] max-w-[320px] border-r border-gray-300 bg-white/60 p-4 overflow-y-auto">
          {left}
        </div>

        {/* Center Panel */}
        <div className="flex-1 border-r border-gray-300 bg-white/80 p-4 overflow-y-auto">
          {center}
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[33%] min-w-[360px] bg-white p-4 overflow-y-auto">
          {right}
        </div>

      </div>
    </div>
  );
}

