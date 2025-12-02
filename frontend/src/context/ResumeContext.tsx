import { createContext, useContext, useState, type ReactNode } from "react";

interface GeneratedData {
  json: any | null;
  pdfUrl: string | null;
}

interface ResumeContextType {
  generated: GeneratedData;
  setGenerated: (d: GeneratedData) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [generated, setGenerated] = useState<GeneratedData>({
    json: null,
    pdfUrl: null
  });

  return (
    <ResumeContext.Provider value={{ generated, setGenerated }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be inside ResumeProvider");
  return ctx;
}

