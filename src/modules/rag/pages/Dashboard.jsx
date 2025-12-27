import { FileText, Database, Zap, DollarSign, Plus } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Documents"
                    value="1,284"
                    change="+12%"
                    changeColor="text-emerald-400"
                    icon={FileText}
                    iconColor="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="Vector Store Size"
                    value="4.2 GB"
                    change="Optimized"
                    changeColor="text-slate-500"
                    icon={Database}
                    iconColor="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="API Calls (Mo)"
                    value="84.5k"
                    change="+5%"
                    changeColor="text-purple-400"
                    icon={Zap}
                    iconColor="text-purple-400"
                    bg="bg-purple-500/10"
                />
                <StatCard
                    title="LLM Cost"
                    value="$42.30"
                    change="Est."
                    changeColor="text-slate-500"
                    icon={DollarSign}
                    iconColor="text-orange-400"
                    bg="bg-orange-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Usage Trends Chart Placeholder */}
                <div className="lg:col-span-2 p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-6">Usage Trends</h3>
                    <div className="h-64 flex items-end justify-between px-4 gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 60, 75, 50, 85, 95].map((height, i) => (
                            <div
                                key={i}
                                className="w-full bg-brand-500/20 hover:bg-brand-500/40 rounded-t-sm transition-all relative group"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {height}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 px-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                            <span key={m}>{m}</span>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-6">System Health</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-400">Embedding Queue</span>
                                <span className="text-sm text-emerald-400">Healthy</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-400">Vector Index Status</span>
                                <span className="text-sm text-brand-400">Ready</span>
                            </div>
                            <div className="px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center gap-2 text-sm text-slate-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Index 'rag-prod-v1' is active
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <button className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                New Data Source
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, changeColor, icon: Icon, iconColor, bg }) => (
    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-900/80 transition-colors">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
            <div className={`p-2 rounded-lg ${bg} ${iconColor}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className={`text-xs font-medium ${changeColor}`}>{change}</span>
        </div>
    </div>
);

export default Dashboard;
