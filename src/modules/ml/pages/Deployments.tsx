import { useState } from "react";
import { Server, Activity, GitCommit, CheckCircle2, X, Globe, Box, Cpu, Shield, Zap, Radio, Layers, Cloud, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import clsx from "clsx";

const WIZARD_STEPS = [
    { id: 'model', label: 'Model Source', icon: Box },
    { id: 'inference', label: 'Inference Mode', icon: Zap },
    { id: 'infrastructure', label: 'Infrastructure', icon: Cloud },
    { id: 'traffic', label: 'Traffic & Rollout', icon: Activity },
    { id: 'security', label: 'Security', icon: Lock },
];

export default function Deployments() {
    const [isDeploying, setIsDeploying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedEnv, setSelectedEnv] = useState('staging'); // staging, production, edge

    return (
        <div className="space-y-6 h-full flex flex-col relative">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white">Deployments</h1>
                    <p className="text-slate-400">Manage release pipelines and environments.</p>
                </div>
                <Button onClick={() => setIsDeploying(true)} className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                    <Cloud className="w-4 h-4" /> New Release
                </Button>
            </div>

            {/* Existing Dashboard Grid */}
            <div className="grid md:grid-cols-3 gap-6 grow h-full max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {/* STAGING */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-400 uppercase tracking-widest px-1">
                        <span>Staging</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs">1</span>
                    </div>

                    <Card className="bg-white/5 border-white/5 hover:border-white/10 cursor-pointer transition-all hover:bg-white/10">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-white">v2.1.0-rc1</div>
                                <div className="text-xs text-yellow-500 flex items-center gap-1"><Activity className="w-3 h-3" /> Testing</div>
                            </div>
                            <div className="text-sm text-slate-400">Churn Model XL</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                <GitCommit className="w-3 h-3" /> 8a2f9c
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-2 border-white/10 hover:bg-white/10">Promote to Canary</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* CANARY */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-400 uppercase tracking-widest px-1">
                        <span>Canary (10%)</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs">1</span>
                    </div>

                    <Card className="bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 cursor-pointer transition-all">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-white">v2.0.5</div>
                                <div className="text-xs text-blue-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Rolling out</div>
                            </div>
                            <div className="text-sm text-slate-400">Recommendation Engine</div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 w-[10%] h-full" />
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <span>Error Rate: 0.01%</span>
                                <span>Latency: 45ms</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* PRODUCTION */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-400 uppercase tracking-widest px-1">
                        <span>Production</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs">2</span>
                    </div>

                    <Card className="bg-green-500/5 border-green-500/20 hover:border-green-500/40 cursor-pointer transition-all">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-white">v2.0.4</div>
                                <div className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</div>
                            </div>
                            <div className="text-sm text-slate-400">Recommendation Engine</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Server className="w-3 h-3" /> 12 replicas
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-500/5 border-green-500/20 hover:border-green-500/40 cursor-pointer transition-all">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-white">v1.8.0</div>
                                <div className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</div>
                            </div>
                            <div className="text-sm text-slate-400">Fraud Detector</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Server className="w-3 h-3" /> 4 replicas
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Deployment Wizard Modal Overlay */}
            {isDeploying && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-5xl h-[85vh] bg-[#0a0a0a] border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Globe className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">New Deployment</h2>
                                    <p className="text-xs text-slate-400">Universal model deployment wizard</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsDeploying(false)} className="text-slate-400 hover:text-white hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar Steps */}
                            <div className="w-64 border-r border-white/5 bg-white/[0.02] p-6 space-y-2">
                                {WIZARD_STEPS.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                                            index === currentStep
                                                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                                : index < currentStep
                                                    ? "text-slate-300 bg-white/5"
                                                    : "text-slate-500"
                                        )}
                                    >
                                        <step.icon className={clsx("w-4 h-4", index === currentStep ? "text-primary" : "text-currentColor")} />
                                        {step.label}
                                        {index < currentStep && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {currentStep === 0 && (
                                    <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Select Model Source</h3>
                                            <p className="text-slate-400 mt-1">Choose a model from your registry to deploy.</p>
                                        </div>

                                        <div className="grid gap-4">
                                            {/* Registry Selection */}
                                            <Card className="bg-white/5 border-primary/50 cursor-pointer relative group overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 bg-primary text-white text-xs font-bold rounded-bl-lg">RECOMMENDED</div>
                                                <CardContent className="p-5 flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                        <Box className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-lg">Model Registry</div>
                                                        <div className="text-slate-400 text-sm">Deploy a registered version (v2.3.0)</div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-white/5 border-white/5 hover:border-white/20 cursor-pointer opacity-60 hover:opacity-100 transition-all">
                                                <CardContent className="p-5 flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                                                        <Globe className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-lg">HuggingFace Hub</div>
                                                        <div className="text-slate-400 text-sm">Import directly from HF repo</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 space-y-4">
                                            <label className="text-sm font-semibold text-slate-300">Selected Model</label>
                                            <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none">
                                                <option>Churn Prediction Model (v2.1.0)</option>
                                                <option>Sales Forecast (v1.5.2)</option>
                                                <option>Customer Sentiment LLM (v3.0.0)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Inference Mode Setup</h3>
                                            <p className="text-slate-400 mt-1">How will this model consume data and serve predictions?</p>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'realtime', title: 'Real-time API', icon: Zap, desc: 'Low latency REST/gRPC for live apps.' },
                                                { id: 'batch', title: 'Batch Job', icon: Layers, desc: 'High throughput offline processing.' },
                                                { id: 'stream', title: 'Streaming', icon: Activity, desc: 'Continuous data ingestion & inference.' }
                                            ].map((mode) => (
                                                <Card key={mode.id} className="bg-white/5 border-white/10 hover:border-primary/50 cursor-pointer group transition-all hover:-translate-y-1">
                                                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                                        <div className="w-14 h-14 rounded-full bg-slate-800 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                                            <mode.icon className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white mb-1">{mode.title}</div>
                                                            <div className="text-xs text-slate-400 leading-relaxed">{mode.desc}</div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 text-sm text-blue-300">
                                            <Zap className="w-5 h-5 shrink-0" />
                                            <div>
                                                <strong>Real-time API Selected:</strong> This will provision an auto-scaling Kubernetes service with a load balancer. Average latency target: &lt;100ms.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Infrastructure Configuration</h3>
                                            <p className="text-slate-400 mt-1">Allocate compute resources and target environment.</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-slate-300">Target Environment</label>
                                                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                                                    <button className="flex-1 py-2 text-sm font-medium rounded-md bg-white/10 text-white shadow">Kubernetes</button>
                                                    <button className="flex-1 py-2 text-sm font-medium rounded-md text-slate-500 hover:text-slate-300">Edge Device</button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-slate-300">Accelerator</label>
                                                <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white outline-none">
                                                    <option>NVIDIA T4 GPU</option>
                                                    <option>NVIDIA A100 GPU</option>
                                                    <option>CPU Only</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <h4 className="font-semibold text-white flex items-center gap-2">
                                                <Server className="w-4 h-4 text-primary" /> Horizontal Scaling
                                            </h4>
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 grid grid-cols-3 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-slate-400 uppercase">Min Replicas</label>
                                                    <Input type="number" defaultValue={1} className="bg-black/40 border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-slate-400 uppercase">Max Replicas</label>
                                                    <Input type="number" defaultValue={5} className="bg-black/40 border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-slate-400 uppercase">Target CPU %</label>
                                                    <Input type="number" defaultValue={70} className="bg-black/40 border-white/10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Traffic & Rollout Strategy</h3>
                                            <p className="text-slate-400 mt-1">Control how users are exposed to this new version.</p>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { title: "Canary Deployment", desc: "Route a small % of traffic (e.g. 10%) to new version.", safe: true },
                                                { title: "Blue-Green", desc: "Deploy parallel stack, switch 100% traffic instantly.", safe: true },
                                                { title: "Rolling Update", desc: "Gradually replace old pods with new ones.", safe: false }
                                            ].map((strat, i) => (
                                                <div key={i} className={clsx(
                                                    "border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all",
                                                    i === 0 ? "bg-primary/10 border-primary/50" : "bg-white/5 border-white/5 hover:border-white/20"
                                                )}>
                                                    <div className={clsx(
                                                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                                                        i === 0 ? "border-primary" : "border-slate-600"
                                                    )}>
                                                        {i === 0 && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-white">{strat.title}</div>
                                                        <div className="text-sm text-slate-400">{strat.desc}</div>
                                                    </div>
                                                    {strat.safe && (
                                                        <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">Safe</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <div className="flex justify-between text-sm text-white">
                                                <span>Initial Traffic Weight</span>
                                                <span className="font-mono text-primary">10%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="w-[10%] h-full bg-primary" />
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                The system will automatically promote to 25% after 1 hour if error rate &lt; 1%.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Security & Governance</h3>
                                            <p className="text-slate-400 mt-1">Protect your model endpoint and ensure compliance.</p>
                                        </div>

                                        <div className="grid gap-6">
                                            <div className="space-y-4 border-b border-white/5 pb-6">
                                                <h4 className="font-semibold text-white flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-primary" /> Access Control
                                                </h4>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                                                        <input type="checkbox" defaultChecked className="mt-1" />
                                                        <div>
                                                            <div className="text-white font-medium">API Key Auth</div>
                                                            <div className="text-xs text-slate-400">Require x-api-key header for all requests.</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                                                        <input type="checkbox" className="mt-1" />
                                                        <div>
                                                            <div className="text-white font-medium">OIDC / OAuth 2.0</div>
                                                            <div className="text-xs text-slate-400">Integrate with enterprise Identity Provider.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-white flex items-center gap-2">
                                                    <Lock className="w-4 h-4 text-primary" /> Data Protection
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                        <span className="text-sm text-slate-300">SSL/TLS Encryption (HTTPS)</span>
                                                        <div className="flex items-center gap-2 text-xs text-green-500">
                                                            <CheckCircle2 className="w-3 h-3" /> Enabled
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                        <span className="text-sm text-slate-300">Payload Logging</span>
                                                        <div className="flex items-center gap-2 text-xs text-yellow-500">
                                                            ⚠ Anonymized Only
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="h-20 border-t border-white/5 bg-white/5 px-8 flex items-center justify-between shrink-0">
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentStep(c => Math.max(0, c - 1))}
                                disabled={currentStep === 0}
                                className={clsx(currentStep === 0 ? "opacity-0" : "opacity-100", "text-slate-400 hover:text-white")}
                            >
                                Back
                            </Button>

                            <div className="flex gap-2">
                                {currentStep === WIZARD_STEPS.length - 1 ? (
                                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 px-8">
                                        Deploy Release
                                    </Button>
                                ) : (
                                    <Button onClick={() => setCurrentStep(c => Math.min(WIZARD_STEPS.length - 1, c + 1))} className="bg-primary hover:bg-primary/90">
                                        Next Step
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
