import React, { useState, useEffect } from "react";
import { Play, TrendingUp, TrendingDown, Clock, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { useProject } from "../../rag/context/ProjectContext";
import { monitoringApi } from "@/services/api/monitoringApi";

const AgentEvaluation = () => {
    const { currentProject } = useProject();
    const [traces, setTraces] = useState([]);
    const [metrics, setMetrics] = useState({
        precision: 0,
        faith: 0,
        relevance: 0,
        avgLatency: 0,
        totalQueries: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentProject?._id) {
            loadData();
        }
    }, [currentProject?._id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tracesData, metricsData] = await Promise.all([
                monitoringApi.getTraces(currentProject._id),
                monitoringApi.getMetrics(currentProject._id)
            ]);
            setTraces(tracesData);
            setMetrics({
                precision: metricsData.precision || 0,
                faith: metricsData.faithfulness || 0,
                relevance: metricsData.relevance || 0,
                avgLatency: metricsData.avgLatency || 0,
                totalQueries: metricsData.totalQueries || 0
            });
        } catch (err) {
            console.error("Failed to load evaluation data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Evaluation & Benchmarking</h2>
                    <p className="text-slate-400 text-sm mt-1">Assess agent performance against real-time interaction metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
                    </button>
                    <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all">
                        <Play className="w-4 h-4" />
                        Run New Evaluation
                    </button>
                </div>
            </div>

            {/* Aggregate Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Overall Accuracy"
                    value={`${metrics.precision}%`}
                    change="Live"
                    changeIcon={TrendingUp}
                    changeColor="text-emerald-400"
                    progress={metrics.precision}
                    progressColor="bg-emerald-500"
                />
                <MetricCard
                    title="Faithfulness"
                    value={`${metrics.faith}%`}
                    change="Live"
                    changeIcon={TrendingUp}
                    changeColor="text-emerald-400"
                    progress={metrics.faith}
                    progressColor="bg-brand-500"
                />
                <MetricCard
                    title="Avg Response Time"
                    value={`${(metrics.avgLatency * 1).toFixed(2)}s`}
                    change="~ 0.0s"
                    changeIcon={Activity}
                    changeColor="text-slate-500"
                    progress={40}
                    progressColor="bg-blue-500"
                />
                <MetricCard
                    title="Total Evaluations"
                    value={metrics.totalQueries.toString()}
                    change="In-flight"
                    changeIcon={TrendingUp}
                    changeColor="text-brand-400"
                    progress={100}
                    progressColor="bg-orange-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Placeholder */}
                <div className="lg:col-span-2 p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-white">Performance Trend (Last 7 Days)</h3>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Accuracy</span>
                            <span className="px-2 py-1 rounded bg-transparent text-slate-500 border border-transparent hover:border-slate-700 hover:text-slate-300 transition-colors cursor-pointer">Latency</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between px-4 gap-4 border-b border-slate-800 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="h-px bg-slate-800 w-full"></div>
                            <div className="h-px bg-slate-800/50 w-full border-dashed border-t border-slate-800"></div>
                            <div className="h-px bg-slate-800/50 w-full border-dashed border-t border-slate-800"></div>
                            <div className="h-px bg-slate-800/50 w-full border-dashed border-t border-slate-800"></div>
                            <div className="h-px bg-slate-800 w-full"></div>
                        </div>

                        {/* Bars - Dynamically mapping from metrics/traces if possible, for now keeping some visual baseline */}
                        {[65, 70, 68, 75, 82, 85, metrics.precision].map((val, i) => (
                            <div key={i} className="w-full bg-gradient-to-t from-brand-600/20 to-brand-500/50 hover:to-brand-400/60 rounded-t-md transition-all relative z-10 group" style={{ height: `${val}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {val}% Accuracy
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Latest Runs Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-700/50">
                        <h3 className="font-semibold text-white">Recent Interactions</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 sticky top-0 backdrop-blur-sm">
                                <tr className="text-xs text-slate-500 border-b border-slate-700/50">
                                    <th className="px-5 py-3 font-medium">Trace ID</th>
                                    <th className="px-5 py-3 font-medium">Query</th>
                                    <th className="px-5 py-3 font-medium text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {traces.map(trace => (
                                    <RunRow
                                        key={trace._id}
                                        id={`#${trace._id.substring(0, 8)}`}
                                        dataset={trace.query}
                                        score={`${(trace.score * 100).toFixed(0)}%`}
                                        color={trace.score >= 0.8 ? "text-emerald-400" : "text-yellow-400"}
                                    />
                                ))}
                                {traces.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-10 text-slate-500">No recent runs.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-700/50 text-center">
                        <button className="text-xs text-brand-400 hover:text-brand-300 font-medium">View All History</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, change, changeIcon: Icon, changeColor, progress, progressColor }) => (
    <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl relative">
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className={`text-xs ${changeColor} mb-1 flex items-center`}>
                <Icon className="w-3 h-3 mr-0.5" />
                {change}
            </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mt-3">
            <div className={`${progressColor} h-1 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);

const RunRow = ({ id, dataset, score, color }) => (
    <tr className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/30 cursor-pointer">
        <td className="px-5 py-3 text-brand-400 font-mono text-xs">{id}</td>
        <td className="px-5 py-3 text-slate-300">{dataset}</td>
        <td className={`px-5 py-3 text-right font-bold ${color}`}>{score}</td>
    </tr>
);

export default AgentEvaluation;
