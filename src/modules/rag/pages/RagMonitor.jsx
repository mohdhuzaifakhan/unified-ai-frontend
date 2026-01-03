import { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Search,
  CheckCircle,
  ArrowRight,
  Loader2,
  Zap,
  Eye,
  RefreshCw,
  Layers,
  Globe,
  Cpu,
  Clock,
  FileSearch,
} from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { monitoringApi } from "@/services/api/monitoringApi";
import { dataIngestionApi } from "@/services/api/dataIngestionApi";
import toast from "react-hot-toast";
import MetaDataBox from "../components/MetadataBox";
import MetricCard from "../components/MetricCard";
import TabButton from "../components/TabButton";

const RagMonitor = () => {
  const { selectedProject } = useProject();
  const [traces, setTraces] = useState([]);
  const [embeddingRuns, setEmbeddingRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("traces");
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedProject?._id) {
      loadData();
    }
  }, [selectedProject?._id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [traceData, runsData] = await Promise.all([
        monitoringApi.getTraces(selectedProject._id),
        dataIngestionApi.getAllEmbeddingsWithMetadataOfProject(selectedProject._id),
      ]);
      setTraces(traceData || []);
      setEmbeddingRuns(runsData || []);
      if (traceData?.length > 0 && !selectedTrace) {
        setSelectedTrace(traceData[0]);
      }
    } catch (err) {
      toast.error("Failed to load monitoring analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const avgLatency = traces.length > 0
    ? Math.round(traces.reduce((acc, t) => acc + (t.latency || 0), 0) / traces.length)
    : 0;

  const groundedCount = traces.filter(t => t.status === 'grounded').length;
  const successRate = traces.length > 0 ? ((groundedCount / traces.length) * 100).toFixed(1) : "0";

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full" />
          <div className="relative w-20 h-20 bg-slate-900/50 rounded-2xl border border-slate-700 flex items-center justify-center">
            <Activity className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No Project Selected</h3>
        <p className="text-slate-400 text-sm">Select a project to view production RAG traces.</p>
      </div>
    );
  }

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400">Syncing with production traces...</p>
      </div>
    );
  }



  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="w-7 h-7 text-blue-500" />
            </div>
            RAG Observability
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Monitoring <span className="text-blue-400 font-medium">{selectedProject.name}</span></p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Avg Latency" value={`${avgLatency}ms`} icon={Clock} color="text-amber-400" bg="bg-amber-400/10" trend="Latency" />
        <MetricCard title="Total Traces" value={traces.length.toString()} icon={FileSearch} color="text-blue-400" bg="bg-blue-400/10" trend="Volume" />
        <MetricCard title="Grounded Rate" value={`${successRate}%`} icon={CheckCircle} color="text-emerald-400" bg="bg-emerald-400/10" trend="Accuracy" />
        <MetricCard title="Context Chunks" value={(traces[0]?.contextChunks?.length || 0).toString()} icon={Layers} color="text-purple-400" bg="bg-purple-400/10" trend="Avg/Query" />
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="flex border-b border-slate-800">
          <TabButton active={activeTab === "traces"} onClick={() => setActiveTab("traces")} icon={Eye} label="Interaction Traces" count={traces.length} />
          <TabButton active={activeTab === "indices"} onClick={() => setActiveTab("indices")} icon={Database} label="Embedding Indices" count={embeddingRuns.length} />
        </div>

        <div className="p-0">
          {activeTab === "traces" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
              <div className="lg:col-span-4 border-r border-slate-800 overflow-y-auto max-h-[650px] custom-scrollbar">
                {traces.map((trace) => (
                  <div
                    key={trace._id}
                    onClick={() => setSelectedTrace(trace)}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${selectedTrace?._id === trace._id
                      ? "bg-blue-600/10 border-blue-500"
                      : "border-transparent hover:bg-slate-800/40"
                      }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${trace.status === 'grounded' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {trace.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(trace.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium line-clamp-1 mb-1">{trace.query}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trace.latency}ms</span>
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {trace.contextChunks?.length || 0} chunks</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-8 bg-slate-950/20 overflow-y-auto max-h-[650px] custom-scrollbar">
                {selectedTrace ? (
                  <div className="p-8 space-y-8 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-white">Trace Detail</h3>
                        <p className="text-xs text-slate-500 font-mono">UUID: {selectedTrace._id}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300 border border-slate-700 flex items-center gap-2">
                          <Globe className="w-3 h-3" /> {selectedTrace.metadata?.origin || 'Local'}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <section>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Search className="w-3.5 h-3.5" /> User Input
                        </h4>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white text-sm shadow-inner">
                          {selectedTrace.query}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 text-blue-400">
                          <Zap className="w-3.5 h-3.5" /> Generated Answer
                        </h4>
                        <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedTrace.answer}
                        </div>
                      </section>
                    </div>

                    <section>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Database className="w-3.5 h-3.5" /> Retrieved Context ({selectedTrace.contextChunks?.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedTrace.contextChunks?.map((chunk, idx) => (
                          <div key={idx} className="group relative bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-colors">
                            <span className="absolute -left-2 top-4 w-5 h-5 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-[10px] text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {idx + 1}
                            </span>
                            <p className="text-[13px] text-slate-400 leading-relaxed italic">"{chunk}"</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetaDataBox label="Latency" value={`${selectedTrace.latency}ms`} icon={Clock} />
                      <MetaDataBox label="Model Config" value={selectedTrace.metadata?.modelConfigId?.slice(-6) || 'N/A'} icon={Cpu} />
                      <MetaDataBox label="Status" value={selectedTrace.status} icon={CheckCircle} />
                      <MetaDataBox label="Timestamp" value={new Date(selectedTrace.createdAt).toLocaleDateString()} icon={Activity} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 italic">
                    <div className="p-4 bg-slate-900 rounded-full mb-4">
                      <ArrowRight className="w-8 h-8 opacity-20" />
                    </div>
                    Select a trace to inspect RAG performance
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-slate-500 uppercase text-[10px] font-bold tracking-widest px-4">
                    <th className="pb-4 pl-4">Model & Vector Store</th>
                    <th className="pb-4">Data Source</th>
                    <th className="pb-4">Chunks</th>
                    <th className="pb-4">Latency</th>
                    <th className="pb-4 text-right pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {embeddingRuns.map((run) => (
                    <tr key={run._id} className="bg-slate-900/40 border border-slate-800 hover:bg-slate-800/40 transition-all">
                      <td className="py-4 pl-4 rounded-l-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Database className="w-4 h-4" /></div>
                          <div>
                            <p className="font-bold text-white">{run.embedding_model}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{run.vector_store}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-slate-300">{run.datasourceId?.name}</td>
                      <td className="text-slate-300 font-mono">{run.chunksStored?.toLocaleString()}</td>
                      <td className="text-slate-300">{run.avgLatencyPerBatch || 100}ms</td>
                      <td className="text-right pr-4 rounded-r-xl">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20">
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default RagMonitor;