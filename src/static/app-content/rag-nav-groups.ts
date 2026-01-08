import { Activity, Bot, Database, Files, LayoutDashboard, ShieldCheck, UploadCloud, Workflow } from "lucide-react";

export const navGroups = [
    {
        title: "Configure",
        items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/rag" },
            { icon: Files, label: "Projects", path: "/rag/projects" },
            { icon: Database, label: "Data Sources", path: "/rag/sources" },
            {
                icon: UploadCloud,
                label: "Ingestion Pipeline",
                path: "/rag/ingestion",
            },
            { icon: Bot, label: "Model Configuration", path: "/rag/models" },
        ],
    },
    {
        title: "Management",
        items: [
            {
                icon: ShieldCheck,
                label: "Security & Access",
                path: "/rag/security",
            },
            { icon: Workflow, label: "Integration", path: "/rag/integration" },
        ],
    },
    {
        title: "Agents",
        items: [
            {
                icon: Activity,
                label: "RAG Monitoring",
                path: "/rag/rag-monitor",
            },
        ],
    },
];