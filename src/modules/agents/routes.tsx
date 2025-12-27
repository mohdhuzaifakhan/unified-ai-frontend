import { Routes, Route } from "react-router-dom"
import AgentsDashboard from "./pages/AgentsDashboard"

export const AgentsRoutes = () => {
    return (
        <Routes>
            <Route index element={<AgentsDashboard />} />
        </Routes>
    )
}
