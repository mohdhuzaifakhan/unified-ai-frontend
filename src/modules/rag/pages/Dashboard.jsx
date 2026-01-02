import React, { useEffect, useState } from "react";
import {
  FileText,
  Database,
  Zap,
  DollarSign,
  Plus,
  Boxes,
  Activity,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "@/services/api";
import ProjectDropdown from "../components/ProjectDropdown";

const Dashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("all");

  const [stats, setStats] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [health, setHealth] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getProjects().then((data) => {
      setProjects(data || []);
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        if (projectId === "all") {
          const statsRes = await dashboardApi.getRagStats();
          setStats(statsRes || []);
          setExperiments([]);
          setHealth(null);
        } else {
          const [statsRes, runs, healthRes] = await Promise.all([
            dashboardApi.getRagStats(projectId),
            dashboardApi.getEmbeddingExperiments(projectId),
            dashboardApi.getRagHealth(projectId),
          ]);

          setStats(statsRes || []);
          setExperiments(runs || []);
          setHealth(healthRes);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 text-sm">Loading RAG Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            RAG Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            System performance and knowledge base health overview.
          </p>
        </div>

        <div className="flex gap-3">
          <ProjectDropdown
            projects={projects}
            projectId={projectId}
            setProjectId={setProjectId}
          />
          <button
            onClick={() => navigate("/rag/sources")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-500 transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Inference Traffic
            </h3>
          </div>

          <div className="h-64 flex items-end gap-2 px-2">
            {[30, 45, 60, 55, 70, 85, 90, 75, 65, 80, 88, 95].map((h, i) => (
              <div
                key={i}
                className="w-full bg-blue-600/20 hover:bg-blue-500/40 rounded-t transition-all relative group"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {h} requests
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Start</span>
            <span>Mid</span>
            <span>Current</span>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {health ? (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />
                System Health
              </h3>

              <div className="space-y-6">
                <HealthRow label="Inference Queue" value={health.embeddingQueue} color="bg-blue-500" progress={85} />
                <HealthRow label="Vector Index" value={health.vectorIndex} color="bg-emerald-500" progress={92} />
                <HealthRow label="Cluster Latency" value="Normal" color="bg-amber-500" progress={98} />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 h-full flex flex-col justify-center items-center text-center">
              <Zap size={32} className="text-slate-700 mb-4" />
              <h3 className="text-lg font-bold text-white">Select Project</h3>
              <p className="text-slate-500 text-sm mt-2">
                View detailed metrics for a specific workspace.
              </p>
            </div>
          )}
        </div>
      </div>

      {projectId !== "all" && experiments.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Boxes size={18} className="text-cyan-500" />
              Pipeline Architecture
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Model</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Vector Store</th>
                  <th className="px-6 py-4">Chunks</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {experiments.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/30 transition-all">
                    <td className="px-6 py-4 text-white font-medium">{e.embeddingModel}</td>
                    <td className="px-6 py-4 text-slate-400">{e.datasource}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300">
                        {e.vectorStore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{e.chunksStored}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                        <CheckCircle2 size={12} />
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, trend, color }) => {
  const Icon = label.toLowerCase().includes("document")
    ? FileText
    : label.toLowerCase().includes("vector")
      ? Database
      : label.toLowerCase().includes("api") || label.toLowerCase().includes("queries")
        ? Zap
        : Activity;

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 group-hover:bg-slate-700 transition-colors">
          <Icon size={20} className="text-slate-300" />
        </div>
        <div className={`px-2 py-0.5 rounded text-xs font-bold ${trend.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
      </div>
    </div>
  );
};

const HealthRow = ({ label, value, color, progress }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end text-xs">
      <span className="text-slate-300 font-bold">{label}</span>
      <span className="text-emerald-400 font-bold uppercase">{value}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default Dashboard;
