const MetricCard = ({ title, value, icon: Icon, color, bg, trend }) => (
    <div className="bg-slate-900/50 border border-slate-800/50 p-5 rounded-2xl hover:border-slate-700 transition-all group">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2.5 ${bg} ${color} rounded-xl group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{trend}</span>
        </div>
        <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </div>
);

export default MetricCard