import { useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from "recharts";
import {
    Copy, Check, ShieldCheck, Activity,
    AlertTriangle, Server
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

// Mock Data
const FEATURE_IMPORTANCE = [
    { name: "monthly_spend", value: 0.35 },
    { name: "tenure", value: 0.25 },
    { name: "age", value: 0.15 },
    { name: "usage_score", value: 0.12 },
    { name: "location_score", value: 0.08 },
];

const DRIFT_DATA = [
    { time: "00:00", active: 4000, baseline: 2400 },
    { time: "04:00", active: 3000, baseline: 1398 },
    { time: "08:00", active: 2000, baseline: 9800 },
    { time: "12:00", active: 2780, baseline: 3908 },
    { time: "16:00", active: 1890, baseline: 4800 },
    { time: "20:00", active: 2390, baseline: 3800 },
    { time: "24:00", active: 3490, baseline: 4300 },
];

export default function ModelDetails() {
    const [activeTab, setActiveTab] = useState("deploy");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                        <span>Experiments</span>
                        <span>/</span>
                        <span className="text-white">WeightedEnsemble_L3</span>
                    </div>
                    <h1 className="text-3xl font-bold font-display text-white">Model Details</h1>
                </div>
                <div className="flex gap-2">
                    {['metrics', 'deploy', 'monitoring'].map(tab => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? "default" : "outline"}
                            onClick={() => setActiveTab(tab)}
                            className="capitalize"
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Logic for Tabs */}
            {activeTab === "metrics" && (
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Importance</CardTitle>
                            <CardDescription>Which features impact the model most?</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={FEATURE_IMPORTANCE} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                    <XAxis type="number" stroke="#94a3b8" />
                                    <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "Accuracy", value: "98.4%", change: "+2.1%" },
                                { label: "F1 Score", value: "0.97", change: "+0.05" },
                                { label: "ROC AUC", value: "0.99", change: "+0.01" },
                                { label: "Inference Time", value: "12ms", change: "-4ms" },
                            ].map((metric) => (
                                <div key={metric.label} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                                    <span className="text-slate-300">{metric.label}</span>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">{metric.value}</div>
                                        <div className="text-xs text-success">{metric.change}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "deploy" && (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* API Endpoint Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="w-5 h-5 text-primary" /> API Endpoint
                            </CardTitle>
                            <CardDescription>Use this endpoint to get predictions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Production URL</label>
                                <div className="flex items-center gap-2 p-3 bg-black/40 rounded-lg border border-white/10 font-mono text-sm text-slate-300">
                                    <span className="flex-1 truncate">https://api.automl-platform.com/v1/predict/model-xh892s</span>
                                    <button onClick={handleCopy} className="hover:text-white">
                                        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Curl Example</label>
                                <div className="p-4 bg-black/40 rounded-lg border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto">
                                    <pre>{`curl -X POST https://api.automl-platform.com/v1/predict \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "age": 42,
    "monthly_spend": 120.50,
    "tenure": 24
  }'`}</pre>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Deployment Status */}
                    <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white">Healthy</h4>
                                    <p className="text-xs text-slate-400">Up since 2h ago</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Replicas</span>
                                    <span className="text-white font-mono">2 / 10</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Memory</span>
                                    <span className="text-white font-mono">1.2 GB</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Region</span>
                                    <span className="text-white">us-east-1</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full border-error/50 hover:bg-error/10 text-error">
                                Stop Deployment
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "monitoring" && (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-error/10 to-transparent border-error/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-error/20 rounded-lg text-error"><AlertTriangle className="w-5 h-5" /></div>
                                    <span className="text-error font-medium">Drift Detected</span>
                                </div>
                                <p className="text-sm text-slate-300">Feature <strong>'monthly_spend'</strong> has drifted significantly from training distribution.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-success/20 rounded-lg text-success"><ShieldCheck className="w-5 h-5" /></div>
                                    <span className="text-success font-medium">Fairness Check</span>
                                </div>
                                <p className="text-sm text-slate-300">No bias detected across protected groups (Gender, Age).</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary"><Activity className="w-5 h-5" /></div>
                                    <span className="text-primary font-medium">Traffic Spike</span>
                                </div>
                                <p className="text-sm text-slate-300">+15% request volume in the last hour. Autoscaling triggered.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Drift Analysis</CardTitle>
                            <CardDescription>Comparison of training vs production data distribution</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={DRIFT_DATA}>
                                    <defs>
                                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="active" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActive)" name="Production Data" />
                                    <Area type="monotone" dataKey="baseline" stroke="#94a3b8" fillOpacity={1} fill="url(#colorBaseline)" name="Training Baseline" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
