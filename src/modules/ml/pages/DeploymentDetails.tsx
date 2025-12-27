import { Server, Activity, ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const LATENCY_DATA = [
    { time: "10:00", ms: 45 },
    { time: "10:05", ms: 42 },
    { time: "10:10", ms: 48 },
    { time: "10:15", ms: 120 }, // Spike
    { time: "10:20", ms: 50 },
    { time: "10:25", ms: 45 },
];

export default function DeploymentDetails() {
    return (
        <div className="space-y-8">
            <div>
                <Link to="/dashboard/deployments" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Deployments
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">Sentiment Analysis v2.1.3</h1>
                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full text-xs font-semibold uppercase">Average</span>
                        </div>
                        <p className="text-slate-400 mt-1">Endpoint: <span className="font-mono text-slate-300 bg-white/5 px-1 rounded">https://api.automl.com/v1/sentiment</span></p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">Rollback</Button>
                        <Button>Scale Replicas</Button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4" /> RPM</div>
                        <div className="text-2xl font-bold text-white mt-2">4,205</div>
                        <div className="text-xs text-green-500 mt-1">+12% vs last hour</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> P99 Latency</div>
                        <div className="text-2xl font-bold text-white mt-2">48ms</div>
                        <div className="text-xs text-green-500 mt-1">-5ms improvement</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm text-slate-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Error Rate</div>
                        <div className="text-2xl font-bold text-white mt-2">0.02%</div>
                        <div className="text-xs text-slate-500 mt-1">Within SLA</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm text-slate-400 flex items-center gap-2"><Server className="w-4 h-4" /> Replicas</div>
                        <div className="text-2xl font-bold text-white mt-2">12 / 20</div>
                        <div className="text-xs text-blue-500 mt-1">Auto-scaling active</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Latency (ms)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={LATENCY_DATA}>
                                    <defs>
                                        <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "white" }} />
                                    <Area type="monotone" dataKey="ms" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 font-mono text-xs max-h-[250px] overflow-y-auto">
                            <div className="text-slate-400">[2025-12-10 10:25:01] <span className="text-white">INFO</span>  Request served in 45ms</div>
                            <div className="text-slate-400">[2025-12-10 10:25:00] <span className="text-white">INFO</span>  Request served in 44ms</div>
                            <div className="text-slate-400">[2025-12-10 10:24:59] <span className="text-white">INFO</span>  Request served in 46ms</div>
                            <div className="text-slate-400">[2025-12-10 10:24:58] <span className="text-yellow-500">WARN</span>  High latency detected (120ms)</div>
                            <div className="text-slate-400">[2025-12-10 10:24:57] <span className="text-white">INFO</span>  Request served in 42ms</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
