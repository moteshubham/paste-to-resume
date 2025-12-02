import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import LeftPanel from "./components/panels/LeftPanel";
import CenterPanel from "./components/panels/CenterPanel";
import RightPanel from "./components/panels/RightPanel";
import QuickCopyPanel from "./components/QuickCopyPanel";

function App() {
  const [isQuickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <MainLayout
        left={<LeftPanel />}
        center={<CenterPanel />}
        right={<RightPanel />}
        onOpenQuickCopy={() => setQuickOpen(true)}
      />

      <QuickCopyPanel
        isOpen={isQuickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}

export default App;
