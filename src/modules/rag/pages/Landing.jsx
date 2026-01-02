import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Zap,
    Shield,
    ArrowRight,
    Database,
    Workflow,
} from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                    <Zap size={14} fill="currentColor" />
                    Next-Generation Retrieval
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    Enterprise Knowledge <br />
                    <span className="text-blue-500">Retrieval Augmented Generation</span>
                </h1>

                <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    Scale your intelligence with a unified RAG platform. Connect data sources,
                    manage vector indices, and deploy secure LLM interfaces in minutes.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => navigate("/rag/projects")}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        Manage Projects
                        <ArrowRight size={18} />
                    </button>
                    <button
                        onClick={() => window.location.href = '#'}
                        className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm border border-slate-700 transition-all"
                    >
                        API Docs
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
                <FeatureCard
                    icon={Database}
                    title="Vector Persistence"
                    desc="Optimized storage for high-dimensional semantic search."
                />
                <FeatureCard
                    icon={Workflow}
                    title="Neural Pipelines"
                    desc="Automated chunking and embedding orchestration."
                />
                <FeatureCard
                    icon={Shield}
                    title="Access Controls"
                    desc="Granular API security and domain whitelisting."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl text-left space-y-4 hover:border-slate-600 transition-all group">
        <div className="p-2.5 bg-slate-800 rounded-lg text-blue-500 w-fit group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Icon size={20} />
        </div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
);

export default Landing;
