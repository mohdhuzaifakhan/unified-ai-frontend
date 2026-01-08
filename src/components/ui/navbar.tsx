import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "./logo";
import { Button } from "./button";
import { colors } from "@/static/app-content/colors";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigate = (path: string) => {
    if (isAuthenticated) navigate(path);
    else navigate("/login");
  };
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-glass-surface/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
        <Logo />

        <div className="hidden md:flex gap-8 text-[13px] font-medium text-slate-400">
          <a href="#services" className="hover:text-white transition-colors">
            Services
          </a>

          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <button
            onClick={() => navigate("/pricing")}
            className="hover:text-white transition-colors"
          >
            Pricing
          </button>

          <button
            onClick={() => navigate("/docs")}
            className="hover:text-white transition-colors"
          >
            Docs
          </button>
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-slate-400 hover:text-white"
            >
              Log in
            </Button>
          )}
          <Button
            size="sm"
            className={`${colors.buttonColorClass}`}
            onClick={() => handleNavigate("/rag")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
