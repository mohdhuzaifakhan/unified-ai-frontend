import { useState } from 'react';
import { Search, Globe, Code, Database, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

const AgentConfig = () => {
    const [selectedAgentId, setSelectedAgentId] = useState('research');

    const agents = [
        { id: 'research', name: 'Research Assistant', model: 'gemini-pro-1.5', status: 'active', color: 'bg-emerald-500' },
        { id: 'support', name: 'Customer Support', model: 'gpt-4-turbo', status: 'idle', color: 'bg-emerald-500' },
        { id: 'analyst', name: 'Data Analyst', model: 'claude-3-opus', status: 'idle', color: 'bg-slate-600' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Agent Configuration</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage agent profiles, instructions, and tool access.</p>
                </div>
                <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all">
                    <PlusCircle className="w-4 h-4" />
                    Create New Agent
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent List Sidebar */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col h-[600px] p-4">
                    <div className="mb-4 relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input type="text" placeholder="Search agents..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500 placeholder:text-slate-600" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {agents.map(agent => (
                            <div
                                key={agent.id}
                                onClick={() => setSelectedAgentId(agent.id)}
                                className={clsx(
                                    "p-3 rounded-lg cursor-pointer transition-all border",
                                    selectedAgentId === agent.id
                                        ? "bg-brand-500/10 border-brand-500/50"
                                        : "hover:bg-slate-800/50 border-transparent hover:border-slate-700/50"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={clsx("text-sm font-medium", selectedAgentId === agent.id ? "text-white" : "text-slate-300")}>{agent.name}</span>
                                    <span className={`w-2 h-2 rounded-full ${agent.color}`}></span>
                                </div>
                                <p className={clsx("text-xs truncate", selectedAgentId === agent.id ? "text-brand-300" : "text-slate-500")}>Model: {agent.model}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration Form */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-xl h-[600px] overflow-y-auto custom-scrollbar p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-4">Edit Agent: Research Assistant</h3>
                    <form className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-400">Agent Name</label>
                                <input type="text" defaultValue="Research Assistant" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-400">Model Selection</label>
                                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500">
                                    <option>gemini-pro-1.5</option>
                                    <option>gemini-ultra</option>
                                    <option>gpt-4o</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400">System Instructions (Prompt)</label>
                            <textarea rows="6" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-brand-500 font-mono leading-relaxed" defaultValue={`You are an advanced research assistant designed to synthesize information from multiple documents.\nWhen answering, prioritize factual accuracy and cite source chunks.\nStyle: Professional, concise, and structured.\nConstraints: Do not hallucinate information not present in the context.`} />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-medium text-slate-400 block">Tools & Capabilities</label>

                            <ToolItem
                                icon={Globe}
                                iconColor="text-blue-400"
                                iconBg="bg-blue-500/10"
                                title="Web Search"
                                desc="Allow agent to browse the internet for live data"
                                defaultChecked
                            />
                            <ToolItem
                                icon={Code}
                                iconColor="text-orange-400"
                                iconBg="bg-orange-500/10"
                                title="Code Interpreter"
                                desc="Execute Python code for data analysis"
                            />
                            <ToolItem
                                icon={Database}
                                iconColor="text-emerald-400"
                                iconBg="bg-emerald-500/10"
                                title="RAG Knowledge Base"
                                desc="Access to uploaded documents vector store"
                                defaultChecked
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                            <button type="button" className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button type="button" className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-brand-500/20 transition-all">Save Changes</button>
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
