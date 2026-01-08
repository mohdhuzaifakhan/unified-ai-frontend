import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Zap,
  Layers,
  Bot,
  User,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { borders, colors, fontSizes } from "@/static/app-content/colors";
import ShadowContainer from "@/components/ui/shadow-container";

const plans = [
  {
    name: "Developer",
    price: "$0",
    description: "Ideal for testing unified pipelines and prototyping.",
    features: [
      "1,000 RAG Vector Indexing",
      "Standard LLM Context Window",
      "Basic AutoML Experiments",
      "Single-Action AI Agents",
      "Community Discord Access",
    ],
    buttonText: "Start Free",
    active: false,
  },
  {
    name: "Production",
    price: "$79",
    description: "Scalable infrastructure for commercial AI apps.",
    features: [
      "Unlimited RAG Data Ingestion",
      "Advanced Agent Tool-Calling",
      "Distributed ML Training",
      "Custom Fine-Tuning Labs",
      "Priority API Latency",
    ],
    buttonText: "Launch Production",
    active: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-stack AI governance for organizations.",
    features: [
      "Dedicated GPU Instances",
      "Private Vector Cloud",
      "SOC2 & HIPAA Compliance",
      "Multi-Tenant Agent Fleet",
      "24/7 Dedicated Support",
    ],
    buttonText: "Contact Sales",
    active: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${colors.backgroundColor} overflow-x-hidden`}>
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-12">
          <ShadowContainer />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-md border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-wider"
          >
            <Zap className="w-3 h-3 fill-current" /> Scalable Compute
          </motion.div>
          <h1 className={`${fontSizes.headerTextClass} font-bold text-white mb-3 tracking-tight`}>
            Unified Service <span className="text-primary">Tiers</span>
          </h1>
          <p className={`${colors.textColorClass} text-sm max-w-xl mx-auto`}>
            Choose a plan that fits your current AI scale. Switch between RAG,
            ML, and Agent modules with a single unified subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col p-6 ${borders.borderRadiusClass} border transition-all duration-300 ${
                plan.active
                  ? "bg-slate-900/50 border-primary/50 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                  : "bg-slate-900/20 border-white/5"
              }`}
            >
              {plan.active && (
                <div className="absolute -top-3 right-6 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-lg">
                  RECOMMENDED
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-slate-500 text-sm">/mo</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Platform Features
                </p>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <Check
                      className={`w-3.5 h-3.5 ${
                        plan.active ? "text-primary" : "text-slate-600"
                      }`}
                    />
                    <span className="text-xs text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.active ? "default" : "outline"}
                className={`${
                  plan.active
                    ? `${colors.buttonColorClass}`
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                }`}
                onClick={() => navigate("/login")}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-t border-white/5">
          {[
            { icon: Layers, label: "Advanced RAG", detail: "Hybrid Search" },
            { icon: Bot, label: "Automated ML", detail: "Hyper-tuning" },
            { icon: User, label: "Smart Agents", detail: "Tool-Calling" },
            { icon: ShieldCheck, label: "Secure Ops", detail: "AES-256 Data" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">{item.label}</p>
                <p className="text-[10px] text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
