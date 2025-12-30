import { Code2, MessageSquare, Copy, Webhook, Book } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Integration = () => {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const userApiKey = "userkey";
  const projectId = "projectkey";
  const handleCopy = (id) => {
    const text = document.getElementById(id)?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success("Snippet copied.");
    }
  };

  const injectWidgetScript = () => {
    if (document.getElementById("rag-widget-script")) {
      const launcher = document.getElementById("rag-launcher");
      if (launcher) {
        launcher.click();
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "rag-widget-script";
    script.textContent = `
          (function () {
            const CONFIG = {
              apiBase: window.location.origin.includes("5000")
                ? window.location.origin
                : "http://localhost:3002",
              theme: {
                primary: "#0ea5e9",
                secondary: "#0284c7",
                bg: "#0f172a",
                panel: "#1e293b",
                text: "#f1f5f9",
                userMsg: "#0ea5e9",
                botMsg: "#334155",
              },
            };

            const ICONS = {
              sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
              send: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
              close: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
              msg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            };

            const STYLES = \`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

              #rag-widget-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 2147483647;
                font-family: 'Inter', system-ui, sans-serif;
                -webkit-font-smoothing: antialiased;
              }

              #rag-launcher {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: linear-gradient(135deg, \${CONFIG.theme.primary}, \${CONFIG.theme.secondary});
                box-shadow: 0 8px 32px rgba(14, 165, 233, 0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                color: white;
                border: 1px solid rgba(255,255,255,0.1);
              }
              #rag-launcher:hover {
                transform: scale(1.1) rotate(-5deg);
                box-shadow: 0 12px 40px rgba(14, 165, 233, 0.5);
              }
              #rag-launcher.hidden {
                transform: scale(0) rotate(180deg);
                opacity: 0;
                pointer-events: none;
              }

              #rag-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 400px;
                height: 700px;
                max-height: calc(100vh - 120px);
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.6);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform-origin: bottom right;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                opacity: 0;
                transform: scale(0.9) translateY(20px);
                pointer-events: none;
              }
              #rag-window.open {
                opacity: 1;
                transform: scale(1) translateY(0);
                pointer-events: all;
              }

              .rag-header {
                padding: 20px;
                background: linear-gradient(to right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .rag-brand {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .rag-logo {
                width: 32px;
                height: 32px;
                background: rgba(14, 165, 233, 0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: \${CONFIG.theme.primary};
              }
              .rag-title {
                margin: 0;
                color: white;
                font-size: 16px;
                font-weight: 600;
              }
              .rag-status {
                font-size: 12px;
                color: #94a3b8;
                display: block;
              }
              .rag-close {
                background: transparent;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.2s;
                display: flex;
              }
              .rag-close:hover {
                background: rgba(255,255,255,0.05);
                color: white;
              }

              .rag-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 20px;
                scroll-behavior: smooth;
              }
              
              .rag-messages::-webkit-scrollbar { width: 6px; }
              .rag-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
              
              .rag-msg-group {
                display: flex;
                gap: 12px;
                max-width: 85%;
              }
              .rag-msg-group.user {
                align-self: flex-end;
                flex-direction: row-reverse;
              }
              
              .rag-avatar {
                width: 32px;
                height: 32px;
                border-radius: 12px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
              }
              .rag-avatar.bot { background: linear-gradient(135deg, #38bdf8, #0284c7); color: white; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); }
              .rag-avatar.user { background: #334155; color: #cbd5e1; }

              .rag-bubble {
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
                color: \${CONFIG.theme.text};
                position: relative;
                background: \${CONFIG.theme.botMsg};
                border: 1px solid rgba(255,255,255,0.05);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .rag-msg-group.user .rag-bubble {
                background: \${CONFIG.theme.userMsg};
                color: white;
                border-color: rgba(255,255,255,0.1);
                border-top-right-radius: 4px;
              }
              .rag-msg-group.bot .rag-bubble {
                border-top-left-radius: 4px;
              }

              .typing-dots {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                background: rgba(30, 41, 59, 0.5);
                border-radius: 16px;
                border-top-left-radius: 4px;
                width: fit-content;
              }
              .dot {
                width: 8px;
                height: 8px;
                background: #94a3b8;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out both;
              }
              .dot:nth-child(1) { animation-delay: -0.32s; }
              .dot:nth-child(2) { animation-delay: -0.16s; }
              
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }

              .rag-footer {
                padding: 16px;
                background: rgba(15, 23, 42, 0.95);
                border-top: 1px solid rgba(255, 255, 255, 0.08);
              }
              .rag-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
              }
              #rag-input {
                width: 100%;
                padding: 14px 48px 14px 16px;
                background: rgba(30, 41, 59, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                font-size: 14px;
                outline: none;
                transition: all 0.2s;
              }
              #rag-input:focus {
                background: rgba(30, 41, 59, 0.8);
                border-color: \${CONFIG.theme.primary};
                box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
              }
              #rag-send {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: \${CONFIG.theme.primary};
                color: white;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
              }
              #rag-send:hover {
                background: \${CONFIG.theme.secondary};
              }
              #rag-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: #475569;
              }
              
              .rag-footer-text {
                text-align: center;
                font-size: 11px;
                color: #64748b;
                margin-top: 8px;
              }
            \`;

            function init() {
              const styleSheet = document.createElement("style");
              styleSheet.innerText = STYLES;
              document.head.appendChild(styleSheet);

              const container = document.createElement("div");
              container.id = "rag-widget-container";
              container.innerHTML = \`
                <div id="rag-window">
                  <div class="rag-header">
                    <div class="rag-brand">
                      <div class="rag-logo">\${ICONS.sparkles}</div>
                      <div>
                        <h3 class="rag-title">RAG Assistant</h3>
                        <span class="rag-status">Powered by Gemini</span>
                      </div>
                    </div>
                    <button class="rag-close">\${ICONS.close}</button>
                  </div>
                  
                  <div class="rag-messages" id="rag-messages">
                    <div class="rag-msg-group bot">
                      <div class="rag-avatar bot">AI</div>
                      <div class="rag-bubble">
                        Hello! I've read your documents. Ask me anything about them!
                      </div>
                    </div>
                  </div>

                  <div class="rag-footer">
                    <div class="rag-input-wrapper">
                      <input type="text" id="rag-input" placeholder="Type your question..." autocomplete="off">
                      <button id="rag-send">\${ICONS.send}</button>
                    </div>
                    <div class="rag-footer-text">Powered by RAG Cloud</div>
                  </div>
                </div>
                
                <div id="rag-launcher">
                  \${ICONS.msg}
                </div>
              \`;
              document.body.appendChild(container);

              const launcher = document.getElementById("rag-launcher");
              const windowEl = document.getElementById("rag-window");
              const closeBtn = document.querySelector(".rag-close");
              const input = document.getElementById("rag-input");
              const sendBtn = document.getElementById("rag-send");
              const messages = document.getElementById("rag-messages");

              function toggle(open) {
                if (open) {
                  windowEl.classList.add("open");
                  launcher.classList.add("hidden");
                  setTimeout(() => input.focus(), 300);
                } else {
                  windowEl.classList.remove("open");
                  launcher.classList.remove("hidden");
                }
              }

              launcher.onclick = () => toggle(true);
              closeBtn.onclick = () => toggle(false);

              function addMessage(text, role) {
                const div = document.createElement("div");
                div.className = \`rag-msg-group \${role}\`;

                const avatar = role === "bot" ? "AI" : "You";
                const html = \`
                  <div class="rag-avatar \${role}">\${avatar}</div>
                  <div class="rag-bubble">\${formatMarkdown(text)}</div>
                \`;
                div.innerHTML = html;
                messages.appendChild(div);
                messages.scrollTop = messages.scrollHeight;
              }

              let typingEl = null;
              function showTyping() {
                if (typingEl) return;
                typingEl = document.createElement("div");
                typingEl.className = "rag-msg-group bot";
                typingEl.innerHTML = \`
                  <div class="rag-avatar bot">AI</div>
                  <div class="typing-dots">
                    <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                  </div>
                \`;
                messages.appendChild(typingEl);
                messages.scrollTop = messages.scrollHeight;
              }
              function hideTyping() {
                if (typingEl) typingEl.remove();
                typingEl = null;
              }

              async function send() {
                const text = input.value.trim();
                if (!text) return;

                input.value = "";
                input.disabled = true;
                sendBtn.disabled = true;

                addMessage(text, "user");
                showTyping();

                try {
                  const res = await fetch(\`\${CONFIG.apiBase}/api/chat\`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text }),
                  });
                  const data = await res.json();
                  hideTyping();

                  if (data.content) {
                    addMessage(data.content, "bot");
                  } else {
                    addMessage("Something went wrong.", "bot");
                  }
                } catch (e) {
                  hideTyping();
                  addMessage("Network Error: " + e.message, "bot");
                } finally {
                  input.disabled = false;
                  sendBtn.disabled = false;
                  input.focus();
                }
              }

              sendBtn.onclick = send;
              input.onkeypress = (e) => {
                if (e.key === "Enter") send();
              };

              function formatMarkdown(text) {
                return text
                  .replace(/\\*\\*(.*?)\\*\\*/g, "<b>$1</b>")
                  .replace(/\\*(.*?)\\*/g, "<i>$1</i>")
                  .replace(/\\n/g, "<br>");
              }
            }

            if (document.readyState === "complete") init();
            else window.addEventListener("load", init);
          })();
        `;
    document.body.appendChild(script);

    setTimeout(() => {
      setWidgetLoaded(true);
      const launcher = document.getElementById("rag-launcher");
      if (launcher) {
        launcher.click();
      }
      toast.success("Widget loaded! Check bottom right corner.");
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Embed & Integrate
          </h2>
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
              Copy the snippet below and paste it into the{" "}
              <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200 text-xs font-mono">
                &lt;body&gt;
              </code>{" "}
              of your application. The widget is pre-configured with your
              project settings.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">
              Live Preview
            </p>
            <div
              className="flex group justify-end cursor-pointer"
              onClick={injectWidgetScript}
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-brand-500/40 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
            {widgetLoaded && (
              <p className="text-xs text-green-400 mt-2">✓ Widget Active</p>
            )}
          </div>
        </div>

        <div className="relative group z-10">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleCopy("embed-code")}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium transition-colors"
            >
              <Copy className="w-3 h-3" /> Copy to Clipboard
            </button>
          </div>
          <pre
            className="bg-slate-950/80 backdrop-blur rounded-xl p-6 overflow-x-auto border border-slate-800 text-sm font-mono text-slate-300 shadow-2xl"
            id="embed-code"
          >
            {`<!-- RAG Service Widget -->
<script src="http://localhost:3002/widget.js"></script>
<script>
  window.RAG_CONFIG = {
    apiKey: "${userApiKey}",
    projectId: "${projectId}",
    apiBase: "http://localhost:3002"
  };
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
          <p className="text-sm text-slate-400 mb-4">
            Build your own UI using our endpoints.
          </p>
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
          <p className="text-sm text-slate-400 mb-4">
            Read the full integration guide.
          </p>
          <a
            href="#"
            className="text-brand-400 text-sm font-medium hover:underline"
          >
            View Docs &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default Integration;
