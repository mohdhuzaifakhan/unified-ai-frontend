import { Bot, Layers, Sparkles, User } from "lucide-react";

export const services = [
    {
        id: "rag",
        name: "RAG Service",
        status: "active",
        description:
            "Transform static data into living intelligence with our advanced retrieval pipelines.",
        icon: Layers,
        path: "/rag",
        gradient: "from-purple-500 to-pink-500",
        features: ["Vector Search", "Auto-Ingestion", "Context Memory"],
    },
    {
        id: "ml",
        name: "ML Service",
        status: "coming-soon",
        description:
            "Deploy production-grade models with zero infrastructure management.",
        icon: Bot,
        gradient: "from-slate-800 to-slate-900",
        features: ["Auto-Training", "Model Registry"],
    },
    {
        id: "agents",
        name: "Agents",
        status: "coming-soon",
        description:
            "Autonomous agents that orchestrate tools and solve complex tasks.",
        icon: User,
        gradient: "from-slate-800 to-slate-900",
        features: ["Tool Use", "Task Planning"],
    },
    {
        id: "finetuning",
        name: "Fine-Tuning",
        status: "coming-soon",
        description:
            "Customize LLMs on your proprietary data for specialized accuracy.",
        icon: Sparkles,
        gradient: "from-slate-800 to-slate-900",
        features: ["PEFT/LoRA", "Domain Adaptation"],
    },
];