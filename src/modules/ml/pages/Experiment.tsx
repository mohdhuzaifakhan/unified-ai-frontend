import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Zap, ArrowRight, Box, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/button";

const MOCK_MODELS = [
    { name: "WeightedEnsemble_L3", score: 0.984, time: "45s", status: "completed" },
    { name: "LightGBM_Large", score: 0.979, time: "12s", status: "completed" },
    { name: "XGBoost", score: 0.976, time: "10s", status: "completed" },
    { name: "CatBoost", score: 0.972, time: "14s", status: "completed" },
    { name: "NeuralNetTorch", score: 0.965, time: "120s", status: "training" },
    { name: "RandomForest", score: 0.950, time: "8s", status: "completed" },
];

export default function Experiment() {
    useParams();
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([
        "[10:00:01] Initializing AutoGluon predictor...",
        "[10:00:02] Loading dataset 'customers.csv'...",
        "[10:00:05] Analyzed 14 features. Target: 'churn'.",
    ]);
    const [activeTab, setActiveTab] = useState("leaderboard");

    // Simulate training progress
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });

            // Random logs
            if (Math.random() > 0.7) {
                const newLogs = [
                    `[10:00:${10 + Math.floor(Math.random() * 50)}] Training model ${MOCK_MODELS[Math.floor(Math.random() * MOCK_MODELS.length)].name}...`,
                    `[10:00:${10 + Math.floor(Math.random() * 50)}] Optimized hyperparams for learning_rate.`,
                    `[10:00:${10 + Math.floor(Math.random() * 50)}] Validation score improved to ${(0.9 + Math.random() * 0.09).toFixed(3)}.`,
                ];
                setLogs(prev => [...prev.slice(-8), newLogs[Math.floor(Math.random() * newLogs.length)]]);
            }
        }, 200);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                        <Link to="/dashboard/projects" className="hover:text-white">Projects</Link>
                        <span>/</span>
                        <span>Customer Churn Prediction</span>
                    </div>
                    <h1 className="text-3xl font-bold font-display text-white">Experiment #342</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-glass-surface px-4 py-2 rounded-lg border border-glass-border flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-xs text-slate-400">Status</div>
                            <div className="text-sm font-semibold text-primary">{progress < 100 ? "Training..." : "Completed"}</div>
                        </div>
                        {progress < 100 && <Zap className="w-5 h-5 text-primary animate-pulse" />}
                    </div>
                    {progress === 100 && (
                        <Link to="/dashboard/models/weighted-ensemble-l3">
                            <Button className="gap-2 bg-success hover:bg-success/90 text-white">
                                <Box className="w-4 h-4" /> Deploy Best Model
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {progress < 100 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Overall Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Col: Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Model Leaderboard</CardTitle>
                            <div className="flex gap-2">
                                {['leaderboard', 'metrics'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                            activeTab === tab ? "bg-primary text-white" : "bg-white/5 text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {MOCK_MODELS.map((model, i) => (
                                    <div key={model.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group cursor-pointer relative overflow-hidden">
                                        {i === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary" />}
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-6 h-6 rounded flex items-center justify-center text-xs font-bold", i === 0 ? "bg-yellow-500/20 text-yellow-500" : "bg-slate-700/50 text-slate-400")}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-200 group-hover:text-primary transition-colors">{model.name}</div>
                                                <div className="text-xs text-slate-500">{model.time} training time</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">{model.score.toFixed(4)}</div>
                                                <div className="text-xs text-slate-500">Validation Acc</div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Logs & Insight */}
                <div className="space-y-6">
                    <Card className="bg-black/40 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-slate-400">
                                <Terminal className="w-4 h-4" /> Live Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-mono text-xs space-y-2 h-[300px] overflow-y-auto text-slate-300">
                                {logs.map((log, i) => (
                                    <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                                        <span className="text-slate-600 block mb-0.5">{log.split("]")[0]}]</span>
                                        <span className={cn(
                                            log.includes("Improved") ? "text-success" :
                                                log.includes("Error") ? "text-error" : "text-slate-300"
                                        )}>
                                            {log.split("]")[1]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-base">Best Model Insight</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-slate-300">
                                <strong>WeightedEnsemble_L3</strong> is performing best with <strong>98.4%</strong> accuracy.
                                It combines predictions from XGBoost and LightGBM.
                            </p>
                            <div className="flex gap-2 text-xs">
                                <span className="px-2 py-1 rounded bg-surface border border-white/10 text-slate-300">Fast Inference</span>
                                <span className="px-2 py-1 rounded bg-surface border border-white/10 text-slate-300">Low Variance</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
