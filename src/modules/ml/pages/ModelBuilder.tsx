import { useState } from "react";
import { Brain, Database, Settings, Play, Check, ArrowUpRight, Cpu, Layers, Activity, GitBranch, Gauge, Shield, Save, Code, Sliders } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import clsx from "clsx";

const STEPS = ["Dataset", "Target", "Configuration", "Training"];

type ConfigMode = 'auto' | 'custom';
type Tab = 'general' | 'architecture' | 'training' | 'optimization' | 'regularization' | 'resources';

const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Brain },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'training', label: 'Training', icon: Activity },
    { id: 'optimization', label: 'Optimization', icon: Gauge },
    { id: 'regularization', label: 'Regularization', icon: Shield },
    { id: 'resources', label: 'Resources', icon: Cpu },
];

export default function ModelBuilder() {
    const [currentStep, setCurrentStep] = useState(0);
    const [configMode, setConfigMode] = useState<ConfigMode>('auto');
    const [activeTab, setActiveTab] = useState<Tab>('general');

    // Dynamic Configuration Configuration
    const [taskType, setTaskType] = useState("Classification");

    const TASK_OPTIONS: Record<string, {
        families: string[];
        losses: string[];
        metrics: string[];
        architectures: string[];
    }> = {
        "Classification": {
            families: ["Neural Networks", "Gradient Boosting (XGBoost/CatBoost)", "Random Forest", "SVM", "Logistic Regression"],
            losses: ["CrossEntropy", "Hinge Loss", "Focal Loss", "Kullback-Leibler Divergence"],
            metrics: ["Accuracy", "F1 Score", "AUC-ROC", "Precision/Recall"],
            architectures: ["ResNet", "EfficientNet", "Transformer (BERT)", "MLP"]
        },
        "Regression": {
            families: ["Linear Regression", "Gradient Boosting", "Neural Networks", "SVR", "Decision Trees"],
            losses: ["MSE (Mean Squared Error)", "MAE (Mean Absolute Error)", "Huber Loss", "Log-Cosh"],
            metrics: ["RMSE", "MAE", "R-Squared", "MAPE"],
            architectures: ["MLP", "ResNet (1D)", "LSTM/GRU"]
        },
        "Text Generation": {
            families: ["Transformer (Decoder-only)", "Transformer (Encoder-Decoder)", "RNN/LSTM"],
            losses: ["CrossEntropy (Perplexity)", "Sparse Categorical Crossentropy"],
            metrics: ["Perplexity", "BLEU", "ROUGE", "Exact Match"],
            architectures: ["GPT-Style", "Llama-Style", "T5-Style", "BART"]
        },
        "Clustering": {
            families: ["K-Means", "DBSCAN", "Hierarchical", "Gaussian Mixture"],
            losses: ["Inertia", "Silhouette Score"],
            metrics: ["Silhouette Coefficient", "Davies-Bouldin Index"],
            architectures: ["Autoencoder", "VAE"]
        },
        "Time Series Forecasting": {
            families: ["ARIMA/SARIMA", "Prophet", "LSTM/GRU", "Transformer (Temporal)"],
            losses: ["MSE", "Quantile Loss"],
            metrics: ["MAPE", "RMSE", "MASE"],
            architectures: ["Temporal Fusion Transformer", "N-BEATS", "LSTM"]
        }
    };

    // State for form fields
    const [config, setConfig] = useState({
        modelFamily: "Neural Networks",
        architecture: "ResNet",
        layers: 4,
        hiddenUnits: 128,
        activation: "ReLU",
        optimizer: "Adam",
        learningRate: 0.001,
        lossFunction: "CrossEntropy",
        batchSize: 32,
        epochs: 100,
        dropout: 0.2,
        device: "GPU",
        precision: "Mixed (FP16)"
    });

    const handleConfigChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const currentOptions = TASK_OPTIONS[taskType] || TASK_OPTIONS["Classification"];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">New Model Builder</h1>
                <p className="text-slate-400 mt-2">Configure and launch a new automated experiment.</p>
            </div>

            {/* Progress Stepper */}
            <div className="flex justify-between items-center relative max-w-3xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                {STEPS.map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 bg-background px-4">
                        <div className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 border-background",
                            i <= currentStep ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-slate-800 text-slate-500"
                        )}>
                            {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
                        </div>
                        <span className={clsx(
                            "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                            i <= currentStep ? "text-white" : "text-slate-500"
                        )}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>

            <Card className="bg-glass-surface/30 backdrop-blur-xl border-white/5 shadow-2xl">
                <CardContent className="p-8 min-h-[500px] flex flex-col">
                    {currentStep === 0 && (
                        <div className="space-y-8 max-w-2xl mx-auto w-full">
                            <div className="flex items-center gap-4 p-6 border border-primary/20 bg-primary/5 rounded-xl">
                                <Database className="w-10 h-10 text-primary" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Select Dataset</h3>
                                    <p className="text-slate-400">Choose the training data source for your model.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {["customer_churn_v2.csv", "sales_q3_2025.csv", "maintenance_logs.parquet"].map((file) => (
                                    <div key={file} className="p-6 border border-white/10 rounded-xl hover:bg-white/5 hover:border-primary/50 cursor-pointer flex items-center gap-4 transition-all group">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Database className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                        </div>
                                        <span className="text-lg text-slate-200">{file}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-8 max-w-2xl mx-auto w-full">
                            <div className="flex items-center gap-4 p-6 border border-primary/20 bg-primary/5 rounded-xl">
                                <Settings className="w-10 h-10 text-primary" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Select Target Variable</h3>
                                    <p className="text-slate-400">Define the prediction target (label) column.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Target Column Name</label>
                                <Input className="bg-black/20 border-white/10 text-white h-12 text-lg" placeholder="e.g. churn, price, sentiment" />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="flex flex-col h-full gap-6">
                            {/* Mode Toggle */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-black/20 p-1 rounded-full border border-white/5 flex gap-1">
                                    <button
                                        onClick={() => setConfigMode('auto')}
                                        className={clsx(
                                            "px-6 py-2 rounded-full text-sm font-medium transition-all",
                                            configMode === 'auto' ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Auto Mode
                                    </button>
                                    <button
                                        onClick={() => setConfigMode('custom')}
                                        className={clsx(
                                            "px-6 py-2 rounded-full text-sm font-medium transition-all",
                                            configMode === 'custom' ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Advanced Configuration
                                    </button>
                                </div>
                            </div>

                            {configMode === 'auto' ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {[
                                        { mode: "Best Quality", desc: "Maximizes accuracy, longer training time.", icon: Star },
                                        { mode: "Balanced", desc: "Good trade-off between speed and accuracy.", icon: Scale },
                                        { mode: "Fastest", desc: "Quick results for rapid iteration.", icon: Zap }
                                    ].map((item) => (
                                        <Card key={item.mode} className="bg-black/20 border-white/10 hover:border-primary/50 cursor-pointer transition-all hover:scale-105 group">
                                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    {item.icon && <item.icon className="w-8 h-8 text-primary" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-2">{item.mode}</h3>
                                                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8 h-full min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Sidebar Tabs */}
                                    <div className="w-full md:w-64 space-y-1">
                                        {TABS.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={clsx(
                                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                                    activeTab === tab.id ? "bg-white/10 text-white border border-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <tab.icon className={clsx("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-slate-500")} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Config Form Area */}
                                    <div className="flex-1 bg-black/20 rounded-xl border border-white/5 p-6">
                                        {activeTab === 'general' && (
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">General Configuration</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Task Type</label>
                                                        <select
                                                            value={taskType}
                                                            onChange={(e) => setTaskType(e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none"
                                                        >
                                                            {Object.keys(TASK_OPTIONS).map(task => (
                                                                <option key={task} value={task}>{task}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Model Family</label>
                                                        <select
                                                            value={config.modelFamily}
                                                            onChange={(e) => handleConfigChange('modelFamily', e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none"
                                                        >
                                                            {currentOptions.families.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'architecture' && (
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Architecture</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Base Architecture</label>
                                                        <select
                                                            value={config.architecture}
                                                            onChange={(e) => handleConfigChange('architecture', e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none"
                                                        >
                                                            {currentOptions.architectures.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Num Layers / Blocks</label>
                                                        <Input type="number" value={config.layers} onChange={(e) => handleConfigChange('layers', e.target.value)} className="bg-black/40 border-white/10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Hidden Units / Dim</label>
                                                        <Input type="number" value={config.hiddenUnits} onChange={(e) => handleConfigChange('hiddenUnits', e.target.value)} className="bg-black/40 border-white/10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Activation</label>
                                                        <select className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none">
                                                            <option>ReLU</option>
                                                            <option>GELU</option>
                                                            <option>Sigmoid</option>
                                                            <option>Tanh</option>
                                                            <option>Swish</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'training' && (
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Training Strategy</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Training Method</label>
                                                        <select className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none">
                                                            <option>From Scratch</option>
                                                            <option>Fine-tuning</option>
                                                            <option>Transfer Learning</option>
                                                            <option>LoRA / PEFT</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Batch Size</label>
                                                        <Input type="number" value={config.batchSize} onChange={(e) => handleConfigChange('batchSize', e.target.value)} className="bg-black/40 border-white/10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Epochs</label>
                                                        <Input type="number" value={config.epochs} onChange={(e) => handleConfigChange('epochs', e.target.value)} className="bg-black/40 border-white/10" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'optimization' && (
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Optimization</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Optimizer</label>
                                                        <select className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none">
                                                            <option>Adam</option>
                                                            <option>AdamW</option>
                                                            <option>SGD</option>
                                                            <option>RMSProp</option>
                                                            <option>AdaFactor</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Learning Rate</label>
                                                        <Input type="number" step="0.0001" value={config.learningRate} onChange={(e) => handleConfigChange('learningRate', e.target.value)} className="bg-black/40 border-white/10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Loss Function</label>
                                                        <select
                                                            value={config.lossFunction}
                                                            onChange={(e) => handleConfigChange('lossFunction', e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none"
                                                        >
                                                            {currentOptions.losses.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'regularization' && (
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Regularization</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Dropout Rate</label>
                                                        <Input type="number" step="0.1" value={config.dropout} onChange={(e) => handleConfigChange('dropout', e.target.value)} className="bg-black/40 border-white/10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Label Smoothing</label>
                                                        <Input type="number" step="0.1" defaultValue={0.1} className="bg-black/40 border-white/10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Weight Decay</label>
                                                        <Input type="number" step="0.0001" defaultValue={0.01} className="bg-black/40 border-white/10" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'resources' && (
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Compute Resources</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Device</label>
                                                        <select className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none">
                                                            <option>GPU (CUDA)</option>
                                                            <option>CPU</option>
                                                            <option>TPU</option>
                                                            <option>Multi-GPU (DDP)</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Precision</label>
                                                        <select className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-primary outline-none">
                                                            <option>FP32 (Full)</option>
                                                            <option>FP16 (Mixed)</option>
                                                            <option>BF16</option>
                                                            <option>INT8 (Quantized)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                <div className="relative w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center animate-pulse border border-primary/20">
                                    <Play className="w-12 h-12 text-primary ml-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-white">Ready to Train</h3>
                                <p className="text-slate-400 max-w-md mx-auto text-lg">
                                    {configMode === 'auto'
                                        ? "We will train 15+ models including XGBoost, CatBoost, and Neural Networks."
                                        : "Training with custom configuration on dedicated GPU instance."}
                                </p>
                            </div>
                            <div className="flex gap-4 text-sm text-slate-500 font-mono bg-black/30 px-6 py-3 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> 4x vCPU</span>
                                <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> ~15-20 mins</span>
                                <span className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Standard</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-8 mt-auto border-t border-white/5">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep(c => c - 1)}
                            disabled={currentStep === 0}
                            className={clsx(currentStep === 0 ? "opacity-0" : "opacity-100", "text-slate-400 hover:text-white")}
                        >
                            Back
                        </Button>
                        <Button onClick={() => currentStep < 3 ? setCurrentStep(c => c + 1) : null} className="gap-2 px-8 py-6 text-lg shadow-lg shadow-primary/25">
                            {currentStep === 3 ? "Start Experiment" : "Next Step"}
                            {currentStep < 3 && <ArrowUpRight className="w-5 h-5" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Icons for Auto Mode Cards
function Star(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}

function Scale(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
    )
}

function Zap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}
