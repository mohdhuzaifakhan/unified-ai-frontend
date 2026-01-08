import { Zap } from "lucide-react";
export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
        <Zap className="w-4 h-4 text-white fill-current" />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">
        Unified AI
      </span>
    </div>
  );
}
