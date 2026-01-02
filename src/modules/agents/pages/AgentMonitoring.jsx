import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, Cpu, CheckCircle, AlertTriangle, User, Bot, MessageSquare, FileSearch } from 'lucide-react';
import { useProject } from "../../rag/context/ProjectContext";
import { monitoringApi } from "@/services/api/monitoringApi";

const AgentMonitoring = () => {
    const { currentProject } = useProject();
    const [traces, setTraces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentProject?._id) {
            loadTraces();
        }
    }, [currentProject?._id]);

    const loadTraces = async () => {
        try {
            setLoading(true);
            const data = await monitoringApi.getTraces(currentProject._id);
            setTraces(data);
        } catch (err) {
            console.error("Failed to load agent activity:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Agent Activity Monitor</h2>
                    <p className="text-slate-400 text-sm mt-1">Real-time status and performance tracking of autonomous agents.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Live System
                    </span>
                    <button
                        onClick={loadTraces}
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
                    </button>
                </div>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard
                    title="Total Interactions"
                    value={traces.length.toString()}
                    icon={Cpu}
                    iconColor="text-brand-400"
                    iconBg="bg-brand-500/10"
                    progress={100}
                    progressColor="bg-brand-500"
                    footer="Latest session activity"
                    footerIcon={Activity}
                />
                <StatusCard
                    title="Task Success Rate"
                    value={`${traces.length > 0 ? ((traces.filter(t => t.status === 'grounded').length / traces.length) * 100).toFixed(1) : 0}%`}
                    icon={CheckCircle}
                    iconColor="text-emerald-400"
                    iconBg="bg-emerald-500/10"
                    progress={traces.length > 0 ? (traces.filter(t => t.status === 'grounded').length / traces.length) * 100 : 0}
                    progressColor="bg-emerald-500"
                    footer="Grounded vs Hallucination"
                    footerIcon={CheckCircle}
                />
                <StatusCard
                    title="Avg Latency"
                    value={traces.length > 0 ? `${(traces.reduce((acc, t) => acc + t.latency, 0) / traces.length).toFixed(0)}ms` : "0ms"}
                    icon={AlertTriangle}
                    iconColor="text-slate-400"
                    iconBg="bg-slate-700/50"
                    progress={0}
                    progressColor="bg-slate-700"
                    footer="Processing speed"
                    footerIcon={CheckCircle}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Agent List */}
                <div className="lg:col-span-2 p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                        <h3 className="font-semibold text-white">Live Activity</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-500 border-b border-slate-700/50">
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Trace ID</th>
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Query</th>
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider text-right">Latency</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-300">
                                {traces.map(trace => (
                                    <AgentRow
                                        key={trace._id}
                                        id={trace._id.substring(0, 8)}
                                        type="RAG Agent"
                                        status={trace.status === 'grounded' ? 'Processing' : 'Warning'}
                                        task={trace.query}
                                        latency={`${trace.latency}ms`}
                                        icon={Bot}
                                        iconColor="text-brand-400"
                                        iconBg="bg-brand-500/10"
                                    />
                                ))}
                                {traces.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-slate-500">No active interactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Event Stream */}
                <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col h-[500px]">
                    <div className="mb-4 pb-4 border-b border-slate-800">
                        <h3 className="font-semibold text-white">Event Stream</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {traces.slice(0, 5).map(trace => (
                            <LogItem
                                key={trace._id}
                                color={trace.status === 'grounded' ? "bg-emerald-500" : "bg-orange-500"}
                                time={new Date(trace.createdAt).toLocaleTimeString()}
                                text={<span>Agent <span className="text-brand-400">RAG-{trace._id.slice(-4)}</span> {trace.status === 'grounded' ? "retrieved data" : "flagged risk"}.</span>}
                            />
                        ))}
                        {traces.length === 0 && (
                            <p className="text-xs text-slate-500 text-center mt-10">Monitoring for events...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, value, icon: Icon, iconColor, iconBg, progress, progressColor, footer, footerIcon: FooterIcon }) => (
    <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl relative overflow-hidden group">
        <div className={`absolute -right-6 -top-6 w-24 h-24 ${progressColor}/10 rounded-full blur-xl group-hover:${progressColor}/20 transition-all`}></div>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className={`${progressColor} h-full rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1">
            <FooterIcon className="w-3 h-3" /> {footer}
        </p>
    </div>
);

const AgentRow = ({ id, type, status, task, latency, icon: Icon, iconColor, iconBg }) => (
    <tr className="group hover:bg-slate-800/30 transition-colors border-b border-slate-800/30 last:border-0">
        <td className="px-4 py-3">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-200">{id}</span>
            </div>
        </td>
        <td className="px-4 py-3 text-slate-400">{type}</td>
        <td className="px-4 py-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status === 'Processing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                {status}
            </span>
        </td>
        <td className="px-4 py-3 text-slate-300 truncate max-w-[200px]">{task}</td>
        <td className="px-4 py-3 text-right text-slate-400 font-mono text-xs">{latency}</td>
    </tr>
);

const LogItem = ({ color, time, text }) => (
    <div className="flex gap-3">
        <div className={`mt-1 min-w-[6px] h-1.5 rounded-full ${color}`}></div>
        <div>
            <p className="text-sm text-slate-300">{text}</p>
            <span className="text-xs text-slate-500">{time}</span>
        </div>
    </div>
);

export default AgentMonitoring;
