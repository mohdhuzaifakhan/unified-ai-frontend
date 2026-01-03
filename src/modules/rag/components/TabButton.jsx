const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${active ? "border-blue-500 text-white bg-blue-500/5" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
    >
        <Icon className="w-4 h-4" />
        {label}
        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
            {count}
        </span>
    </button>
);

export default TabButton