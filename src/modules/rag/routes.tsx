import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import DataSources from "./pages/DataSources";
import Ingestion from "./pages/Ingestion";
import Models from "./pages/Models";
import Integration from "./pages/Integration";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Projects from "./pages/Projects";
import { ProjectProvider } from "./context/ProjectContext";
import RAGMonitor from "./pages/RagMonitor";

export const RAGRoutes = () => {
  return (
    <ProtectedRoute>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sources" element={<DataSources />} />
            <Route path="ingestion" element={<Ingestion />} />
            <Route path="models" element={<Models />} />
            <Route path="integration" element={<Integration />} />
            <Route path="security" element={<Security />} />
            <Route path="config" element={<Settings />} />
            <Route path="projects" element={<Projects />} />
            <Route path="rag-monitor" element={<RAGMonitor />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </ProtectedRoute>
  );
};
