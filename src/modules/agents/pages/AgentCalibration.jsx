import React, { useState, useEffect } from 'react';
import { Search, Globe, Code, Database, PlusCircle, Settings, Cpu, Save, RefreshCw } from 'lucide-react';
import { useProject } from "../../rag/context/ProjectContext";
import { dataIngestionApi } from "@/services/api/dataIngestionApi";
import { modelConfigApi } from "@/services/api/modelConfigApi";
import clsx from 'clsx';

const AgentConfig = () => {
    const { currentProject } = useProject();
    const [ingestionConfigs, setIngestionConfigs] = useState([]);
    const [modelConfigs, setModelConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Selected state
    const [selectedConfigId, setSelectedConfigId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("");

    useEffect(() => {
        if (currentProject?._id) {
            fetchData();
        }
    }, [currentProject?._id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ingestionRes, modelRes] = await Promise.all([
                dataIngestionApi.getAllEmbeddingsWithMetadataOfProject(currentProject._id),
                modelConfigApi.getConfig(currentProject._id)
            ]);
            setIngestionConfigs(ingestionRes || []);
            const models = Array.isArray(modelRes) ? modelRes : (modelRes ? [modelRes] : []);
            setModelConfigs(models);

            // Set defaults if available
            if (ingestionRes?.length > 0) setSelectedConfigId(ingestionRes[0]._id);
            if (models.length > 0) setSelectedModelId(models[0]._id);
            if (models[0]?.systemPrompt) setSystemPrompt(models[0].systemPrompt);
        } catch (err) {
            console.error("Failed to fetch calibration data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // In a real scenario, we might have a specific 'Agent' document, 
            // but for now we are calibrating the default project RAG personality.
            const selectedModel = modelConfigs.find(m => m._id === selectedModelId);
            if (selectedModel) {
                await modelConfigApi.saveConfig(currentProject._id, {
                    ...selectedModel,
                    systemPrompt: systemPrompt
                });
                alert("Agent calibration saved successfully!");
            }
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Agent Calibration</h2>
                    <p className="text-slate-400 text-sm mt-1">Configure the core RAG personality and tool parameters for this project.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchData}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Calibration"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calibration Sidebar */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col h-[600px] p-6 space-y-8">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Selection</h4>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-400">Primary RAG Pipeline</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                    value={selectedConfigId}
                                    onChange={(e) => setSelectedConfigId(e.target.value)}
                                >
                                    {ingestionConfigs.map(c => (
                                        <option key={c._id} value={c._id}>Pipeline: {c.embedding_model}</option>
                                    ))}
                                    {ingestionConfigs.length === 0 && <option value="">No pipelines available</option>}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-400">Default LLM Engine</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                    value={selectedModelId}
                                    onChange={(e) => setSelectedModelId(e.target.value)}
                                >
                                    {modelConfigs.map(m => (
                                        <option key={m._id} value={m._id}>{m.model}</option>
                                    ))}
                                    {modelConfigs.length === 0 && <option value="">No models configured</option>}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Current Status</h4>
                        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                    <Cpu size={16} />
                                </div>
                                <span className="text-sm font-medium text-white">Project Optimized</span>
                            </div>
                            <p className="text-xs text-slate-500">LLM is synced with your vector index. Latency is optimal.</p>
                        </div>
                    </div>
                </div>

                {/* Calibration Form */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-xl h-[600px] overflow-y-auto custom-scrollbar p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
                        <Settings size={20} className="text-brand-400" /> Advanced Agent Persona
                    </h3>
                    <form className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400">Master System Instructions (RAG Override)</label>
                            <textarea
                                rows="8"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-brand-500 font-mono leading-relaxed"
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                placeholder="Define the core logic of the RAG agent..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-medium text-slate-400 block">Active Project Tools</label>
                            <ToolItem
                                icon={Globe}
                                iconColor="text-blue-400"
                                iconBg="bg-blue-500/10"
                                title="Autonomous Web Access"
                                desc="Broaden context by retrieving live data (Enterprise Only)"
                                defaultChecked={false}
                            />
                            <ToolItem
                                icon={Database}
                                iconColor="text-emerald-400"
                                iconBg="bg-emerald-500/10"
                                title="RAG Synchronization"
                                desc="Prioritize internal knowledge base for all responses"
                                defaultChecked
                            />
                            <ToolItem
                                icon={Code}
                                iconColor="text-orange-400"
                                iconBg="bg-orange-500/10"
                                title="Metadata Reasoning"
                                desc="Enable deep analysis of document metadata fields"
                                defaultChecked
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ToolItem = ({ icon: Icon, iconColor, iconBg, title, desc, defaultChecked }) => (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center gap-3">
            <div className={`p-2 ${iconBg} rounded ${iconColor}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-200">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
        </label>
    </div>
);

export default AgentConfig;
