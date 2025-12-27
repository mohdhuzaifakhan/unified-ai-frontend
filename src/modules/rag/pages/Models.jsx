import { useState } from 'react';
import { Bot, Cpu, Zap, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const Models = () => {
    const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro');

    const models = [
        {
            id: 'gemini-1.5-pro',
            name: 'Gemini 1.5 Pro',
            provider: 'Google',
            desc: 'Best for complex reasoning and large context windows.',
            type: 'text',
            icon: Zap
        },
        {
            id: 'gemini-1.5-flash',
            name: 'Gemini 1.5 Flash',
            provider: 'Google',
            desc: 'Fast, efficient, and low latency for high volume tasks.',
            type: 'text',
            icon: Zap
        },
        {
            id: 'gpt-4',
            name: 'GPT-4 Turbo',
            provider: 'OpenAI',
            desc: 'High capability model for generation and analysis.',
            type: 'text',
            icon: Bot
        }
    ];

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Model Registry</h2>
                <p className="text-slate-400">Select and configure the LLMs used by your agents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model) => (
                    <div
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={clsx(
                            "relative p-6 rounded-xl border border-slate-700/50 cursor-pointer transition-all group",
                            selectedModel === model.id
                                ? "bg-brand-500/10 border-brand-500/50 shadow-lg shadow-brand-500/5"
                                : "bg-slate-900/50 hover:border-slate-600"
                        )}
                    >
                        {selectedModel === model.id && (
                            <div className="absolute top-4 right-4 text-brand-400">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        )}

                        <div className={clsx("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors",
                            selectedModel === model.id ? "bg-brand-500/20 text-brand-400" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                        )}>
                            <model.icon className="w-6 h-6" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{model.name}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">{model.provider}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{model.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Fine-Tuning (Coming Soon)</h3>
                        <p className="text-slate-400 max-w-2xl">
                            Train custom models on your ingrained data for specialized tasks.
                            We are currently building adapters for LoRA fine-tuning directly within the dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Models;
