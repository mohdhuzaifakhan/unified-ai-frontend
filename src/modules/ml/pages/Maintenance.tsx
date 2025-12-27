import { Activity, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const DRIFT_DATA = [
    { day: "Mon", drift: 0.02 },
    { day: "Tue", drift: 0.03 },
    { day: "Wed", drift: 0.05 },
    { day: "Thu", drift: 0.12 }, // Warning
    { day: "Fri", drift: 0.04 },
    { day: "Sat", drift: 0.02 },
    { day: "Sun", drift: 0.02 },
];

export default function Maintenance() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Maintenance & Retraining</h1>
                    <p className="text-slate-400">Monitor model health and automate retraining.</p>
                </div>
                <Button className="gap-2 bg-accent hover:bg-accent/90 text-white">
                    <RefreshCw className="w-4 h-4" /> Trigger Retraining
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-red-500/30 bg-red-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Critical Drift Detected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">12.5%</div>
                        <p className="text-xs text-slate-400 mt-1">Feature "income_level" deviates significantly from training baseline.</p>
                    </CardContent>
                </Card>

                <Card className="border-green-500/30 bg-green-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-green-400 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Data Quality
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">99.8%</div>
                        <p className="text-xs text-slate-400 mt-1">No missing values or outliers in recent batches.</p>
                    </CardContent>
                </Card>

                <Card className="border-blue-500/30 bg-blue-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-blue-400 flex items-center gap-2">
                            <Activity className="w-5 h-5" /> System Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">Healthy</div>
                        <p className="text-xs text-slate-400 mt-1">All inference nodes operating within latency limits.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Data Drift Monitoring (Last 7 Days)</CardTitle>
                    <CardDescription>KL Divergence score over time. Threshold: 0.10</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={DRIFT_DATA}>
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "white" }}
                                    cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                                />
                                <Line type="monotone" dataKey="drift" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
