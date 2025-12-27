import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Settings2, SplitSquareHorizontal, Database,
    Terminal, Play, Loader2, Save
} from 'lucide-react';
import clsx from 'clsx';

const Ingestion = () => {
    const [config, setConfig] = useState({
        chunk_size: 1000,
        chunk_overlap: 200,
        separators: ["\\n\\n", "\\n", " ", ""],
        embedding_model: 'vertex-gecko',
        vector_store: 'faiss'
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch existing config if API exists, else use defaults
        // Mock fetch
        // axios.get('/api/ingestion/config').then(...)
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: name === 'chunk_size' || name === 'chunk_overlap' ? parseInt(value) : value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // await axios.post('/api/ingestion/config', config);
            await new Promise(r => setTimeout(r, 800)); // Sim delay
            alert('Configuration saved');
        } catch (err) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleRunPipeline = async () => {
        if (!confirm("Start ingestion pipeline? This will process all pending documents.")) return;
        setLoading(true);
        try {
            const res = await axios.post('/api/ingest');
            alert(`Pipeline Triggered: ${res.data.message || 'Success'}`);
        } catch (err) {
            alert(`Error: ${err.response?.data?.error || 'Failed to start pipeline'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Ingestion Pipeline</h2>
                    <p className="text-slate-400">Configure how documents are processed and indexed.</p>
                </div>
                <button
                    onClick={handleRunPipeline}
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Run Pipeline
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="md:col-span-2 space-y-6">

                    {/* Chunking Settings */}
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
                                <SplitSquareHorizontal className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Chunking Strategy</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Chunk Size</label>
                                <input
                                    type="number"
                                    name="chunk_size"
                                    value={config.chunk_size}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Characters per chunk</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Overlap</label>
                                <input
                                    type="number"
                                    name="chunk_overlap"
                                    value={config.chunk_overlap}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Overlap characters</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Separators</label>
                            <div className="flex flex-wrap gap-2">
                                {config.separators.map((sep, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 font-mono border border-slate-700">
                                        {sep === " " ? "(space)" : sep === "" ? "(empty)" : JSON.stringify(sep).slice(1, -1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Embedding Settings */}
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <Database className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Embedding & Storage</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Embedding Model</label>
                                <select
                                    name="embedding_model"
                                    value={config.embedding_model}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                                >
                                    <option value="vertex-gecko">Vertex AI Gecko (Google)</option>
                                    <option value="openai-ada">OpenAI Ada-002</option>
                                    <option value="huggingface">HuggingFace Local</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Vector Store</label>
                                <select
                                    name="vector_store"
                                    value={config.vector_store}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                                >
                                    <option value="faiss">FAISS (Local)</option>
                                    <option value="pinecone">Pinecone</option>
                                    <option value="chroma">ChromaDB</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium border border-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Configuration
                    </button>

                </div>

                {/* Pipeline Status / Logs (Placeholder) */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Terminal className="w-4 h-4 text-slate-500" />
                            <h3 className="text-sm font-semibold text-slate-300">Pipeline Logs</h3>
                        </div>
                        <div className="flex-1 bg-black/50 rounded-lg p-3 font-mono text-xs text-slate-400 overflow-y-auto max-h-[400px]">
                            <p className="text-emerald-500">[10:00:23] System initialized</p>
                            <p className="text-slate-500">[10:00:24] Waiting for jobs...</p>
                            {loading && (
                                <p className="text-blue-400 mt-2 animate-pulse">Processing documents...</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Ingestion;
