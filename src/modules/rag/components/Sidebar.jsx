import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    UploadCloud,
    Bot,
    Workflow,
    ShieldCheck,
    Settings,
    LogOut,
    Activity,
    BarChart2,
    Code,
    Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navGroups = [
        {
            title: 'Configure',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/rag' },
                { icon: Database, label: 'Projects', path: '/rag/projects' },
                { icon: Database, label: 'Data Sources', path: '/rag/sources' },
                { icon: UploadCloud, label: 'Ingestion Pipeline', path: '/rag/ingestion' },
                { icon: Bot, label: 'Model Configuration', path: '/rag/models' },
            ]
        },
        {
            title: 'Management',
            items: [
                { icon: ShieldCheck, label: 'Security & Access', path: '/rag/security' },
                { icon: Workflow, label: 'Integration', path: '/rag/integration' },
            ]
        },
        {
            title: 'Agents',
            items: [
                { icon: UploadCloud, label: 'Agent Monitoring', path: '/rag/agent-monitoring' },
                { icon: Workflow, label: 'Workflow Builder', path: '/rag/agent-workflows' },
                { icon: Database, label: 'Agent Evaluation', path: '/rag/agent-evaluation' },
                { icon: Settings, label: 'Agent Calibration', path: '/rag/agent-config' },
            ]
        }
    ];

    return (
        <aside className="w-64 h-screen bg-dark-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 overflow-y-auto custom-scrollbar transition-all duration-300">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2 text-brand-500 font-bold text-xl tracking-tight">
                    <Workflow className="w-6 h-6" />
                    <span>RAG Cloud</span>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-6">
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx}>
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{group.title}</p>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                      ${isActive
                                            ? 'bg-brand-500/15 text-brand-400 border-r-2 border-brand-400 rounded-r-none'
                                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
