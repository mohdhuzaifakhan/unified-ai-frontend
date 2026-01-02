import { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Database,
    Save,
    Loader2,
    Trash2,
    AlertTriangle,
    ChevronRight,
} from "lucide-react";
import { projectsApi } from "@/services/api";
import { useProject } from "../context/ProjectContext";
import toast from "react-hot-toast";

const Settings = () => {
    const { selectedProject, setSelectedProject } = useProject();
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (selectedProject) {
            setFormData({
                name: selectedProject.name || "",
                description: selectedProject.description || "",
            });
        }
    }, [selectedProject]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedProject?._id) return;

        setLoading(true);
        try {
            const updated = await projectsApi.updateProject(selectedProject._id, formData);
            setSelectedProject(updated);
            toast.success("Settings saved successfully");
        } catch (err) {
            console.error("Failed to update settings:", err);
            toast.error("Failed to update project settings");
        } finally {
            setLoading(false);
        }
    };

    if (!selectedProject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center max-w-sm mx-auto">
                <SettingsIcon className="text-slate-700 mb-6" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
                <p className="text-slate-400 text-sm">Select an active project workspace to manage configuration settings.</p>
            </div>
        );
    }

    const tabs = [
        { id: "general", label: "General Information", icon: User },
        { id: "intelligence", label: "Knowledge Basis", icon: Database },
        { id: "security", label: "Access Control", icon: Shield },
        { id: "notifications", label: "Alert Config", icon: Bell },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 shadow-sm">
                    <SettingsIcon size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Workspace Settings</h2>
                    <p className="text-slate-400 text-sm mt-1">Configure metadata and operational parameters for this project.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={18} />
                                {tab.label}
                            </div>
                            <ChevronRight size={14} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30">
                            <h3 className="font-bold text-white flex items-center gap-2 capitalise">
                                {activeTab} Parameters
                            </h3>
                        </div>

                        <div className="p-8">
                            {activeTab === "general" ? (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detailed Description</label>
                                        <textarea
                                            rows={5}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            Save Environment
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="py-20 text-center space-y-4">
                                    <Database size={48} className="text-slate-800 mx-auto" />
                                    <h4 className="text-white font-bold uppercase tracking-widest text-xs">Module Config Missing</h4>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto">This sub-module configuration is handled via the separate Intelligence controller.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8">
                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white uppercase tracking-tight">Danger Zone</h4>
                                <p className="text-sm text-slate-500 mt-1 mb-6 leading-relaxed">
                                    Permanently delete this project workspace and all the associated data sources, vector embeddings, and configurations.
                                </p>
                                <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all">
                                    <Trash2 size={14} />
                                    Terminate Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
