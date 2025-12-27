import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Shield,
  BarChart, Cpu, Globe, Users, Play
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-slate-200 font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-glass-surface/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AutoML</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            {["Features", "Solutions", "Pricing", "Docs"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 is now live
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight text-white mb-6">
              AutoML for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Modern Teams
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
              Transform raw data into production-grade machine learning models in minutes.
              No Ph.D. required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base px-8 h-12 bg-white text-background hover:bg-slate-200"
                onClick={() => navigate("/signup")}
              >
                Start Building Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-slate-700 hover:bg-white/5"
              >
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-xs font-bold text-white z-${10 - i}`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ data scientists</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20" />
            <div className="relative rounded-2xl border border-white/10 bg-class-surface/80 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="ml-4 text-xs text-slate-500 font-mono">training_job.py</div>
              </div>
              <div className="p-6 space-y-4 font-mono text-sm">
                <div className="flex gap-4">
                  <span className="text-slate-600">1</span>
                  <span className="text-purple-400">import</span> <span className="text-slate-300">automl</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600">2</span>
                  <span></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600">3</span>
                  <span className="text-slate-500"># Initialize predictor</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600">4</span>
                  <span className="text-blue-400">predictor</span> <span className="text-slate-300">=</span> <span className="text-yellow-400">automl</span>.<span className="text-blue-300">Predictor</span>()
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600">5</span>
                  <span></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600">6</span>
                  <span className="text-slate-500"># Train on data</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600">7</span>
                  <span className="text-blue-400">model</span> <span className="text-slate-300">=</span> <span className="text-blue-400">predictor</span>.<span className="text-yellow-300">fit</span>(
                </div>
                <div className="flex gap-4 pl-12">
                  <span className="text-green-400">"churn_data.csv"</span>,
                </div>
                <div className="flex gap-4 pl-12">
                  <span className="text-blue-300">target</span>=<span className="text-green-400">"leaving"</span>,
                </div>
                <div className="flex gap-4 pl-12">
                  <span className="text-blue-300">time_limit</span>=<span className="text-orange-400">3600</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600">8</span>
                  <span className="text-slate-300">)</span>
                </div>
                <div className="flex gap-4 mt-4">
                  <span className="text-slate-600">9</span>
                  <span className="text-green-500">&gt;&gt; Training complete. Accuracy: 98.4%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Everything you need to <br />
              <span className="text-primary">deploy AI at scale</span>
            </h2>
            <p className="text-slate-400 text-lg">
              From data ingestion to model monitoring, we handle the heavy lifting
              so you can focus on business value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart,
                title: "Auto-Feature Engineering",
                desc: "Automatically detect types, handle missing values, and generate high-impact features."
              },
              {
                icon: Cpu,
                title: "Model Selection",
                desc: "Intelligently tests XGBoost, CatBoost, Neural Nets, and Ensembles to find the winner."
              },
              {
                icon: Globe,
                title: "One-Click Deploy",
                desc: "Instant REST API endpoints for your models. Auto-scaling included."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "SOC2 Type II compliant. Role-based access control and encrypted artifacts."
              },
              {
                icon: Users,
                title: "Collaboration",
                desc: "Shared workspaces, experiments, and model registry for your entire team."
              },
              {
                icon: Zap,
                title: "Real-time Inference",
                desc: "Low-latency predictions running on optimized edge infrastructure."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© 2025 AutoML Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
