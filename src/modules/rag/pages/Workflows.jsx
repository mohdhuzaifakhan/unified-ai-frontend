import { useEffect, useRef, useState, useCallback } from 'react';
import Drawflow from 'drawflow';
import 'drawflow/dist/drawflow.min.css';
import {
    Zap, Clock, Users, Bot, Globe, Briefcase,
    TerminalSquare, Server, Database, Image as ImageIcon,
    Share2, X, Info, Copy
} from 'lucide-react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

// Component mapping for node icons to React components
const iconMap = {
    zap: Zap,
    clock: Clock,
    users: Users,
    bot: Bot,
    globe: Globe,
    briefcase: Briefcase,
    'terminal-square': TerminalSquare,
    server: Server,
    database: Database,
    image: ImageIcon
};

const Workflows = () => {
    const drawflowRef = useRef(null);
    const editorRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [configOpen, setConfigOpen] = useState(false);
    const [integrationModalOpen, setIntegrationModalOpen] = useState(false);

    useEffect(() => {
        if (!drawflowRef.current) return;

        const editor = new Drawflow(drawflowRef.current);
        editor.reroute = true;
        editor.reroute_fix_curvature = true;
        editor.force_first_input = false;
        editor.start();
        editorRef.current = editor;

        // Events
        editor.on('nodeCreated', (id) => console.log("Node created", id));
        editor.on('nodeSelected', (id) => {
            const node = editor.getNodeFromId(id);
            setSelectedNode({ ...node, id });
            setConfigOpen(true);
        });
        editor.on('nodeUnselected', () => {
            setSelectedNode(null);
            setConfigOpen(false);
        });
        editor.on('click', (e) => {
            if (e.target.closest('.drawflow-node') === null) {
                setConfigOpen(false);
            }
        });

        // Initial Workflow
        addNodeToBoard('trigger-webhook', 100, 250);
        addNodeToBoard('agent-manager', 450, 250);
        addNodeToBoard('agent-worker', 800, 250);

    }, []);

    const addNodeToBoard = (nodeType, x, y) => {
        if (!editorRef.current) return;

        let title = '';
        let iconHtml = ''; // Using HTML string for icon
        let contentHtml = '';
        let inputs = 1;
        let outputs = 1;
        let accentColor = ''; // Tailwind border color class or similar

        switch (nodeType) {
            case 'agent-manager':
                title = 'Manager Agent';
                accentColor = 'from-purple-500/20 via-purple-500/5 to-transparent';
                iconHtml = '<i data-lucide="users" class="w-5 h-5 text-purple-400"></i>';
                contentHtml = `
                    <p class="text-slate-300 font-semibold mb-1">Orchestrator: Auto</p>
                    <p class="text-xs text-slate-500">Delegates tasks to workers based on complexity.</p>
                `;
                break;
            case 'agent-worker':
                title = 'Worker Agent';
                accentColor = 'from-indigo-500/20 via-indigo-500/5 to-transparent';
                iconHtml = '<i data-lucide="briefcase" class="w-5 h-5 text-indigo-400"></i>';
                contentHtml = `
                    <p class="text-slate-300 font-semibold mb-1">Role: Researcher</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] text-indigo-300">Analysis</span>
                        <span class="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] text-indigo-300">Data</span>
                    </div>
                `;
                break;
            case 'agent-llm':
                title = 'LLM Agent';
                accentColor = 'from-brand-500/20 via-brand-500/5 to-transparent';
                iconHtml = '<i data-lucide="bot" class="w-5 h-5 text-brand-400"></i>';
                contentHtml = `
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-slate-500">Model</span>
                        <span class="text-xs font-mono text-brand-300">Gemini 2.0</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-500">Temp</span>
                        <span class="text-xs font-mono text-slate-300">0.7</span>
                    </div>
                `;
                break;
            case 'agent-web':
                title = 'Web Surfer';
                accentColor = 'from-blue-500/20 via-blue-500/5 to-transparent';
                iconHtml = '<i data-lucide="globe" class="w-5 h-5 text-blue-400"></i>';
                contentHtml = `
                    <p class="text-slate-300 font-semibold mb-1">Headless Browser</p>
                    <p class="text-xs text-slate-500">Browses live web data with JS support.</p>
                `;
                break;
            case 'trigger-webhook':
                title = 'Webhook';
                inputs = 0;
                accentColor = 'from-green-500/20 via-green-500/5 to-transparent';
                iconHtml = '<i data-lucide="zap" class="w-5 h-5 text-green-400"></i>';
                contentHtml = `
                    <div class="p-2 bg-black/40 rounded border border-white/5 font-mono text-[10px] text-green-400 truncate">
                        POST /hooks/v1/run
                    </div>
                `;
                break;
            case 'trigger-schedule':
                title = 'Schedule';
                inputs = 0;
                accentColor = 'from-green-500/20 via-green-500/5 to-transparent';
                iconHtml = '<i data-lucide="clock" class="w-5 h-5 text-green-400"></i>';
                contentHtml = `
                    <p class="text-slate-300 font-semibold mb-1">Daily Cron</p>
                    <p class="text-xs text-slate-500">Runs every day at 09:00 AM UTC.</p>
                `;
                break;
            case 'tool-code-interpreter':
                title = 'Code Interpreter';
                accentColor = 'from-yellow-500/20 via-yellow-500/5 to-transparent';
                iconHtml = '<i data-lucide="terminal-square" class="w-5 h-5 text-yellow-400"></i>';
                contentHtml = `
                    <p class="text-slate-300 font-semibold mb-1">Python 3.11</p>
                    <p class="text-xs text-slate-500">Sandboxed execution environment.</p>
                `;
                break;
            case 'tool-image-gen':
                title = 'Image Gen';
                accentColor = 'from-pink-500/20 via-pink-500/5 to-transparent';
                iconHtml = '<i data-lucide="image" class="w-5 h-5 text-pink-400"></i>';
                contentHtml = `
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-slate-500">Model</span>
                        <span class="text-xs font-mono text-pink-300">Imagen 3</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-500">Size</span>
                        <span class="text-xs font-mono text-slate-300">1024x1024</span>
                    </div>
                `;
                break;
            case 'tool-api':
                title = 'HTTP Request';
                accentColor = 'from-orange-500/20 via-orange-500/5 to-transparent';
                iconHtml = '<i data-lucide="server" class="w-5 h-5 text-orange-400"></i>';
                contentHtml = `
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">GET</span>
                        <span class="text-xs text-slate-400 truncate">api.exa.ai/search</span>
                    </div>
                `;
                break;
            case 'tool-retriever':
                title = 'RAG Retriever';
                accentColor = 'from-cyan-500/20 via-cyan-500/5 to-transparent';
                iconHtml = '<i data-lucide="database" class="w-5 h-5 text-cyan-400"></i>';
                contentHtml = `
                    <p class="text-slate-300 font-semibold mb-1">Source: "Q4 Finance"</p>
                    <p class="text-xs text-slate-500">Top K: 5 · Hybrid Search</p>
                `;
                break;
            default: return;
        }

        const html = `
        <div class="h-full w-full flex flex-col">
            <div class="node-header ${accentColor ? `bg-gradient-to-r ${accentColor}` : ''}">
                ${iconHtml}
                <span class="font-semibold text-slate-200 tracking-tight">${title}</span>
            </div>
            <div class="node-body">
                ${contentHtml}
            </div>
        </div>
    `;

        editorRef.current.addNode(nodeType, inputs, outputs, x, y, nodeType, {}, html);

        // Trigger Lucide
        if (window.lucide) {
            requestAnimationFrame(() => window.lucide.createIcons());
        }
    };

    const handleDragStart = (e, nodeType) => {
        e.dataTransfer.setData("node", nodeType);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const nodeType = e.dataTransfer.getData("node");
        if (nodeType) {
            addNodeToBoard(nodeType, e.clientX, e.clientY);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] select-none">

            {/* Top Bar / Toolbox */}
            <div className="h-28 bg-dark-950 border-b border-slate-800 flex items-center px-6 gap-6 shadow-xl relative z-20 overflow-x-auto overflow-y-hidden whitespace-nowrap">

                {/* Helper Group Component */}
                <ToolboxGroup title="Triggers">
                    <ToolboxItem icon={Zap} label="Webhook" type="trigger-webhook" onDragStart={handleDragStart} color="text-green-400" />
                    <ToolboxItem icon={Clock} label="Schedule" type="trigger-schedule" onDragStart={handleDragStart} color="text-green-400" />
                </ToolboxGroup>

                <ToolboxGroup title="Agents">
                    <ToolboxItem icon={Users} label="Manager" type="agent-manager" onDragStart={handleDragStart} color="text-purple-400" />
                    <ToolboxItem icon={Bot} label="LLM" type="agent-llm" onDragStart={handleDragStart} color="text-brand-400" />
                    <ToolboxItem icon={Globe} label="Surfer" type="agent-web" onDragStart={handleDragStart} color="text-blue-400" />
                    <ToolboxItem icon={Briefcase} label="Worker" type="agent-worker" onDragStart={handleDragStart} color="text-indigo-400" />
                </ToolboxGroup>

                <ToolboxGroup title="Tools">
                    <ToolboxItem icon={TerminalSquare} label="Code" type="tool-code-interpreter" onDragStart={handleDragStart} color="text-yellow-400" />
                    <ToolboxItem icon={Server} label="API" type="tool-api" onDragStart={handleDragStart} color="text-orange-400" />
                    <ToolboxItem icon={Database} label="RAG" type="tool-retriever" onDragStart={handleDragStart} color="text-cyan-400" />
                    <ToolboxItem icon={ImageIcon} label="Image" type="tool-image-gen" onDragStart={handleDragStart} color="text-pink-400" />
                </ToolboxGroup>

                <button
                    onClick={() => setIntegrationModalOpen(true)}
                    className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-blue-600 rounded-lg text-white font-medium shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all hover:-translate-y-0.5"
                >
                    <Share2 className="w-4 h-4" /> Integrate
                </button>
            </div>

            {/* Main Canvas */}
            <div
                ref={drawflowRef}
                className="flex-1 w-full relative bg-dark-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {/* Drawflow injects here */}
            </div>

            {/* Config Panel */}
            <div className={`
        fixed top-[8rem] right-0 bottom-0 w-80 bg-dark-950/95 backdrop-blur-md border-l border-slate-800 p-6 z-30 transition-transform duration-300 ease-in-out shadow-2xl
        ${configOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white">Configuration</h3>
                    <button onClick={() => setConfigOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {selectedNode ? (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Node Name</label>
                            <input type="text" defaultValue={`${selectedNode.name} #${selectedNode.id}`} className="w-full bg-slate-900 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none text-slate-200" />
                        </div>

                        {selectedNode.name.includes('agent') && (
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">System Instruction</label>
                                <textarea className="w-full bg-slate-900 border border-slate-700/50 rounded-md px-3 py-2 text-sm h-32 focus:border-brand-500 outline-none resize-none text-slate-200" placeholder="You are a helpful assistant..."></textarea>
                            </div>
                        )}

                        <div className="absolute bottom-6 left-6 right-6">
                            <button className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-brand-500/20">
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm">Select a node to configure it.</p>
                )}
            </div>

            {/* Integration Modal */}
            {integrationModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={(e) => e.target === e.currentTarget && setIntegrationModalOpen(false)}>
                    <div className="bg-dark-900 border border-slate-700 rounded-xl w-full max-w-2xl p-8 shadow-2xl scale-100 animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Integrate Workflow</h2>
                            <button onClick={() => setIntegrationModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-2">Execute via API</h3>
                                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex justify-between items-center group">
                                    <code className="text-sm font-mono text-slate-300">POST /api/run-workflow/wf_12345</code>
                                    <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-2">Embed Widget</h3>
                                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-blue-300 overflow-x-auto">
                                    &lt;iframe src="http://localhost:5000/embed/workflow/wf_12345" width="100%" height="500px" frameborder="0"&gt;&lt;/iframe&gt;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const ToolboxGroup = ({ title, children }) => (
    <div className="flex flex-col gap-2 p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl flex-shrink-0">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">{title}</h4>
        <div className="flex gap-3">
            {children}
        </div>
    </div>
);

const ToolboxItem = ({ icon: Icon, label, type, onDragStart, color }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, type)}
        className="w-[72px] h-[64px] flex flex-col items-center justify-center gap-1.5 bg-slate-900/80 border border-slate-700/50 rounded-lg cursor-grab hover:bg-slate-800 hover:border-brand-500/50 hover:-translate-y-0.5 hover:shadow-lg transition-all active:cursor-grabbing"
    >
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-[10px] font-medium text-slate-300">{label}</span>
    </div>
);

export default Workflows;
