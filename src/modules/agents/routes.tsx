import { Routes, Route } from "react-router-dom"
import AgentsDashboard from "./pages/AgentsDashboard"
import AgentMonitoring from "./pages/AgentMonitoring"
import AgentEvaluation from "./pages/AgentEvaluation"
import AgentCalibration from "./pages/AgentCalibration"
import AgentWorkflowBuilder from "./pages/AgentWorkflowBuilder"
import { ProjectProvider } from "../rag/context/ProjectContext"
import MainLayout from "../rag/layouts/MainLayout"

export const AgentsRoutes = () => {
    return (
        <ProjectProvider>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<AgentsDashboard />} />
                    <Route path="monitoring" element={<AgentMonitoring />} />
                    <Route path="evaluation" element={<AgentEvaluation />} />
                    <Route path="calibration" element={<AgentCalibration />} />
                    <Route path="workflow-builder" element={<AgentWorkflowBuilder />} />
                </Route>
            </Routes>
        </ProjectProvider>
    )
}
