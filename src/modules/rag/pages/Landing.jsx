import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Database, Zap } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-dark-950 text-slate-200">
            {/* Navbar */}
            <nav className="border-b border-slate-800/50 backdrop-blur-sm fixed w-full z-50 bg-dark-950/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-white">
                        <Zap className="text-brand-400 fill-brand-400/20" />
                        RAG Service
                    </div>
                    <div className="flex gap-4">
                        <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/signup" className="px-5 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all shadow-lg shadow-brand-500/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] -z-10 opacity-50" />

                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
                        Build Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">Agent Workflows</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Orchestrate multi-agent systems, ingest custom data, and deploy powerful RAG pipelines in minutes.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup" className="flex items-center gap-2 px-8 py-3 bg-white text-slate-950 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                            Start Building <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={Bot}
                    title="Multi-Agent Systems"
                    desc="Deploy specialized agents that work together to solve complex tasks."
                />
                <FeatureCard
                    icon={Database}
                    title="RAG Pipeline"
                    desc="Ingest documents, manage embeddings, and chat with your data instantly."
                />
                <FeatureCard
                    icon={Workflow}
                    title="Visual Builder"
                    desc="Design workflows with a drag-and-drop interface. No coding required."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-colors">
        <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center mb-6">
            <Icon className="w-6 h-6 text-brand-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

// lucide-react doesn't export Workflow? reusing Zap for placeholder if needed.
import { Workflow } from 'lucide-react';

export default Landing;
