import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
    BookOpen, Zap, Layers, User, Cpu, Shield,
    ArrowRight, ChevronRight, Play, CheckCircle2,
    Database, Workflow, MessageSquare, BarChart2,
    Code, Terminal, Globe, Lock, Info, ExternalLink,
    Search, FileText, Settings, Activity, TerminalSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"

const Sections = [
    {
        id: "overview",
        title: "Platform Overview",
        icon: Globe,
        content: "Unified AI Platform is an end-to-end ecosystem designed to simplify the lifecycle of artificial intelligence applications. By integrating AutoML, RAG, and Autonomous Agents, we provide a single gateway for developers and enterprises to build, deploy, and scale AI-driven solutions."
    },
    {
        id: "ml-guide",
        title: "ML Workflow Guide",
        icon: Cpu,
        isGuide: true,
        steps: [
            {
                label: "Data Upload",
                desc: "Upload your raw CSV or JSON data. Our system automatically detects schemas and data types.",
                icon: Database
            },
            {
                label: "Preprocessing",
                desc: "Apply auto-feature engineering, handle missing values, and normalize distributions.",
                icon: Workflow
            },
            {
                label: "Training",
                desc: "Select your target variable and let the platform compare dozens of algorithms (XGBoost, Neural Nets).",
                icon: Activity
            },
            {
                label: "Deployment",
                desc: "Convert your winning model into a production-ready REST API with one click.",
                icon: Zap
            }
        ]
    },
    {
        id: "rag-guide",
        title: "RAG Workflow Guide",
        icon: Layers,
        isGuide: true,
        steps: [
            {
                label: "Knowledge Base",
                desc: "Create a logical container for your documents and define access permissions.",
                icon: FileText
            },
            {
                label: "Inspiration",
                desc: "Upload PDFs, Docs, or Scrspe URLs. Our OCR and parsers convert them into clean chunks.",
                icon: Search
            },
            {
                label: "Indexing",
                desc: "Documents are embedded and stored in a high-performance vector database.",
                icon: Database
            },
            {
                label: "Chat Integration",
                desc: "Connect your knowledge base to our chat widget or use the API for your own UI.",
                icon: MessageSquare
            }
        ]
    },
    {
        id: "agent-guide",
        title: "Agent Workflow Guide",
        icon: User,
        isGuide: true,
        steps: [
            {
                label: "Persona Setup",
                desc: "Define the agent's identity, system prompt, and high-level behavioral constraints.",
                icon: User
            },
            {
                label: "Tool Connector",
                desc: "Grant the agent access to APIs, databases, or local Python execution environments.",
                icon: Terminal
            },
            {
                label: "Flow Design",
                desc: "Define sub-tasks and hierarchical relationships between specialized agents.",
                icon: Workflow
            },
            {
                label: "Monitoring",
                desc: "Track agent reasoning paths and intervene when human approval is required.",
                icon: Activity
            }
        ]
    },
    {
        id: "api",
        title: "API Reference",
        icon: TerminalSquare,
        content: "Leverage our unified API to control every aspect of the platform programmatically. Authenticate using Bearer tokens and interact with RESTful endpoints for model management, RAG queries, and agent orchestration."
    }
]

