import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Experiment from "./pages/Experiment"
import ModelDetails from "./pages/ModelDetails"
import Models from "./pages/Models"
import Data from "./pages/Data"
import Settings from "./pages/Settings"
import Security from "./pages/Security"
import Preprocessing from "./pages/Preprocessing"
import Billing from "./pages/Billing"
import Deployments from "./pages/Deployments"
import DeploymentDetails from "./pages/DeploymentDetails"
import Maintenance from "./pages/Maintenance"
import BusinessImpact from "./pages/BusinessImpact"
import ModelBuilder from "./pages/ModelBuilder"

export const MLRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="data" element={<Data />} />
                <Route path="preprocessing" element={<Preprocessing />} />
                <Route path="builder" element={<ModelBuilder />} />
                <Route path="models" element={<Models />} />
                <Route path="models/:id" element={<ModelDetails />} />
                <Route path="experiments/:id" element={<Experiment />} />
                <Route path="deployments" element={<Deployments />} />
                <Route path="deployments/:id" element={<DeploymentDetails />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="business-impact" element={<BusinessImpact />} />
                <Route path="security" element={<Security />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}
