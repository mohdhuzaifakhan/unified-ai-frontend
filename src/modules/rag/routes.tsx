import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import DataSources from './pages/DataSources';
import Ingestion from './pages/Ingestion';
import Models from './pages/Models';
import Workflows from './pages/Workflows';
import AgentMonitoring from './pages/AgentMonitoring';
import AgentEvaluation from './pages/AgentEvaluation';
import AgentConfig from './pages/AgentConfig';
import Integration from './pages/Integration';
import Security from './pages/Security';
import Settings from './pages/Settings';

export const RAGRoutes = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="sources" element={<DataSources />} />
                    <Route path="ingestion" element={<Ingestion />} />
                    <Route path="models" element={<Models />} />
                    <Route path="agent-workflows" element={<Workflows />} />
                    <Route path="agent-monitoring" element={<AgentMonitoring />} />
                    <Route path="agent-evaluation" element={<AgentEvaluation />} />
                    <Route path="agent-config" element={<AgentConfig />} />
                    <Route path="integration" element={<Integration />} />
                    <Route path="workflows" element={<Workflows />} />
                    <Route path="security" element={<Security />} />
                    <Route path="config" element={<Settings />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
};
