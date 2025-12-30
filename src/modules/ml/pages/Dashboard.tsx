import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Zap, Server, DollarSign, ArrowUpRight, Clock, Loader2 } from "lucide-react";
import { dashboardApi, type DashboardStat, type DashboardActivity } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const ICON_MAP: Record<string, any> = {
    "Active Models": Server,
    "API Requests": Zap,
    "Avg Latency": Activity,
    "Est. Cost": DollarSign,
};

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [activities, setActivities] = useState<DashboardActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, activitiesData] = await Promise.all([
                    dashboardApi.getStats(),
                    dashboardApi.getActivities(),
                ]);
                setStats(statsData);
                setActivities(activitiesData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const renderStats = () => {
        const displayStats = stats.length > 0 ? stats : [
            { label: "Active Models", value: "0", trend: "0", color: "text-primary" },
            { label: "API Requests", value: "0", trend: "0", color: "text-yellow-400" },
            { label: "Avg Latency", value: "0ms", trend: "0", color: "text-success" },
            { label: "Est. Cost", value: "$0", trend: "0", color: "text-error" },
        ];

        return displayStats.map((stat) => {
            const Icon = ICON_MAP[stat.label] || Activity;
            return (
                <Card key={stat.label} className="border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success flex items-center gap-1">
                                {stat.trend} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white font-display mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                    </CardContent>
                </Card>
            );
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold font-display text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back, {user?.firstName || 'User'}. Here's what's happening today.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {renderStats()}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Chart Area */}
                        <Card className="lg:col-span-2 min-h-[400px] border-white/5 bg-white/5">
                            <CardHeader>
                                <CardTitle>Inference Volume</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20 text-slate-500">
                                    Chart Component Integration Pending
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="h-full border-white/5 bg-white/5">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {activities.length > 0 ? (
                                        activities.map((activity) => (
                                            <div key={activity.id} className="flex gap-4">
                                                <div className="mt-1">
                                                    <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-slate-200 font-medium">{activity.message}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                        <Clock className="w-3 h-3" /> {activity.time}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-slate-500 py-8">No recent activity</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
