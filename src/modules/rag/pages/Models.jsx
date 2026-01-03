import { useEffect, useState } from "react";
import {
  Bot,
  Cpu,
  Zap,
  CheckCircle2,
  KeyRound,
  Save,
  Loader2,
  Terminal,
} from "lucide-react";
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
      desc: "Top-tier intelligence for complex reasoning.",
      icon: Zap,
    },
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      provider: "Google",
      desc: "High-speed model for low-latency tasks.",
      icon: Zap,
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      desc: "Balanced flagship model for all use cases.",
      icon: Bot,
    },
    {
      id: "claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      desc: "Expert at instructions and coding tasks.",
      icon: Bot,
    },
  ];

  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchConfig = async () => {
      try {
        const cfg = await modelConfigApi.getConfig(selectedProject._id);
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
    if (!selectedProject?._id) {
      toast.error("Please select a project first");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        model: selectedModel,
        apiKey,
        temperature,
        maxTokens,
        systemPrompt,
      };

      await modelConfigApi.saveConfig(selectedProject._id, payload);
      toast.success("Configuration updated successfully");
    } catch (err) {
      toast.error("Failed to update config");
    } finally {
      setIsSaving(false);
    }
  };

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center max-w-sm mx-auto">
        <Bot className="text-slate-700 mb-6" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">Model Config Unavailable</h3>
        <p className="text-slate-400 text-sm">Select a project to configure model architecture and parameters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">LLM Model Config</h2>
          <p className="text-slate-400 text-sm mt-1">Select the LLM and parameters for your RAG system.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Config
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${selectedModel === model.id
              ? "bg-slate-800 border-blue-500 shadow-md ring-1 ring-blue-500/50"
              : "bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/40 hover:border-slate-600"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${selectedModel === model.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                <model.icon size={20} />
              </div>
              {selectedModel === model.id && <CheckCircle2 size={16} className="text-blue-500" />}
            </div>
            <h3 className="text-sm font-bold text-white">{model.name}</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">{model.provider}</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{model.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <KeyRound size={20} className="text-blue-500" />
              <h3 className="font-bold text-white text-sm">Provider API Key</h3>
            </div>
            <div className="space-y-1.5">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter key for provider..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all font-mono"
              />
              <p className="text-[10px] text-slate-600 italic">Keys are encrypted before storage.</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Cpu size={20} className="text-emerald-500" />
              <h3 className="font-bold text-white text-sm">Inference Tuning</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-500">Temperature</span>
                  <span className="text-white">{temperature}</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.1"
                  value={temperature} onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-500">Max Tokens</span>
                  <span className="text-white">{maxTokens}</span>
                </div>
                <input
                  type="range" min="256" max="4096" step="128"
                  value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Terminal size={20} className="text-blue-500" />
            <h3 className="font-bold text-white text-sm">System Instructions</h3>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Define the bot's expertise and behavior guidelines..."
            className="flex-1 min-h-[300px] w-full bg-slate-950 border border-slate-800 rounded-lg p-5 text-sm text-slate-300 font-mono focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
          />
        </div>
      </div>
    </div>
  );
};

export default ModelConfiguration;
