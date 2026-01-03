const MetaDataBox = ({ label, value, icon: Icon }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Icon className="w-3 h-3" /> {label}
        </p>
        <p className="text-sm text-slate-200 font-medium truncate">{value}</p>
    </div>
);

export default MetaDataBox;