import { Activity, RefreshCw, Cpu, CheckCircle, AlertTriangle, User, Bot, MessageSquare, FileSearch } from 'lucide-react';

const AgentMonitoring = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Agent Activity Monitor</h2>
                    <p className="text-slate-400 text-sm mt-1">Real-time status and performance tracking of autonomous agents.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Live System
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard
                    title="Active Agents"
                    value="12"
                    icon={Cpu}
                    iconColor="text-brand-400"
                    iconBg="bg-brand-500/10"
                    progress={75}
                    progressColor="bg-brand-500"
                    footer="2 new instances spawned"
                    footerIcon={Activity} // Arrow up substitute
                />
                <StatusCard
                    title="Task Success Rate"
                    value="98.5%"
                    icon={CheckCircle}
                    iconColor="text-emerald-400"
                    iconBg="bg-emerald-500/10"
                    progress={98}
                    progressColor="bg-emerald-500"
                    footer="1,405 tasks completed today"
                    footerIcon={CheckCircle}
                />
                <StatusCard
                    title="Critical Alerts"
                    value="0"
                    icon={AlertTriangle}
                    iconColor="text-slate-400"
                    iconBg="bg-slate-700/50"
                    progress={0}
                    progressColor="bg-slate-700"
                    footer="System operating normally"
                    footerIcon={CheckCircle}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Agent List */}
                <div className="lg:col-span-2 p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                        <h3 className="font-semibold text-white">Live Agents</h3>
                        <div className="flex gap-2">
                            <select className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-brand-500">
                                <option>All Types</option>
                                <option>Research</option>
                                <option>Support</option>
                                <option>Analysis</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-500 border-b border-slate-700/50">
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Agent ID</th>
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Current Task</th>
                                    <th className="px-4 py-3 font-medium uppercase tracking-wider text-right">Latency</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-300">
                                <AgentRow id="AGT-8821" type="Research Assistant" status="Processing" task="Summarizing 'Q3 Financial Report.pdf'" latency="124ms" icon={Bot} iconColor="text-brand-400" iconBg="bg-brand-500/10" />
                                <AgentRow id="AGT-9004" type="Customer Support" status="Idle" task="Waiting for user input" latency="-" icon={MessageSquare} iconColor="text-purple-400" iconBg="bg-purple-500/10" />
                                <AgentRow id="AGT-7712" type="Data Analyst" status="Processing" task="Generating SQL query for sales..." latency="842ms" icon={FileSearch} iconColor="text-orange-400" iconBg="bg-orange-500/10" />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Event Stream */}
                <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col h-[500px]">
                    <div className="mb-4 pb-4 border-b border-slate-800">
                        <h3 className="font-semibold text-white">Event Stream</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        <LogItem color="bg-emerald-500" time="10:42:05 AM" text={<span>Agent <span className="text-brand-400">AGT-8821</span> retrieved 4 chunks.</span>} />
                        <LogItem color="bg-blue-500" time="10:41:12 AM" text={<span>User session <span className="text-white">US-442</span> started.</span>} />
                        <LogItem color="bg-orange-500" time="10:40:55 AM" text={<span>Tool <span className="text-orange-400">CodeInterpreter</span> executed successfully.</span>} />
                        <LogItem color="bg-emerald-500" time="10:39:20 AM" text={<span>Agent <span className="text-brand-400">AGT-7712</span> connected to DB.</span>} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, value, icon: Icon, iconColor, iconBg, progress, progressColor, footer, footerIcon: FooterIcon }) => (
    <div className="p-5 bg-slate-900/50 border border-slate-700/50 rounded-xl relative overflow-hidden group">
        <div className={`absolute -right-6 -top-6 w-24 h-24 ${progressColor}/10 rounded-full blur-xl group-hover:${progressColor}/20 transition-all`}></div>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className={`${progressColor} h-full rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1">
            <FooterIcon className="w-3 h-3" /> {footer}
        </p>
    </div>
);

const AgentRow = ({ id, type, status, task, latency, icon: Icon, iconColor, iconBg }) => (
    <tr className="group hover:bg-slate-800/30 transition-colors border-b border-slate-800/30 last:border-0">
        <td className="px-4 py-3">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-200">{id}</span>
            </div>
        </td>
        <td className="px-4 py-3 text-slate-400">{type}</td>
        <td className="px-4 py-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status === 'Processing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                {status}
            </span>
        </td>
        <td className="px-4 py-3 text-slate-300 truncate max-w-[200px]">{task}</td>
        <td className="px-4 py-3 text-right text-slate-400 font-mono text-xs">{latency}</td>
    </tr>
);

const LogItem = ({ color, time, text }) => (
    <div className="flex gap-3">
        <div className={`mt-1 min-w-[6px] h-1.5 rounded-full ${color}`}></div>
        <div>
            <p className="text-sm text-slate-300">{text}</p>
            <span className="text-xs text-slate-500">{time}</span>
        </div>
    </div>
);

export default AgentMonitoring;