export default function Docs() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <div className="min-h-screen bg-background text-slate-200 font-sans selection:bg-primary/30">
            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-glass-surface/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-glow transition-all">
                            <Zap className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Unified AI Platform</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button variant="ghost" onClick={() => navigate("/")} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                            Back to Home
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/20" onClick={() => navigate("/login")}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
                {/* SIDEBAR NAVIGATION */}
                <aside className="hidden lg:block sticky top-24 h-fit border-r border-white/5 pr-8">
                    <div className="mb-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-3">Documentation</h3>
                        <nav className="space-y-1">
                            {Sections.slice(0, 1).concat(Sections.slice(Sections.length - 1)).map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                                >
                                    <section.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium">{section.title}</span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-3">User Flow Guides</h3>
                        <nav className="space-y-1">
                            {Sections.filter(s => s.isGuide).map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                                >
                                    <section.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium">{section.title}</span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="p-5 rounded-2xl border border-primary/10 bg-primary/5 mt-10">
                        <h4 className="text-white text-sm font-bold mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            Enterprise Support
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Need a custom integration? Our solutions architect team is here to help.
                        </p>
                        <Button variant="link" className="p-0 text-primary text-xs mt-3 h-auto">
                            Contact Support
                        </Button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="space-y-24">
                    {/* HERO */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider mb-6">
                            <BookOpen className="w-3 h-3" />
                            Official Documentation
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
                            Build Your AI <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Future Today</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                            A comprehensive guide to leveraging AutoML, RAG, and Autonomous Agents
                            within the Unified AI Platform ecosystem.
                        </p>
                    </motion.div>

                    {Sections.map((section, idx) => (
                        <motion.section
                            key={section.id}
                            id={section.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="scroll-mt-28 relative"
                        >
                            {/* Decorative line */}
                            <div className="absolute -left-12 lg:-left-16 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent lg:block hidden" />

                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl shadow-black/20">
                                    <section.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white tracking-tight">{section.title}</h2>
                                    {section.isGuide && <span className="text-xs text-primary font-bold uppercase tracking-widest mt-1 block">Step-by-Step User Flow</span>}
                                </div>
                            </div>

                            {section.content && (
                                <div className="prose prose-invert prose-slate max-w-none">
                                    <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-4xl">
                                        {section.content}
                                    </p>
                                </div>
                            )}

                            {section.isGuide && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                                    {section.steps?.map((step, sIdx) => (
                                        <div key={sIdx} className="group relative p-6 rounded-2xl border border-white/5 bg-glass-surface/30 backdrop-blur-xl hover:bg-glass-surface/50 transition-all hover:border-primary/20 hover:-translate-y-1">
                                            <div className="absolute top-4 right-4 text-[40px] font-black text-white/5 leading-none select-none group-hover:text-primary/10 transition-colors">
                                                {sIdx + 1}
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                                <step.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <h4 className="text-white font-bold mb-2 text-sm">{step.label}</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                                {step.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Section Footer */}
                            <div className="mt-10 flex flex-wrap gap-4">
                                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 text-xs px-5 h-10">
                                    <Code className="w-4 h-4 mr-2" />
                                    View Implementation
                                </Button>
                                <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 text-xs px-5 h-10 group">
                                    Deep Dive Guide
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>

                            <hr className="mt-20 border-white/5" />
                        </motion.section>
                    ))}

                    {/* CALL TO ACTION */}
                    <section className="relative rounded-[2.5rem] border border-white/10 bg-[#0A0A0B] p-12 overflow-hidden shadow-2xl">
                        {/* Abstract Background */}
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
                        </div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Ready to integrate <br /><span className="text-primary">production-grade AI?</span></h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    Our developer platform is built for speed, security, and scalability.
                                    Start building for free or talk to an expert about enterprise needs.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button size="lg" className="bg-white text-background hover:bg-slate-200 px-8 rounded-xl font-bold" onClick={() => navigate("/login")}>
                                        Launch Dashboard
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-white/5 px-8 rounded-xl font-bold">
                                        Sales Inquiry
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden lg:block">
                                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 p-8 relative">
                                    <div className="space-y-4">
                                        <div className="h-2 w-1/3 bg-primary/20 rounded-full" />
                                        <div className="h-4 w-full bg-white/5 rounded-lg" />
                                        <div className="h-4 w-3/4 bg-white/5 rounded-lg" />
                                        <div className="flex gap-4 pt-4">
                                            <div className="h-20 flex-1 bg-primary/10 rounded-xl" />
                                            <div className="h-20 flex-1 bg-white/5 rounded-xl" />
                                        </div>
                                        <div className="h-32 w-full border border-dashed border-white/10 rounded-xl flex items-center justify-center">
                                            <TerminalSquare className="w-8 h-8 text-slate-600" />
                                        </div>
                                    </div>
                                    {/* Badge */}
                                    <div className="absolute -bottom-4 -left-4 bg-glass-surface backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                <Activity className="w-4 h-4 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Status</p>
                                                <p className="text-sm text-white font-bold">99.99% Uptime</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* FOOTER */}
            <footer className="py-16 border-t border-white/5 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <Zap className="w-6 h-6 text-primary" />
                                <span className="text-xl font-bold text-white">Unified AI</span>
                            </div>
                            <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
                                The world's most comprehensive platform for deploying machine learning,
                                retrieval-augmented generation, and autonomous agents in production.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer transition-colors">
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer transition-colors">
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-sm">Product</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li className="hover:text-white cursor-pointer transition-colors">ML Engine</li>
                                <li className="hover:text-white cursor-pointer transition-colors">RAG Stack</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Agent Framework</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Security</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-sm">Resources</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                                <li className="hover:text-white cursor-pointer transition-colors">API Status</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Changelog</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Community</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-[11px] font-bold uppercase tracking-widest">
                        <p>© 2025 Unified AI Platform. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Terms of Use</a>
                            <a href="#" className="hover:text-white">Legal</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
