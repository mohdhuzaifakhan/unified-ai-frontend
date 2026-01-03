import React, { useEffect, useState } from "react";
import {
  Code2,
  MessageSquare,
  Copy,
  Key,
  Database,
  FileText,
  Boxes,
  Layers,
  CheckCircle,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getScript } from "../../../static/script-string";
import { getWidgetConfigString } from "@/static/widget-config-string";
import { useProject } from "../context/ProjectContext";
import { dataIngestionApi } from "@/services/api";
import { apiKeysApi } from "@/services/api/apiKeysApi";
import { useNavigate } from "react-router-dom";
import { modelConfigApi } from "@/services/api/modelConfigApi";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3002";

const Stat = ({ icon, label, value, color }) => {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-slate-800/60">
      <div className={`p-1.5 rounded-md ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm text-white font-semibold">{value ?? "-"}</p>
      </div>
    </div>
  );
};

const Integration = () => {
  const { selectedProject } = useProject();
  const navigate = useNavigate();

  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [embeddingMeta, setEmbeddingMeta] = useState([]);
  const [selectedEmbedding, setSelectedEmbedding] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [modelConfig, setModelConfig] = useState(null);

  const handleCopy = (id) => {
    const text = document.getElementById(id)?.innerText;
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Snippet copied");
  };

  const injectWidgetScript = () => {
    if (!selectedEmbedding) {
      toast.error("Please select an embedding configuration first");
      return;
    }

    if (!selectedApiKey) {
      toast.error("Please select an API key");
      return;
    }

    if (document.getElementById("rag-widget-script")) {
      document.getElementById("rag-launcher")?.click();
      return;
    }

    const script = document.createElement("script");
    script.id = "rag-widget-script";
    script.textContent = getScript(
      BASE_URL,
      selectedApiKey.key,
      selectedEmbedding.embeddingConfigId?._id,
      modelConfig?._id
    );

    document.body.appendChild(script);

    setTimeout(() => {
      setWidgetLoaded(true);
      document.getElementById("rag-launcher")?.click();
      toast.success("Widget loaded successfully");
    }, 500);
  };

  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchRuns = async () => {
      try {
        const data =
          await dataIngestionApi.getAllEmbeddingsWithMetadataOfProject(
            selectedProject._id
          );

        const modelConfig = await modelConfigApi.getConfig(selectedProject._id);
        setModelConfig(modelConfig || null);
        setEmbeddingMeta(data || []);
        setSelectedEmbedding(data?.[0] || null);
      } catch {
        toast.error("Failed to load embeddings");
      }
    };

    fetchRuns();
  }, [selectedProject?._id]);

  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchApiKeys = async () => {
      try {
        setLoadingKeys(true);
        const projectKeys = await apiKeysApi.getKeys(selectedProject._id);
        setApiKeys(projectKeys);
        setSelectedApiKey(projectKeys[0] || null);
      } catch (error) {
        toast.error("Failed to load API keys");
        setApiKeys([]);
        setSelectedApiKey(null);
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchApiKeys();
  }, [selectedProject?._id]);

  useEffect(() => {
    document.body.style.overflow = showConfigModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfigModal]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Chatbot Integration</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Configure and embed your RAG chatbot</p>
        </div>
        <button
          onClick={() => setShowConfigModal(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
        >
          Select Embedding
        </button>
      </div>

      {/* Configuration Section */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-400" />
          Configuration
        </h3>

        {/* API Key Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-300">
              API Key
            </label>
            {apiKeys.length === 0 && !loadingKeys && (
              <button
                onClick={() => navigate("/rag/security")}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Create API Key
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {loadingKeys ? (
            <div className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading API keys...</span>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 text-sm">
              No API keys found for this project. Please create one in the Security page.
            </div>
          ) : (
            <select
              value={selectedApiKey?._id || ""}
              onChange={(e) => {
                const key = apiKeys.find((k) => k._id === e.target.value);
                setSelectedApiKey(key || null);
              }}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {apiKeys.map((key) => (
                <option key={key._id} value={key._id} className="bg-slate-800">
                  {key.apiKeyName} - {key.key}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Embedding Display */}
        {selectedEmbedding && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Selected Embedding</p>
            <p className="text-white font-medium">{selectedEmbedding.embedding_model}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400">
                {selectedEmbedding.vector_store}
              </span>
              <span className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-400">
                {selectedEmbedding.datasourceId?.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Widget Preview & Code */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            Embed Code
          </h3>

          <div className="flex items-center gap-3">
            {widgetLoaded && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Widget Active
              </span>
            )}
            <button
              onClick={injectWidgetScript}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Test Widget
            </button>
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => handleCopy("embed-code")}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-slate-700 hover:bg-slate-600 p-2 rounded-lg"
          >
            <Copy className="w-4 h-4 text-white" />
          </button>

          <pre
            id="embed-code"
            className="bg-slate-950 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto border border-slate-800"
          >
            {selectedEmbedding && selectedApiKey
              ? getWidgetConfigString(
                BASE_URL,
                selectedEmbedding.stored_embedding_db_name,
                selectedApiKey.key,
                selectedEmbedding.embeddingConfigId?._id,
                modelConfig?._id
              )
              : "// Configure API key and select an embedding to generate widget code"}
          </pre>
        </div>
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowConfigModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-slate-900 w-full max-w-3xl rounded-xl border border-slate-700 overflow-hidden shadow-2xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">
                  Select Embedding Configuration
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {embeddingMeta.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No embedding configurations found. Please create one first.
                  </div>
                ) : (
                  embeddingMeta.map((item) => {
                    const active = selectedEmbedding?._id === item._id;
                    return (
                      <div
                        key={item._id}
                        onClick={() => setSelectedEmbedding(item)}
                        className={`p-4 rounded-lg cursor-pointer border transition ${active
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-white font-semibold">
                            {item.embedding_model}
                          </p>
                          {active && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>

                        <div className="flex gap-2 mb-3 flex-wrap">
                          <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400 flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            {item.vector_store}
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-400 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {item.datasourceId?.name || "N/A"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <Stat
                            icon={<Layers className="w-3 h-3" />}
                            label="Chunk Size"
                            value={item.embeddingConfigId?.chunk_size}
                            color="blue"
                          />
                          <Stat
                            icon={<Layers className="w-3 h-3" />}
                            label="Overlap"
                            value={item.embeddingConfigId?.chunk_overlap}
                            color="cyan"
                          />
                          <Stat
                            icon={<Database className="w-3 h-3" />}
                            label="Chunks"
                            value={item.chunksStored}
                            color="emerald"
                          />
                          <Stat
                            icon={<Boxes className="w-3 h-3" />}
                            label="Status"
                            value={item.status}
                            color="amber"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-slate-700 flex gap-3">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedEmbedding) {
                      setShowConfigModal(false);
                      toast.success("Embedding configuration selected");
                    } else {
                      toast.error("Please select an embedding");
                    }
                  }}
                  disabled={!selectedEmbedding}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Integration;
