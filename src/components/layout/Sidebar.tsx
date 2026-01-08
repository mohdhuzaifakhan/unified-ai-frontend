import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/ui/logo";
import { colors } from "@/static/app-content/colors";

const Sidebar = ({ navGroups }) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <aside
      className={`w-64 h-screen ${colors.backgroundColor} border-r border-slate-800 flex flex-col fixed left-0 top-0 overflow-y-auto custom-scrollbar transition-all duration-300`}
    >
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <Logo />
      </div>

      <nav className="flex-1 py-6 px-3 space-y-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) => `
                                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                      ${
                                        isActive
                                          ? "bg-slate-500/15 text-brand-400 border-brand-400"
                                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                                      }
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
