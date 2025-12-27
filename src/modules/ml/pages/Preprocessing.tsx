import { ArrowRight, Plus, Settings, Trash2, FileJson, Table, Database, Layers, Activity, Cpu, MessageSquare, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useState } from "react";
import clsx from "clsx";

const TRANSFORMS = [
    { id: 1, type: "Ingest", name: "Load CSV", icon: FileJson, config: "sales_data.csv" },
    { id: 2, type: "Clean", name: "Drop Nulls", icon: Trash2, config: "threshold: 5%" },
    { id: 3, type: "Transform", name: "Normalize", icon: Table, config: "columns: [age, income]" },
    { id: 4, type: "Enrich", name: "GeoIP Lookup", icon: Database, config: "source: ip_address" },
];

type Category = {
    id: string;
    label: string;
    valuelabel: string;
    icon: any;
    sections: {
        title: string;
        items: string[];
    }[];
};

const PREPROCESSING_CATEGORIES: Category[] = [
    {
        id: "universal",
        label: "Universal",
        valuelabel: "Universal / Common",
        icon: Layers,
        sections: [
            {
                title: "Data Cleaning",
                items: ["Remove duplicates", "Handle missing values (Mean/Median/Mode)", "KNN imputation", "MICE (Multiple Imputation)", "Forward / backward fill", "Remove inconsistent data", "Fix incorrect labels", "Outlier detection (Z-score, IQR)", "Isolation Forest", "DBSCAN", "Noise removal"]
            },
            {
                title: "Data Validation",
                items: ["Schema validation", "Range checks", "Type checking", "Constraint checks", "Drift detection"]
            },
            {
                title: "Data Transformation",
                items: ["Type casting", "Feature renaming", "Unit normalization", "Date-time parsing"]
            },
            {
                title: "Feature Scaling",
                items: ["Min-Max Scaling", "Standardization (Z-score)", "Robust Scaling", "Log transformation", "Power transformation (Box-Cox)"]
            },
            {
                title: "Feature Selection",
                items: ["Filter methods (correlation)", "Wrapper methods (RFE)", "Embedded methods (Lasso)", "Variance threshold"]
            }
        ]
    },
    {
        id: "tabular",
        label: "Tabular / ML",
        valuelabel: "Tabular / Traditional ML",
        icon: Table,
        sections: [
            {
                title: "Categorical Encoding",
                items: ["Label Encoding", "One-Hot Encoding", "Ordinal Encoding", "Target Encoding", "Frequency Encoding", "Hash Encoding"]
            },
            {
                title: "Numerical Feature Engineering",
                items: ["Binning / Discretization", "Polynomial features", "Interaction features", "Log / exp features", "Aggregation features"]
            },
            {
                title: "Imbalance Handling",
                items: ["Oversampling (SMOTE, ADASYN)", "Undersampling", "Class weighting", "Focal loss"]
            }
        ]
    },
    {
        id: "nlp",
        label: "NLP",
        valuelabel: "NLP (Text Data)",
        icon: MessageSquare,
        sections: [
            {
                title: "Text Cleaning",
                items: ["Lowercasing", "Remove punctuation", "Remove HTML tags", "Remove special characters", "Remove emojis", "Unicode normalization"]
            },
            {
                title: "Tokenization",
                items: ["Word tokenization", "Subword tokenization (BPE)", "Sentence tokenization", "Character tokenization"]
            },
            {
                title: "Stopword Processing",
                items: ["Stopword removal", "Stopword retention"]
            },
            {
                title: "Text Normalization",
                items: ["Lemmatization", "Stemming", "Spelling correction", "Contraction expansion"]
            },
            {
                title: "Vectorization",
                items: ["Bag of Words", "TF-IDF", "N-grams", "Word embeddings (Word2Vec, GloVe)", "Contextual embeddings (BERT)", "Sentence embeddings"]
            },
            {
                title: "Advanced NLP",
                items: ["NER", "POS tagging", "Dependency parsing", "Chunking", "Prompt normalization"]
            }
        ]
    },
    {
        id: "vision",
        label: "Computer Vision",
        valuelabel: "Computer Vision",
        icon: ImageIcon,
        sections: [
            {
                title: "Image Cleaning",
                items: ["Remove corrupted images", "Format conversion", "Remove duplicates"]
            },
            {
                title: "Resizing & Formatting",
                items: ["Resize", "Crop", "Padding", "Aspect ratio correction", "Channel normalization", "Grayscale conversion"]
            },
            {
                title: "Normalization",
                items: ["Pixel scaling (0–1)", "Mean-Std normalization", "Histogram equalization", "CLAHE"]
            },
            {
                title: "Augmentation",
                items: ["Rotation", "Flipping", "Scaling", "Translation", "Zoom", "Random crop", "Color jitter", "Gaussian noise", "CutMix", "MixUp", "RandAugment"]
            },
            {
                title: "Label Processing",
                items: ["Bounding box normalization", "Mask preprocessing", "Anchor box generation"]
            }
        ]
    },
    {
        id: "timeseries",
        label: "Time Series",
        valuelabel: "Time Series",
        icon: Activity,
        sections: [
            {
                title: "Time Handling",
                items: ["Timestamp parsing", "Time zone normalization", "Resampling", "Windowing", "Lag features"]
            },
            {
                title: "Missing Data",
                items: ["Forward fill", "Backward fill", "Interpolation", "Seasonal imputation"]
            },
            {
                title: "Feature Engineering",
                items: ["Rolling mean", "Rolling std", "Trend extraction", "Seasonality decomposition", "Fourier features"]
            },
            {
                title: "Scaling",
                items: ["Min-max", "Standard scaling", "Per-series normalization"]
            }
        ]
    },
    {
        id: "audio",
        label: "Audio",
        valuelabel: "Audio / Speech",
        icon: Activity,
        sections: [
            {
                title: "Audio Cleaning",
                items: ["Silence removal", "Noise reduction", "Clipping correction", "Resampling"]
            },
            {
                title: "Feature Extraction",
                items: ["MFCC", "Spectrogram", "Mel spectrogram", "Chroma features", "Zero crossing rate"]
            },
            {
                title: "Normalization",
                items: ["Amplitude normalization", "Length padding/trimming"]
            }
        ]
    },
    {
        id: "deeplearning",
        label: "Deep Learning",
        valuelabel: "Deep Learning Specific",
        icon: Cpu,
        sections: [
            {
                title: "Tensor Preparation",
                items: ["Padding & masking", "Batch normalization", "Data type casting", "Device placement"]
            },
            {
                title: "Regularization",
                items: ["Dropout", "Label smoothing", "MixUp / CutMix"]
            },
            {
                title: "Optimization",
                items: ["Shuffling", "Prefetching", "Caching", "Parallel loading"]
            }
        ]
    },
    {
        id: "graph",
        label: "Graph",
        valuelabel: "Graph Data (GNNs)",
        icon: Layers,
        sections: [
            {
                title: "Cleaning",
                items: ["Remove isolated nodes", "Fix invalid edges"]
            },
            {
                title: "Encoding",
                items: ["Node features", "Edge features", "Adjacency matrix", "Laplacian normalization"]
            },
            {
                title: "Sampling",
                items: ["Subgraph sampling", "Neighbor sampling"]
            }
        ]
    },
    {
        id: "multimodal",
        label: "Multimodal",
        valuelabel: "Multimodal (Text+Img+Audio)",
        icon: Layers,
        sections: [
            {
                title: "Alignment",
                items: ["Time alignment", "Modal synchronization"]
            },
            {
                title: "Fusion",
                items: ["Early fusion", "Late fusion", "Cross-attention preprocessing"]
            }
        ]
    },
    {
        id: "llm",
        label: "LLM",
        valuelabel: "LLM Specific",
        icon: MessageSquare,
        sections: [
            {
                title: "LLM Preprocessing",
                items: ["Prompt cleaning", "Instruction normalization", "Context window trimming", "Chunking (RAG)", "Embedding normalization", "Deduplication", "Toxic content filtering", "Language detection", "Metadata tagging"]
            }
        ]
    }
];

