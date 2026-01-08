import React from "react";

export default function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <input
          {...props}
          className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}
