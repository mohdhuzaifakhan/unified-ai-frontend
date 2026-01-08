export default function NewReleaseUpdateBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      {label}
    </div>
  );
}