export default function Preprocessing() {
    const [selectedTab, setSelectedTab] = useState("universal");
    const [config, setConfig] = useState<Record<string, boolean>>({});

    const toggleConfig = (key: string) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Preprocessing Pipeline</h1>
                    <p className="text-slate-400 mt-1">Design your ETL data transformation flows visually.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 hover:text-white">Load Template</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]">Save Pipeline</Button>
                </div>
            </div>

            {/* Pipeline Visualizer */}
            <div className="relative min-h-[300px] border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl p-8 flex items-center gap-4 overflow-x-auto shadow-2xl max-w-full">
                {TRANSFORMS.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4 shrink-0">
                        <Card className="w-64 border-white/5 bg-white/5 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <step.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white">
                                        <Settings className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">{step.type}</div>
                                    <div className="font-medium text-white text-lg">{step.name}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-1 group-hover:text-slate-400">{step.config}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {index < TRANSFORMS.length && (
                            <div className="flex flex-col items-center gap-2 px-2">
                                <ArrowRight className="w-5 h-5 text-slate-700" />
                            </div>
                        )}
                    </div>
                ))}

                <Button variant="outline" className="h-[160px] w-64 border-dashed border-white/10 rounded-xl shrink-0 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span>Add Step</span>
                </Button>
            </div>

            {/* Configuration Section */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Configuration</h2>
                    <p className="text-slate-400">Configure detailed preprocessing options for your specific data and model type.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Tabs */}
                    <div className="lg:w-64 shrink-0 space-y-1">
                        {PREPROCESSING_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedTab(cat.id)}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    selectedTab === cat.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {PREPROCESSING_CATEGORIES.map((cat) => (
                            <div key={cat.id} className={clsx(selectedTab === cat.id ? "block" : "hidden")}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {cat.sections.map((section, idx) => (
                                        <Card key={idx} className="bg-black/20 border-white/10 backdrop-blur-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg font-medium text-white">{section.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {section.items.map((item) => {
                                                    const key = `${cat.id}-${section.title}-${item}`;
                                                    const isSelected = config[key] || false;
                                                    return (
                                                        <div
                                                            key={item}
                                                            onClick={() => toggleConfig(key)}
                                                            className={clsx(
                                                                "flex items-start gap-3 p-3 rounded-md cursor-pointer border transition-all duration-200",
                                                                isSelected
                                                                    ? "bg-primary/10 border-primary/30"
                                                                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                                                            )}
                                                        >
                                                            <div className={clsx(
                                                                "mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                                isSelected
                                                                    ? "bg-primary border-primary text-primary-foreground"
                                                                    : "border-slate-600 group-hover:border-slate-500"
                                                            )}>
                                                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                            </div>
                                                            <span className={clsx("text-sm", isSelected ? "text-white" : "text-slate-400")}>
                                                                {item}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
