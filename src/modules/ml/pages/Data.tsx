import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { dataSourcesApi, type DataSource } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Database,
  Upload,
  FileText,
  Calendar,
  Plus,
  Loader2,
  X,
  Cloud,
  Globe,
  HardDrive,
  Server,
  ArrowRight,
  Search,
  Filter,
  MoreVertical,
  FileJson,
  PieChart,
  Table as TableIcon,
  Terminal,
  Eye,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Activity
} from 'lucide-react';

type SourceType = 'file' | 'database' | 's3' | 'api';

export default function DataPage() {
  const { user } = useAuth();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPreprocessModalOpen, setIsPreprocessModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<SourceType>('file');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      setLoading(true);
      const data = await dataSourcesApi.getAll();
      setDataSources(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data sources');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Use current user id to separate data sources from specific projects
    const ownerId = user?.id || '6951478b477a8472bc482466';

    try {
      setUploading(true);
      setError(null);
      const newDataSource = await dataSourcesApi.uploadFile(file, ownerId);
      setDataSources([newDataSource, ...dataSources]);
      setLastAddedId(newDataSource._id);
      setIsConnectModalOpen(false);

      // Clear highlight after 5 seconds
      setTimeout(() => setLastAddedId(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpenPreview = async (source: DataSource) => {
    setSelectedSource(source);
    setIsPreviewModalOpen(true);
    try {
      setPreviewLoading(true);
      setTimeout(() => {
        setPreviewData([
          { id: 1, name: "Product A", price: 29.99, category: "Electronics", status: "In Stock" },
          { id: 2, name: "Product B", price: 49.99, category: "Accessories", status: "Out of Stock" },
          { id: 3, name: "Product C", price: 19.99, category: "Home", status: "In Stock" },
          { id: 4, name: "Product D", price: 99.99, category: "Electronics", status: "Pre-order" },
          { id: 5, name: "Product E", price: 9.99, category: "Stationery", status: "In Stock" },
        ]);
        setPreviewLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to load preview:", err);
      setPreviewLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return <FileText className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 's3': return <Cloud className="w-5 h-5" />;
      case 'api': return <Globe className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Syncing your data ocean...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2 text-gradient">Data Sources</h1>
          <p className="text-slate-400">Connect and manage your datasets for high-performance ML models.</p>
        </div>
        <Button
          onClick={() => setIsConnectModalOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow text-white gap-2 h-11 px-6 font-bold rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Connect New Source
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <X className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {/* Empty state */}
      {dataSources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden rounded-3xl border border-white/5 bg-white/2 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          </div>
          <div className="relative mb-8">
            <div className="relative w-28 h-28 rounded-3xl bg-glass border border-white/10 flex items-center justify-center shadow-glow">
              <Database className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No data sources connected</h3>
          <p className="text-slate-400 text-center max-w-lg mb-10 leading-relaxed">
            Connect your databases, static files, or cloud buckets to begin training your models.
          </p>
          <Button
            onClick={() => setIsConnectModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8 font-bold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Initialize Your First Source
          </Button>
        </div>
      ) : (
        /* Data Sources Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataSources.map((source, index) => (
            <motion.div
              key={source._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                boxShadow: lastAddedId === source._id ? "0 0 40px rgba(var(--primary-rgb), 0.3)" : "none"
              }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl ${lastAddedId === source._id ? 'z-10 ring-2 ring-primary ring-offset-4 ring-offset-black transition-all duration-500' : ''}`}
            >
              {lastAddedId === source._id && (
                <div className="absolute -top-3 -right-3 z-20 bg-primary text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-glow">
                  Just Added
                </div>
              )}
              <Card className={`group glass hover:bg-white/10 transition-all duration-300 border-white/5 overflow-hidden ${lastAddedId === source._id ? 'bg-primary/5' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${source.type === 'file' ? 'bg-blue-500/10 text-blue-400' :
                      source.type === 'database' ? 'bg-purple-500/10 text-purple-400' :
                        source.type === 's3' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-emerald-500/10 text-emerald-400'
                      }`}>
                      {getTypeIcon(source.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg truncate group-hover:text-primary transition-colors">{source.name}</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{source.type}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Status</span>
                      <span className="flex items-center gap-1.5 text-white font-medium">
                        <div className={`w-1.5 h-1.5 rounded-full ${source.status === 'active' ? 'bg-success shadow-glow-success' : 'bg-primary animate-pulse'}`} />
                        {source.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Last Synced</span>
                      <span className="text-white font-medium font-mono">{new Date(source.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenPreview(source)}
                      className="h-10 border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 gap-2 text-xs rounded-xl"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsPreprocessModalOpen(true)}
                      className="h-10 border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 gap-2 text-xs rounded-xl"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Process
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Connect Source Modal */}
      <AnimatePresence>
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-3xl overflow-hidden flex flex-col min-h-[550px] h-[60vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    Connect Data Source
                  </h2>
                  <p className="text-slate-400 mt-2 text-sm font-medium">Select your ingestion channel and configure connection parameters.</p>
                </div>
                <button onClick={() => setIsConnectModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                  <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
                </button>
              </div>

              <div className="flex-1 flex justify-center items-center overflow-hidden">
                <Tabs className="w-full flex">
                  {/* Left Sidebar for Tabs */}
                  <div className="w-80 border-r border-white/5 p-8 flex flex-col gap-6 bg-white/[0.01]">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Ingestion Methods</h4>
                    <TabsList className="bg-transparent p-0 flex flex-col gap-3 h-auto w-full">
                      <TabsTrigger
                        active={activeTab === 'file'}
                        onClick={() => setActiveTab('file')}
                        className={`w-full justify-start gap-4 px-6 h-14 rounded-2xl transition-all ${activeTab === 'file' ? 'bg-primary/20 border border-primary/30 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-bold">Local File</span>
                      </TabsTrigger>
                      <TabsTrigger
                        active={activeTab === 'database'}
                        onClick={() => setActiveTab('database')}
                        className={`w-full justify-start gap-4 px-6 h-14 rounded-2xl transition-all ${activeTab === 'database' ? 'bg-primary/20 border border-primary/30 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                      >
                        <Database className="w-5 h-5" />
                        <span className="font-bold">Database</span>
                      </TabsTrigger>
                      <TabsTrigger
                        active={activeTab === 's3'}
                        onClick={() => setActiveTab('s3')}
                        className={`w-full justify-start gap-4 px-6 h-14 rounded-2xl transition-all ${activeTab === 's3' ? 'bg-primary/20 border border-primary/30 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                      >
                        <Cloud className="w-5 h-5" />
                        <span className="font-bold">Cloud Storage</span>
                      </TabsTrigger>
                      <TabsTrigger
                        active={activeTab === 'api'}
                        onClick={() => setActiveTab('api')}
                        className={`w-full justify-start gap-4 px-6 h-14 rounded-2xl transition-all ${activeTab === 'api' ? 'bg-primary/20 border border-primary/30 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                      >
                        <Activity className="w-5 h-5" />
                        <span className="font-bold">Real-time API</span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-auto p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Need help connecting your source? Check our <span className="text-primary hover:underline cursor-pointer">Documentation</span> for detailed guides.
                      </p>
                    </div>
                  </div>

                  {/* Right Content Area */}
                  <div className="flex-1 overflow-y-auto p-12 bg-black/20">
                    <TabsContent active={activeTab === 'file'} className="h-full mt-0">
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">Upload Static Dataset</h3>
                          <p className="text-sm text-slate-400">Directly ingest CSV, JSON, or Parquet files from your device.</p>
                        </div>

                        <div
                          className="h-[320px] border-2 border-dashed border-white/10 hover:border-primary/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group hover:shadow-2xl hover:shadow-primary/5"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-glow">
                            {uploading ? <Loader2 className="w-12 h-12 text-primary animate-spin" /> : <Upload className="w-12 h-12 text-primary" />}
                          </div>
                          <div className="text-center space-y-3 px-8">
                            <p className="text-2xl font-black text-white">{uploading ? 'Processing Ingestion...' : 'Drop your files here'}</p>
                            <p className="text-sm text-slate-500 font-medium">Max file size: 100MB • Supports .csv, .json, .parquet</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent active={activeTab === 'database'} className="space-y-8 mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">External Database Connection</h3>
                        <p className="text-sm text-slate-400">Securely tunnel into your production or staging databases.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Instance Name</label>
                          <Input placeholder="e.g. User Analytics DB" className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-base px-6 font-medium" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Engine</label>
                          <select className="flex h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer font-medium hover:bg-white/10 transition-colors">
                            <option value="postgres">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="mongodb">MongoDB</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Connection URI</label>
                        <Input placeholder="postgresql://user:password@host:port/dbname" className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-base px-6 font-mono" />
                      </div>
                      <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-glow-primary transition-all hover:-translate-y-1">Establish Connection</Button>
                    </TabsContent>

                    <TabsContent active={activeTab === 's3'} className="space-y-8 mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Cloud Storage Bucket</h3>
                        <p className="text-sm text-slate-400">Sync large-scale datasets from AWS S3, GCS, or Azure Blobs.</p>
                      </div>

                      <div className="space-y-3 pt-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bucket Path</label>
                        <Input placeholder="s3://my-enterprise-data/v1/training/" className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-base px-6 font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Access Key ID</label>
                          <Input placeholder="AKIA..." className="h-14 bg-white/5 border-white/10 rounded-2xl text-base px-6 font-mono" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secret Access Key</label>
                          <Input type="password" placeholder="••••••••••••••••" className="h-14 bg-white/5 border-white/10 rounded-2xl text-base px-6 font-mono" />
                        </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl bg-[#ff9900] hover:bg-[#e68a00] text-white font-black text-lg shadow-glow-orange transition-all hover:-translate-y-1">Connect AWS Bucket</Button>
                    </TabsContent>

                    <TabsContent active={activeTab === 'api'} className="space-y-8 mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Real-Time Event Stream</h3>
                        <p className="text-sm text-slate-400">Connect to Webhook endpoints or WebSocket streams for online learning.</p>
                      </div>

                      <div className="space-y-3 pt-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Stream Endpoint URL</label>
                        <Input placeholder="wss://stream.myplatform.com/v1/events" className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-base px-6 font-mono" />
                      </div>
                      <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center shadow-glow">
                          <Activity className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-primary font-black uppercase tracking-widest text-xs">Platform Streaming Engine Ready</h4>
                          <p className="text-sm text-slate-400 max-w-sm font-medium">Our load-balanced listener will automatically batch and ingest incoming events for processing.</p>
                        </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-glow transition-all hover:-translate-y-1">Instantiate Listener</Button>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-3xl overflow-hidden flex flex-col h-[80vh]"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
                  <Eye className="w-5 h-5 text-primary" />
                  Data Preview: {selectedSource?.name}
                </h2>
                <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-8">
                {previewLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-slate-500 font-mono text-xs animate-pulse">PARSING DATA...</p>
                  </div>
                ) : (
                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/2">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                          {previewData.length > 0 && Object.keys(previewData[0]).map((key) => (
                            <th key={key} className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="p-4 text-sm text-slate-300 font-medium">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preprocessing Modal */}
      <AnimatePresence>
        {isPreprocessModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreprocessModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-3xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Advanced Preprocessing
                </h2>
                <button onClick={() => setIsPreprocessModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary">Cleaning</h4>
                  <div className="space-y-4">
                    {["Missing Values", "Outlier Detection", "Remove Duplicates"].map((opt) => (
                      <div key={opt} className="p-4 rounded-2xl border border-white/5 bg-white/2 flex items-center justify-between">
                        <span className="text-white text-sm font-bold">{opt}</span>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary">Features</h4>
                  <div className="p-6 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                    {["Normalization", "Encoding", "Vectorization"].map((f) => (
                      <div key={f} className="flex justify-between items-center text-sm text-white">
                        <span>{f}</span>
                        <div className="w-8 h-4 bg-primary rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 flex gap-4">
                <Button className="flex-1 h-12 bg-primary text-white font-bold rounded-xl shadow-glow">Finalize Pipeline</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
