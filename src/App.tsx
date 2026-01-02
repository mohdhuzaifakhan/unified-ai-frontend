import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import { AuthProvider } from "@/contexts/AuthContext";
import { MLRoutes } from "@/modules/ml/routes";
import { RAGRoutes } from "@/modules/rag/routes";
import { AgentsRoutes } from "@/modules/agents/routes";
import Docs from "./pages/Docs";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/ml/*" element={<MLRoutes />} /> */}
          <Route path="/rag/*" element={<RAGRoutes />} />
          <Route path="/agents/*" element={<AgentsRoutes />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
