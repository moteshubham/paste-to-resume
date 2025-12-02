import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "sonner"
import { ResumeProvider } from "./context/ResumeContext"
import "react-json-view-lite/dist/index.css"
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumeProvider>
      <App />
    </ResumeProvider>
    <Toaster richColors expand />
  </StrictMode>,
)

