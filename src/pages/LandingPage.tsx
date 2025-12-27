import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
    ArrowRight, Zap, Shield, BarChart, Cpu, Globe, Users, Play,
    Bot, Layers, User, Database, Workflow, LogIn
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
    const navigate = useNavigate()

    const services = [
        {
            id: "ml",
            name: "ML as a Service",
            description: "AutoML platform for building and deploying machine learning models in minutes",
            icon: Bot,
            path: "/ml",
            gradient: "from-blue-500 to-cyan-500",
            features: ["Auto-Feature Engineering", "Model Selection", "One-Click Deploy"]
        },
        {
            id: "rag",
            name: "RAG as a Service",
            description: "Retrieval Augmented Generation for intelligent document processing and chat",
            icon: Layers,
            path: "/rag",
            gradient: "from-purple-500 to-pink-500",
            features: ["Document Ingestion", "Vector Search", "Multi-Agent Workflows"]
        },
        {
            id: "agents",
            name: "Agent as a Service",
            description: "Autonomous AI agents for workflow automation and orchestration",
            icon: User,
            path: "/agents",
            gradient: "from-green-500 to-emerald-500",
            features: ["Agent Orchestration", "Task Automation", "Coming Soon"]
        }
    ]

    return (
        <div className="min-h-screen bg-background text-slate-200 font-sans overflow-x-hidden">
            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-glass-surface/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Unified AI Platform</span>
                    </div>

                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                        {["Services", "Features", "Pricing", "Docs"].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate("/login")} className="gap-2">
                            <LogIn className="w-4 h-4" />
                            Log in
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow text-white"
                            onClick={() => navigate("/login")}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Platform v2.0 is now live
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight text-white mb-6">
                            Your Complete AI <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                                Services Platform
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                            From AutoML to RAG to Autonomous Agents - deploy production-grade AI services
                            in minutes. No Ph.D. required.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                size="lg"
                                className="text-base px-8 h-12 bg-white text-background hover:bg-slate-200"
                                onClick={() => navigate("/login")}
                            >
                                Start Building Free
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-base px-8 h-12 border-slate-700 hover:bg-white/5"
                            >
                                <Play className="mr-2 w-4 h-4" />
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <p>Trusted by 10,000+ teams worldwide</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SERVICE SELECTOR */}
            <section id="services" className="py-24 bg-surface/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                            Choose Your <span className="text-primary">AI Service</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Select the service that fits your needs. Each platform is fully integrated
                            and ready to deploy.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => navigate(service.path)}
                                className="group cursor-pointer"
                            >
                                <div className="h-full p-8 rounded-2xl border border-white/10 bg-glass-surface/50 backdrop-blur-sm hover:bg-glass-surface/80 transition-all duration-300">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow`}>
                                        <service.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-display font-bold mb-3 text-white">
                                        {service.name}
                                    </h3>

                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                                        Explore Service
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                            Everything you need to <br />
                            <span className="text-primary">deploy AI at scale</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            From data ingestion to model monitoring, we handle the heavy lifting
                            so you can focus on business value.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: BarChart,
                                title: "Auto-Feature Engineering",
                                desc: "Automatically detect types, handle missing values, and generate high-impact features."
                            },
                            {
                                icon: Cpu,
                                title: "Model Selection",
                                desc: "Intelligently tests XGBoost, CatBoost, Neural Nets, and Ensembles to find the winner."
                            },
                            {
                                icon: Globe,
                                title: "One-Click Deploy",
                                desc: "Instant REST API endpoints for your models. Auto-scaling included."
                            },
                            {
                                icon: Shield,
                                title: "Enterprise Security",
                                desc: "SOC2 Type II compliant. Role-based access control and encrypted artifacts."
                            },
                            {
                                icon: Users,
                                title: "Collaboration",
                                desc: "Shared workspaces, experiments, and model registry for your entire team."
                            },
                            {
                                icon: Zap,
                                title: "Real-time Inference",
                                desc: "Low-latency predictions running on optimized edge infrastructure."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 bg-background">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>© 2025 Unified AI Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
