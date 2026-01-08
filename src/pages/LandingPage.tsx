import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Cpu,
  Globe,
  Play,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/static/app-content/service-metadata";
import Navbar from "@/components/ui/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { colors, fontSizes, borders } from "@/static/app-content/colors";
import ShadowContainer from "@/components/ui/shadow-container";
import NewReleaseUpdateBadge from "@/components/ui/new-release-update-badge";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigate = (path: string) => {
    if (isAuthenticated) navigate(path);
    else navigate("/login");
  };
  return (
    <div className={`min-h-screen ${colors.backgroundColor} overflow-x-hidden`}>
      <Navbar />
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <ShadowContainer />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <NewReleaseUpdateBadge label="RAG Service is Live" />
          <h1
            className={`${fontSizes.headerTextClass} font-bold text-white mb-6 tracking-tight leading-[1.1]`}
          >
            One Unified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              AI Services Ecosystem
            </span>
          </h1>

          <p
            className={`text-sm ${colors.textColorClass} mb-10 max-w-2xl mx-auto leading-relaxed`}
          >
            From **RAG** and **AutoML** to **Autonomous Agents**. Deploy
            professional-grade AI services on a single, secured,
            enterprise-ready infrastructure.
          </p>

          <div className="flex justify-center items-center gap-4">
            <Button
              size="sm"
              className={colors.buttonColorClass}
              onClick={() => handleNavigate("/rag")}
            >
              Launch RAG <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="px-4 border-white/10 hover:bg-white/5"
            >
              <Play className="mr-2 w-4 h-4 fill-current" /> View Demo
            </Button>
          </div>
        </motion.div>
      </section>

      <section id="services" className={`py-10 relative`}>
        <ShadowContainer />
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={service.status === "active" ? { scale: 1.02 } : {}}
                onClick={() =>
                  service.status === "active" && handleNavigate(service.path!)
                }
                className={`relative flex flex-col p-5 ${
                  borders.borderRadiusClass
                } border transition-all duration-300 ${
                  service.status === "active"
                    ? "bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border-primary/40 shadow-lg shadow-primary/5 cursor-pointer ring-1 ring-primary/20"
                    : "bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg shadow-black/20`}
                  >
                    {service.status === "active" ? (
                      <service.icon className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-4 h-4 text-white/40" />
                    )}
                  </div>
                  {service.status === "coming-soon" && (
                    <span className="text-[9px] font-bold text-slate-500 bg-white/5 border-1 border-white/5 px-2 py-0.5 rounded-md uppercase">
                      Soon
                    </span>
                  )}
                </div>

                <div className="flex-grow">
                  <h3
                    className={`text-base font-bold mb-1.5 tracking-tight ${
                      service.status === "active"
                        ? "text-white"
                        : "text-slate-400"
                    }`}
                  >
                    {service.name}
                  </h3>
                  <p className="text-slate-400 text-[12px] leading-snug mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5 mb-4">
                    {service.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[11px] font-medium"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            service.status === "active"
                              ? "text-primary"
                              : "text-slate-700"
                          }`}
                        />
                        <span
                          className={
                            service.status === "active"
                              ? "text-slate-200"
                              : "text-slate-500"
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {service.status === "active" && (
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between group/btn">
                    <span className="text-[11px] font-bold text-primary">
                      Enter Dashboard
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 border-t border-white/5">
       <ShadowContainer />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Production-Grade{" "}
              <span className="text-primary">RAG Infrastructure</span>
            </h2>
            <div className="grid gap-3">
              {[
                {
                  icon: Cpu,
                  title: "Vector Engine",
                  desc: "High-speed semantic search across millions of data points.",
                },
                {
                  icon: Globe,
                  title: "Data Connectors",
                  desc: "Seamless ingestion from PDFs, APIs, and cloud storage.",
                },
                {
                  icon: Shield,
                  title: "Privacy-First",
                  desc: "Enterprise-grade encryption for proprietary knowledge.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`flex gap-4 p-4 ${borders.borderRadiusClass} bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors`}
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {f.title}
                    </h4>
                    <p className="text-slate-400 text-[12px] leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`bg-slate-900/60 ${borders.borderRadiusClass} p-1 border border-white/10 shadow-2xl`}
          >
            <div className="bg-black/40 rounded-[14px] p-5 font-mono text-[11px] leading-relaxed">
              <div className="flex gap-1.5 mb-5 border-b border-white/5 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <p className="text-primary">
                $ unified-ai ingest --source ./legal-docs/
              </p>
              <p className="text-green-400">
                ✓ Ingestion complete: 1,420 chunks vectorized.
              </p>
              <p className="text-slate-500 mt-4 italic font-sans">
                // Querying Knowledge Base...
              </p>
              <p className="text-white mt-2 font-sans">
                “Based on the contract on page 4, the termination notice period
                is 30 days.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center border-t border-white/5">
        <p className="text-slate-500 text-[11px] font-medium tracking-[0.2em] uppercase">
          © 2026 Unified AI Platform • The complete service ecosystem
        </p>
      </footer>
    </div>
  );
}
