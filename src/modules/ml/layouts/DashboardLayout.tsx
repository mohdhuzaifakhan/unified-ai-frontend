import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Database, Box, Settings, Bell, Search, Shield, Cpu, CreditCard, Rocket, Wrench, BarChart2, PlusCircle, LogOut } from "lucide-react";
import { cn } from "../components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
    { name: "Overview", icon: LayoutDashboard, path: "/ml" },
    { name: "Projects", icon: FolderKanban, path: "/ml/projects" },
    { name: "Data Sources", icon: Database, path: "/ml/data" },
    { name: "Preprocessing", icon: Cpu, path: "/ml/preprocessing" },
    { name: "Model Builder", icon: PlusCircle, path: "/ml/builder" },
    { name: "Model Registry", icon: Box, path: "/ml/models" },
    { name: "Deployments", icon: Rocket, path: "/ml/deployments" },
    { name: "Maintenance", icon: Wrench, path: "/ml/maintenance" },
    { name: "Business Impact", icon: BarChart2, path: "/ml/business-impact" },
    { name: "Security", icon: Shield, path: "/ml/security" },
    { name: "Billing", icon: CreditCard, path: "/ml/billing" },
    { name: "Settings", icon: Settings, path: "/ml/settings" },
];

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
    };

    return (
        <div className="min-h-screen bg-background text-slate-100 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-glass-border bg-glass-surface/30 backdrop-blur-xl flex flex-col fixed h-full z-20">
                <div className="h-16 flex items-center px-6 border-b border-glass-border">
                    <div className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                        AutoML
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-glass-border space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-purple-500 flex items-center justify-center text-xs font-bold">
                            {getInitials(user?.firstName, user?.lastName)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</div>
                            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-glass-border bg-glass-surface/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 text-slate-400">
                        <Search className="w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search projects, models..."
                            className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-slate-500 text-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
