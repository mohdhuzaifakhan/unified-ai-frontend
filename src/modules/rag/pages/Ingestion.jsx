import { useState, useEffect } from "react";
import {
  SplitSquareHorizontal,
  Database,
  Terminal,
  Play,
  Loader2,
  Save,
} from "lucide-react";
import { dataIngestionApi } from "@/services/api";
import { useProject } from "../context/ProjectContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataSourcesApi } from "@/services/api";

const Ingestion = () => {
  const [isRunConfirmOpen, setIsRunConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [configId, setConfigId] = useState(null);

  const { selectedProject } = useProject();
  const [sources, setSources] = useState([]);
  const [error, setError] = useState();

  const [config, setConfig] = useState({
    chunk_size: 1000,
    chunk_overlap: 200,
    separators: ["\n\n", "\n", " ", ""],
    embedding_model: "all-MiniLM-L6-v2",
    vector_store: "mongodb",
    projectId: null,
    datasourceId: null,
  });

  const projectId = selectedProject?._id || null;

  useEffect(() => {
    if (!projectId) return;

    dataIngestionApi
      .getConfig(projectId)
      .then((cfg) => {
        setConfigId(cfg._id);
        setConfig((prev) => ({
          ...prev,
          chunk_size: cfg.chunk_size,
          chunk_overlap: cfg.chunk_overlap,
          separators: cfg.separators,
          embedding_model: cfg.embedding_model,
          vector_store: cfg.vector_store,
          projectId: cfg?.projectId || projectId,
          datasourceId: cfg?.datasourceId || null,
        }));
      })
      .catch(console.error);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setError(
        "No project selected. Please select a project from the projects page."
      );
      return;
    }
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dataSourcesApi.getAll(projectId);
      setSources(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data sources:", err);
      setError("Failed to load data sources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]:
        name === "chunk_size" || name === "chunk_overlap"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSave = async () => {
    if (!projectId) {
      toast.error("Project is required.");
      return;
    }

    if (!config.datasourceId) {
      toast.error("Data source is required.");
      return;
    }

    setSaving(true);
    try {
      const newConfig = await dataIngestionApi.saveConfig({
        ...config,
        projectId,
      });
      setConfigId(newConfig.config._id);
      toast.success("Configuration saved successfully!");
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmRunPipeline = async () => {
    if (!projectId) {
      toast.error("Project is required.");
      return;
    }

    if (!config.datasourceId) {
      toast.error("Data source is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await dataIngestionApi.runPipeline(
        configId,
        config.datasourceId
      );
      toast.success(res.message || "Pipeline started successfully");
    } catch {
      toast.error("Failed to start pipeline");
    } finally {
      setLoading(false);
      setIsRunConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Ingestion Pipeline
          </h2>
          <p className="text-slate-400">
            Configure how documents are processed and indexed.
          </p>
        </div>
        <button
          onClick={() => setIsRunConfirmOpen(true)}
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Run Pipeline
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
                <SplitSquareHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Chunking Strategy
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Chunk Size
                </label>
                <input
                  type="number"
                  name="chunk_size"
                  value={config.chunk_size}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Characters per chunk
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Overlap
                </label>
                <input
                  type="number"
                  name="chunk_overlap"
                  value={config.chunk_overlap}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Overlap characters
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Separators
              </label>
              <div className="flex flex-wrap gap-2">
                {config.separators.map((sep, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 font-mono border border-slate-700"
                  >
                    {sep === " "
                      ? "(space)"
                      : sep === ""
                      ? "(empty)"
                      : JSON.stringify(sep).slice(1, -1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Embedding & Storage
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Embedding Model
                </label>
                <select
                  name="embedding_model"
                  value={config.embedding_model}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                >
                  {/* <option value="bge-base-en">BGE Base EN v1.5 (BAAI)</option>
                  <option value="bge-m3">BGE-M3 Multilingual (BAAI)</option>
                  <option value="e5-base">E5 Base v2 (IntFloat)</option> */}
                  {/* <option value="e5-large">E5 Large v2 (IntFloat)</option> */}
                  {/* <option value="e5-mistral-7b">E5 Mistral 7B Instruct</option> */}
                  {/* <option value="nomic-embed-v1">Nomic Embed Text v1</option> */}
                  {/* <option value="nomic-embed-v2">Nomic Embed Text v2</option> */}
                  {/* <option value="jina-embeddings-v2">Jina Embeddings v2</option> */}
                  {/* <option value="jina-embeddings-v3">Jina Embeddings v3</option> */}
                  {/* <option value="qwen3-embedding-0.6b">
                    Qwen3 Embedding 0.6B
                  </option> */}
                  {/* <option value="qwen3-embedding-4b">Qwen3 Embedding 4B</option> */}
                  {/* <option value="minilm-l6">MiniLM L6 v2 (Sentence Transformers)</option> */}
                  {/* <option value="mpnet-base">MPNet Base v2 (Sentence Transformers)</option> */}
                  {/* <option value="labse">LaBSE Multilingual</option> */}
                  {/* <option value="vertex-gecko">Vertex AI Gecko (Google)</option>
                  <option value="openai-ada">OpenAI Ada-002</option>
                  <option value="huggingface">HuggingFace Local</option> */}
                  <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Vector Store
                </label>
                <select
                  name="vector_store"
                  value={config.vector_store}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                >
                  <option value="mongodb">MongoDB Vector Store</option>
                  {/* <option value="pinecone">Pinecone</option>
                  <option value="faiss">FAISS (Local, Facebook AI)</option>
                  <option value="milvus">
                    Milvus (Distributed, Production Grade)
                  </option>
                  <option value="qdrant">
                    Qdrant (Rust-based, High Performance)
                  </option>
                  <option value="weaviate">
                    Weaviate (Graph + Vector Search)
                  </option>
                  <option value="chroma">
                    ChromaDB (Lightweight, Dev Friendly)
                  </option>
                  <option value="postgres-pgvector">
                    PostgreSQL + pgvector
                  </option> */}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Data Source <span className="text-red-500">*</span>
                </label>

                <select
                  name="datasourceId"
                  value={config.datasourceId || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                >
                  <option value="" disabled>
                    Select a data source
                  </option>

                  {sources.map((source) => (
                    <option key={source._id} value={source._id}>
                      {source.name}
                    </option>
                  ))}
                </select>

                <p className="text-[10px] text-slate-500 mt-1">
                  Choose which data source will be ingested
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Configuration
          </button>
        </div>
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-300">
                Pipeline Logs
              </h3>
            </div>
            <div className="flex-1 bg-black/50 rounded-lg p-3 font-mono text-xs text-slate-400 overflow-y-auto max-h-[400px]">
              <p className="text-emerald-500">[10:00:23] System initialized</p>
              <p className="text-slate-500">[10:00:24] Waiting for jobs...</p>
              {loading && (
                <p className="text-blue-400 mt-2 animate-pulse">
                  Processing documents...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isRunConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsRunConfirmOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Run Ingestion Pipeline
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    This will start a long-running ingestion task
                  </p>
                </div>
                <button
                  onClick={() => !loading && setIsRunConfirmOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 text-sm text-slate-300 space-y-3">
                <p>
                  Are you sure you want to start the ingestion pipeline for this
                  project?
                </p>

                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                  <li>This process may take several minutes to complete.</li>
                  <li>
                    You can track the progress and status from the pipeline
                    logs.
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 p-6 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRunConfirmOpen(false)}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 border-0"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleConfirmRunPipeline}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 border-0"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting...
                    </div>
                  ) : (
                    "Run Pipeline"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ingestion;
