import { useEffect, useRef, useState } from "react";
import Drawflow from "drawflow";
import "drawflow/dist/drawflow.min.css";
import {
  Zap,
  Bot,
  Database,
  Server,
  X,
  Play,
  Code,
  Save,
  Settings,
  Layers,
  RefreshCw
} from "lucide-react";
import { useProject } from "../../rag/context/ProjectContext";
import { dataIngestionApi } from "@/services/api/dataIngestionApi";
import { modelConfigApi } from "@/services/api/modelConfigApi";

const NODE_REGISTRY_BASE = {
  "trigger-webhook": {
    title: "Webhook",
    icon: <Zap size={18} />,
    color: "#22c55e",
    inputs: 0,
    outputs: 1,
    config: { path: "/api/v1/run", method: "POST" },
  },
  "agent-llm": {
    title: "AI Agent",
    icon: <Bot size={18} />,
    color: "#3b82f6",
    inputs: 1,
    outputs: 1,
    config: { model: "Select Model...", system_prompt: "You are a helpful assistant." },
  },
  "tool-rag": {
    title: "Knowledge Base",
    icon: <Database size={18} />,
    color: "#a855f7",
    inputs: 1,
    outputs: 1,
    config: { index: "Select Index...", top_k: 5 },
  },
  "tool-api": {
    title: "HTTP Request",
    icon: <Server size={18} />,
    color: "#f59e0b",
    inputs: 1,
    outputs: 1,
    config: { url: "https://api.service.com", auth: "Bearer" },
  },
};

