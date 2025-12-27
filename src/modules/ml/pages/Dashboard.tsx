import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Zap, Server, DollarSign, ArrowUpRight, Clock } from "lucide-react";

const STATS = [
    { label: "Active Models", value: "12", icon: Server, color: "text-primary", trend: "+2 this week" },
    { label: "API Requests", value: "1.2M", icon: Zap, color: "text-yellow-400", trend: "+15% vs last mo" },
    { label: "Avg Latency", value: "45ms", icon: Activity, color: "text-success", trend: "-5ms improvement" },
    { label: "Est. Cost", value: "$342", icon: DollarSign, color: "text-error", trend: "On track" },
];

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold font-display text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back, John. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => (
                    <Card key={stat.label} className="border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success flex items-center gap-1">
                                    {stat.trend} <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-white font-display mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder for now) */}
                <Card className="lg:col-span-2 min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Inference Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-black/20 text-slate-500">
                            Chart Component (Recharts) Integration Pending
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-200 font-medium">Model "Customer Churn v2" deployed</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" /> 2 hours ago
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
