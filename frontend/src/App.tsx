import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import LeftPanel from "./components/panels/LeftPanel";
import CenterPanel from "./components/panels/CenterPanel";
import RightPanel from "./components/panels/RightPanel";
import QuickCopyPanel from "./components/QuickCopyPanel";
import HistoryPanel from "./components/HistoryPanel";

function App() {
  const [isQuickOpen, setQuickOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <MainLayout
        left={<LeftPanel />}
        center={<CenterPanel />}
        right={<RightPanel />}
        onOpenQuickCopy={() => setQuickOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <QuickCopyPanel
        isOpen={isQuickOpen}
        onClose={() => setQuickOpen(false)}
      />

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </>
  );
}

export default App;