const Workflows = () => {
  const { currentProject } = useProject();
  const canvasRef = useRef(null);
  const editorRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real config storage
  const [ingestionConfigs, setIngestionConfigs] = useState([]);
  const [modelConfigs, setModelConfigs] = useState([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const editor = new Drawflow(canvasRef.current);
    editor.start();
    editorRef.current = editor;

    editor.reroute = true;
    editor.curvature = 0.5;

    editor.on("nodeSelected", (id) => {
      const node = editor.getNodeFromId(id);
      setSelectedNode({ ...node });
    });

    editor.on("nodeUnselected", () => setSelectedNode(null));

    if (currentProject?._id) {
      fetchConfigs();
    }
  }, [currentProject?._id]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const [ingestionRes, modelRes] = await Promise.all([
        dataIngestionApi.getAllEmbeddingsWithMetadataOfProject(currentProject._id),
        modelConfigApi.getConfig(currentProject._id)
      ]);
      setIngestionConfigs(ingestionRes || []);
      setModelConfigs(Array.isArray(modelRes) ? modelRes : (modelRes ? [modelRes] : []));
    } catch (err) {
      console.error("Failed to fetch workflow configs:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNodeToCanvas = (type, x, y) => {
    const def = NODE_REGISTRY_BASE[type];

    // Inject real defaults if available
    let customConfig = { ...def.config };
    if (type === "agent-llm" && modelConfigs.length > 0) {
      customConfig.model = modelConfigs[0].model;
    }
    if (type === "tool-rag" && ingestionConfigs.length > 0) {
      customConfig.index = ingestionConfigs[0].embedding_model;
    }

    const html = `
      <div class="custom-node-wrapper" style="border-left: 5px solid ${def.color
      }">
        <div class="node-icon" style="color: ${def.color}">${type === "trigger-webhook" ? "⚡" : "🤖"
      }</div>
        <div class="node-info">
          <div class="node-name">${def.title}</div>
          <div class="node-type">${type.split("-")[0]}</div>
        </div>
      </div>
    `;
    editorRef.current.addNode(
      type,
      def.inputs,
      def.outputs,
      x,
      y,
      type,
      customConfig,
      html
    );
  };

  const handleUpdateConfig = (key, value) => {
    const newData = { ...selectedNode.data, [key]: value };
    editorRef.current.updateNodeDataFromId(selectedNode.id, newData);
    setSelectedNode({ ...selectedNode, data: newData });
  };

  const getEmbedCode = () => {
    return `<script 
  src="https://cdn.agentflow.ai/widget.js" 
  data-agent-id="AGENT_${Math.random().toString(36).substring(7).toUpperCase()}"
  async>
</script>`;
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <aside className="group w-20 hover:w-72 bg-[#0f172a] border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-20">
        <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden space-y-6">
          <section>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
              Components
            </p>
            <div className="flex flex-col gap-2">
              {Object.entries(NODE_REGISTRY_BASE).map(([key, node]) => (
                <div
                  key={key}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("node", key)}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing group/item"
                >
                  <div className="min-w-[20px] text-slate-400 group-hover/item:text-blue-400 transition-colors shrink-0">
                    {node.icon}
                  </div>
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {node.title}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-4 bg-slate-900/30 border-t border-slate-800">
          <button
            onClick={() => setShowEmbedModal(true)}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-900/20 overflow-hidden"
          >
            <div className="shrink-0">
              <Play size={16} fill="currentColor" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Deploy Agent
            </span>
          </button>
        </div>
      </aside>
      <main
        className="flex-1 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
        ref={canvasRef}
        onDrop={(e) => {
          const type = e.dataTransfer.getData("node");
          const rect = canvasRef.current.getBoundingClientRect();
          addNodeToCanvas(type, e.clientX - rect.left, e.clientY - rect.top);
        }}
        onDragOver={(e) => e.preventDefault()}
      />

      {selectedNode && (
        <aside className="w-80 bg-[#0f172a] border-l border-slate-800 animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-slate-400" />
              <span className="font-semibold text-sm">Node Settings</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-slate-800 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {Object.entries(selectedNode.data).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  {key.replace("_", " ")}
                </label>
                {key === "model" ? (
                  <select
                    value={value}
                    onChange={(e) => handleUpdateConfig(key, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-300"
                  >
                    <option value="">Select Engine...</option>
                    {modelConfigs.map(m => <option key={m._id} value={m.model}>{m.model}</option>)}
                  </select>
                ) : key === "index" ? (
                  <select
                    value={value}
                    onChange={(e) => handleUpdateConfig(key, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-300"
                  >
                    <option value="">Select Index...</option>
                    {ingestionConfigs.map(c => <option key={c._id} value={c.embedding_model}>{c.embedding_model}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleUpdateConfig(key, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                )}
              </div>
            ))}
          </div>
        </aside>
      )}
      {showEmbedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Code size={20} className="text-blue-500" /> Integration
              </h2>
              <X
                className="cursor-pointer"
                onClick={() => setShowEmbedModal(false)}
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-400 mb-4">
                Paste this snippet before the closing &lt;/body&gt; tag of your
                website.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group">
                <code className="text-blue-400 text-xs break-all">
                  {getEmbedCode()}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getEmbedCode());
                    alert("Copied!");
                  }}
                  className="absolute top-2 right-2 p-2 bg-slate-800 rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Save size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .drawflow .drawflow-node { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 0; width: 200px !important; }
        .drawflow .drawflow-node.selected { border: 2px solid #3b82f6 !important; }
        .custom-node-wrapper { padding: 12px; display: flex; align-items: center; gap: 12px; }
        .node-icon { font-size: 20px; }
        .node-name { font-weight: 600; font-size: 13px; color: white; }
        .node-type { font-size: 10px; color: #64748b; text-transform: uppercase; }
        .drawflow .connection .main-path { stroke: #334155; stroke-width: 3px; }
        .drawflow .drawflow-node .input, .drawflow .drawflow-node .output { background: #475569; border: 2px solid #0f172a; width: 12px; height: 12px; }
        .drawflow .drawflow-node .input:hover, .drawflow .drawflow-node .output:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
};

export default Workflows;

// const FloatingSidebar = ({ nodeRegistry, onShowEmbed }) => {
//   return (
//     <aside className="absolute top-6 left-6 z-30 group w-16 hover:w-64 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden">
//       {/* Draggable Handle */}
//       <div className="h-2 w-full bg-slate-800/50 flex justify-center items-center cursor-move">
//         <div className="w-8 h-1 bg-slate-700 rounded-full" />
//       </div>

//       <div className="flex flex-col h-full max-h-[80vh]">
//         {/* Header */}
//         <div className="p-4 border-b border-slate-800/50 flex items-center gap-3">
//           <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
//             <Layers size={16} className="text-white" />
//           </div>
//           <span className="font-bold text-sm tracking-tight opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//             Agent Studio
//           </span>
//         </div>

//         {/* Node List */}
//         <div className="flex-1 p-2 overflow-y-auto space-y-1 custom-scrollbar">
//           {Object.entries(nodeRegistry).map(([key, node]) => (
//             <div
//               key={key}
//               draggable
//               onDragStart={(e) => e.dataTransfer.setData("node", key)}
//               className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-grab active:cursor-grabbing group/item"
//             >
//               <div
//                 className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700/50 bg-slate-950 group-hover/item:border-blue-500/50 transition-colors"
//                 style={{ color: node.color }}
//               >
//                 {node.icon}
//               </div>
//               <div className="opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
//                 <div className="text-xs font-semibold text-slate-200 whitespace-nowrap">{node.title}</div>
//                 <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Component</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer Action */}
//         <div className="p-2 mt-auto border-t border-slate-800/50">
//           <button
//             onClick={onShowEmbed}
//             className="w-full h-10 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
//           >
//             <Play size={14} fill="currentColor" className="shrink-0" />
//             <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//               Deploy
//             </span>
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// const Workflows = () => {
//   const canvasRef = useRef(null);
//   const editorRef = useRef(null);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [showEmbedModal, setShowEmbedModal] = useState(false);

//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const editor = new Drawflow(canvasRef.current);
//     editor.start();
//     editorRef.current = editor;

//     // Advanced Editor Settings
//     editor.reroute = true;
//     editor.reroute_fix_curvature = true;
//     editor.curvature = 0.6;
//     editor.zoom_middle = true;

//     editor.on("nodeSelected", (id) => {
//       const node = editor.getNodeFromId(id);
//       setSelectedNode({ ...node });
//     });

//     editor.on("nodeUnselected", () => setSelectedNode(null));
//   }, []);

//   const addNodeToCanvas = (type, x, y) => {
//     const def = NODE_REGISTRY[type];
//     // Modern High-Fidelity Node HTML
//     const html = `
//       <div class="node-card">
//         <div class="node-glow" style="background: ${def.color}20"></div>
//         <div class="node-header" style="border-bottom: 1px solid ${def.color}30">
//           <span class="node-icon-wrapper" style="background: ${def.color}15; color: ${def.color}">${type === "trigger-webhook" ? "⚡" : "🤖"}</span>
//           <div class="node-label-group">
//             <div class="node-title">${def.title}</div>
//             <div class="node-subtitle">${type.replace('-', ' ')}</div>
//           </div>
//         </div>
//       </div>
//     `;

//     editorRef.current.addNode(type, def.inputs, def.outputs, x, y, type, { ...def.config }, html);
//   };

//   return (
//     <div className="relative h-screen w-full bg-[#020617] text-slate-200 overflow-hidden">

//       {/* 1. Floating Component Sidebar */}
//       <FloatingSidebar nodeRegistry={NODE_REGISTRY} onShowEmbed={() => setShowEmbedModal(true)} />

//       {/* 2. Main Infinite Canvas */}
//       <main
//         className="h-full w-full relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]"
//         ref={canvasRef}
//         onDrop={(e) => {
//           const type = e.dataTransfer.getData("node");
//           const rect = canvasRef.current.getBoundingClientRect();
//           addNodeToCanvas(type, e.clientX - rect.left, e.clientY - rect.top);
//         }}
//         onDragOver={(e) => e.preventDefault()}
//       />

//       {/* 3. Configuration Drawer (Right Side) */}
//       {selectedNode && (
//         <div className="absolute top-6 right-6 z-30 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl animate-in slide-in-from-right-4 duration-300">
//           <div className="p-4 border-b border-slate-800 flex justify-between items-center">
//             <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Configuration</span>
//             <button onClick={() => setSelectedNode(null)} className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white">
//               <X size={16} />
//             </button>
//           </div>
//           <div className="p-5 space-y-4">
//             {Object.entries(selectedNode.data).map(([key, value]) => (
//               <div key={key}>
//                 <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{key}</label>
//                 <input
//                   type="text"
//                   value={value}
//                   onChange={(e) => handleUpdateConfig(key, e.target.value)}
//                   className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 4. Deployment Modal (Simplified for brevity, keep your existing logic here) */}
//       {/* ... (Your existing Modal Code) ... */}

//       <style>{`
//         /* Best-in-class Node Styling */
//         .drawflow .drawflow-node {
//             background: rgba(15, 23, 42, 0.8);
//             backdrop-filter: blur(10px);
//             border: 1px solid rgba(51, 65, 85, 0.5);
//             border-radius: 16px;
//             padding: 0;
//             width: 220px !important;
//             box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3);
//         }
//         .drawflow .drawflow-node.selected { border: 2px solid #3b82f6 !important; box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }

//         .node-card { position: relative; overflow: hidden; border-radius: 16px; padding: 12px; }
//         .node-header { display: flex; align-items: center; gap: 12px; padding-bottom: 8px; }
//         .node-icon-wrapper { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
//         .node-title { font-weight: 700; font-size: 13px; color: #f8fafc; }
//         .node-subtitle { font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }

//         /* Smooth Connections */
//         .drawflow .connection .main-path { stroke: #334155; stroke-width: 2px; transition: stroke 0.3s; }
//         .drawflow .connection .main-path:hover { stroke: #3b82f6; }

//         /* Custom Scrollbar for Sidebar */
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
//       `}</style>
//     </div>
//   );
// };

// export default Workflows;
