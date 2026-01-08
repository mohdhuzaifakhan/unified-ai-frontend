import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "@/static/app-content/colors";
import ShadowContainer from "@/components/ui/shadow-container";
import InputGroup from "@/components/ui/input-group";
export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
      }
      navigate("/rag");
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  return (
    <div
      className={`min-h-screen ${colors.backgroundColor} flex items-center justify-center relative overflow-hidden`}
    >
      <ShadowContainer />
      <motion.div className="w-full max-w-4xl grid lg:grid-cols-2 overflow-hidden">
        <div className="hidden lg:flex flex-col justify-between p-12  border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                UnifiedAI
              </span>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Empowering your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                AI Intelligence.
              </span>
            </h2>

            <ul className="space-y-5">
              {[
                "Advanced RAG Workflows",
                "Instant Data Vectorization",
                "Secure Enterprise Storage",
              ].map((text) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-8 lg:p-12 relative  flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h3>
            <p className="text-slate-400">
              {isLogin
                ? "Enter your details to access your workspace."
                : "Create a account to start building."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-2">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-2">
                <InputGroup
                  label="First Name"
                  icon={<User />}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
                <InputGroup
                  label="Last Name"
                  icon={<User />}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
            )}

            <InputGroup
              label="Email Address"
              icon={<Mail />}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
            />

            <div className="space-y-1.5">
              <InputGroup
                label="Password"
                icon={<Lock />}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-blue-300 hover:text-blue-400 transition-colors"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size={"sm"}
              disabled={loading}
              className={colors.buttonColorClass + " w-full mt-4 flex items-center justify-center gap-2 group"}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? "New here? " : "Already have an account? "}
              <span className="text-blue-300 font-semibold underline underline-offset-4 decoration-blue-400/30">
                {isLogin ? "Create account" : "Sign in"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
