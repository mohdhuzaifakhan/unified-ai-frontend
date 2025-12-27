import { Code2, MessageSquare, Copy, Webhook, Book, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const Integration = () => {
    const handleCopy = (id) => {
        const text = document.getElementById(id)?.innerText;
        if (text) {
            navigator.clipboard.writeText(text);
            alert("Snippet copied!");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Embed & Integrate</h2>
                    <p className="text-slate-400">Get your RAG chatbot up and running.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Environment:</span>
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-sm font-medium">
                        Production (Simulated)
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-start justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                            <Code2 className="w-6 h-6 text-brand-400" />
                            Web Widget Configuration
                        </h3>
                        <p className="text-slate-400 max-w-xl">
                            Copy the snippet below and paste it into the <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200 text-xs font-mono">&lt;body&gt;</code> of your application.
                            The widget is pre-configured with your project settings.
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Live Preview</p>
                        <div className="relative group cursor-pointer" onClick={() => alert('Look at the bottom right corner!')}>
                            <div className="w-12 h-12 rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 flex items-center justify-center text-white animate-bounce-slow">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group z-10">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleCopy('embed-code')} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium transition-colors">
                            <Copy className="w-3 h-3" /> Copy to Clipboard
                        </button>
                    </div>
                    <pre className="bg-slate-950/80 backdrop-blur rounded-xl p-6 overflow-x-auto border border-slate-800 text-sm font-mono text-slate-300 shadow-2xl" id="embed-code">
                        {`<!-- RAG Service Widget -->
<script src="http://localhost:5000/widget.js"></script>
<script>
  // The widget automatically initializes and connects to your
  // configured Gemini backend.
  console.log("RAG Widget Loaded");
</script>`}
                    </pre>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-brand-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-800 rounded-lg text-purple-400">
                            <Webhook className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">REST API</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">Build your own UI using our endpoints.</p>
                    <div className="bg-slate-950 rounded border border-slate-800 p-3 font-mono text-xs text-slate-300">
                        POST /api/chat
                    </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-brand-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-800 rounded-lg text-orange-400">
                            <Book className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Documentation</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">Read the full integration guide.</p>
                    <a href="#" className="text-brand-400 text-sm font-medium hover:underline">View Docs &rarr;</a>
                </div>
            </div>
        </div>
    );
};

export default Integration;
