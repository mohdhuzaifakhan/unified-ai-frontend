import { useEffect, useState } from "react";
import {
  Bot,
  Cpu,
  Zap,
  CheckCircle2,
  KeyRound,
  Save,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import { useProject } from "../context/ProjectContext";
import { modelConfigApi } from "@/services/api/modelConfigApi";
import toast from "react-hot-toast";

const ModelConfiguration = () => {
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-pro");
  const [isSaving, setIsSaving] = useState(false);
  const { selectedProject } = useProject();
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState("");

  const models = [
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      provider: "Google",
      desc: "Best for complex reasoning, long context, and high-quality responses.",
      icon: Zap,
    },
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      provider: "Google",
      desc: "Optimized for speed, low latency, and high-throughput workloads.",
      icon: Zap,
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      desc: "Flagship multimodal model for reasoning, coding, and analysis.",
      icon: Bot,
    },
    {
      id: "gpt-4.1-mini",
      name: "GPT-4.1 Mini",
      provider: "OpenAI",
      desc: "Cost-efficient model for chat, summarization, and lightweight reasoning.",
      icon: Bot,
    },
    {
      id: "claude-3.5-opus",
      name: "Claude 3.5 Opus",
      provider: "Anthropic",
      desc: "Top-tier reasoning, writing quality, and complex instruction following.",
      icon: Bot,
    },
    {
      id: "claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      desc: "Balanced model with excellent reasoning, speed, and cost efficiency.",
      icon: Bot,
    },
  ];

  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchConfig = async () => {
      try {
        const cfg = await modelConfigApi.getConfig(selectedProject._id);
        console.log("CFG:", cfg)
        if (!cfg) return;

        setSelectedModel(cfg.model ?? "gemini-2.5-pro");
        setApiKey(cfg.apiKey ?? "");
        setTemperature(cfg.temperature ?? 0.7);
        setMaxTokens(cfg.maxTokens ?? 2048);
        setSystemPrompt(cfg.systemPrompt ?? "");
      } catch (err) {
        console.error("Failed to load model config", err);
      }
    };

    fetchConfig();
  }, [selectedProject?._id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!selectedModel) {
        toast.error("Please select a model");
        return;
      }

      if (!apiKey) {
        toast.error("Please enter API key");
        return;
      }

      const payload = {
        model: selectedModel,
        apiKey,
        temperature,
        maxTokens,
        systemPrompt,
      };

      const response = await modelConfigApi.saveConfig(
        selectedProject._id,
        payload
      );

      console.log("RES:", response);
      toast.success("Model config saved successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save config");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Model Configuration
          </h2>
          <p className="text-slate-400">
            Configure models, API keys, and generation behavior.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 rounded-md font-sm shadow-sm shadow-brand-500/20 transition-all flex items-center gap-2
    ${
      isSaving
        ? "bg-blue-600 opacity-70 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-500 text-white"
    }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Configuration
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={clsx(
              "relative p-6 rounded-xl border border-slate-700/50 cursor-pointer transition-all group",
              selectedModel === model.id
                ? "bg-brand-500/10 border-brand-500/50 shadow-lg shadow-brand-500/5"
                : "bg-slate-900/50 hover:border-slate-600"
            )}
          >
            {selectedModel === model.id && (
              <div className="absolute top-4 right-4 text-brand-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div
              className={clsx(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors",
                selectedModel === model.id
                  ? "bg-brand-500/20 text-brand-400"
                  : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
              )}
            >
              <model.icon className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{model.name}</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
              {model.provider}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {model.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Provider API Key
              </h3>
            </div>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-••••••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-all"
            />

            <p className="mt-2 text-xs text-slate-500">
              Used only for secure inference. Never exposed to clients.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 space-y-8">
            <h3 className="text-lg font-semibold text-white">
              Inference Parameters
            </h3>

            <div>
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Temperature</span>
                <span>{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Max Output Tokens</span>
                <span>{maxTokens}</span>
              </div>
              <input
                type="range"
                min="128"
                max="4096"
                step="128"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">
            System Prompt
          </h3>

          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are an AI assistant..."
            className="flex-1 w-full min-h-[350px] bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm leading-relaxed focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>
      </div>

      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Fine-Tuning (Coming Soon)
            </h3>
            <p className="text-slate-400 max-w-2xl">
              Train custom models on your data using LoRA adapters directly
              within the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelConfiguration;
