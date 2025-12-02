import MainLayout from "./layouts/MainLayout";
import LeftPanel from "./components/panels/LeftPanel";
import CenterPanel from "./components/panels/CenterPanel";
import RightPanel from "./components/panels/RightPanel";

function App() {
  return (
    <MainLayout
      left={<LeftPanel />}
      center={<CenterPanel />}
      right={<RightPanel />}
    />
  );
}

export default App;

