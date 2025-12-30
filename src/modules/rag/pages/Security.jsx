import { useEffect, useState } from "react";
import { Shield, Plus, EyeOff, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useProject } from "../context/ProjectContext";
import { apiKeysApi } from "@/services/api/apiKeysApi";
import { toast } from "react-hot-toast";
import { Copy, Trash2, Key, AlertTriangle } from "lucide-react";

const Security = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dKey, setDKey] = useState(null);

  const { projects } = useProject();

  const [formData, setFormData] = useState({
    apiKeyName: "",
    projectName: "",
    projectId: "",
    domains: "",
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const data = await apiKeysApi.getKeys();
      console.log("DATA:", data);
      setKeys(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const project = projects.find((p) => p.name === formData.projectName);
      const payload = {
        apiKeyName: formData.apiKeyName,
        projectName: project.name,
        projectId: project._id,
        domains: formData.domains
          ?.split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      };

      const createdKey = await apiKeysApi.createKey(payload);
      console.log("KEY:", createdKey)
      setKeys((prev) => [createdKey, ...prev]);
      setIsCreateModalOpen(false);

      setFormData({
        apiKeyName: "",
        projectId: "",
        domains: "",
      });
    } catch (err) {
      toast.success("Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  const openDeleteModal = (key) => {
    setDKey(key);
  };

  const deleteApiKey = async () => {
    if (!dKey) return;

    try {
      setLoading(true);
      await apiKeysApi.deleteKey(dKey._id);
      setKeys((prev) => prev.filter((k) => k._id !== dKey._id));
      toast.success("API key revoked");
      setDKey(null);
    } catch {
      toast.error("Failed to revoke API key");
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Failed to copy API key");
    }
  };

  console.log("KEYS:", keys)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            API Access & Security
          </h2>
          <p className="text-slate-400">
            Manage API keys and access control for your RAG instance.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Active API Keys</h3>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate New Key
          </button>
        </div>

        <table className="w-full text-sm text-slate-400">
          <thead className="bg-slate-800/50 text-slate-200">
            <tr>
              <th className="px-6 py-3 text-left flex items-center gap-2">
                <Key className="w-4 h-4 text-brand-400" />
                API Key Name
              </th>
              <th className="px-6 py-3 text-left">Key</th>
              <th className="px-6 py-3 text-left">Project</th>
              <th className="px-6 py-3 text-left">Domains</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {keys.map((key) => (
              <tr key={key.id} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 text-white font-medium">
                  {key.apiKeyName}
                </td>

                <td className="px-6 py-4 font-mono text-xs text-slate-300">
                  {key.prefix}
                </td>

                <td className="px-6 py-4">{key.projectName}</td>

                <td className="px-6 py-4 text-xs">
                  {key.domains?.join(", ") || "-"}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => copyApiKey(key.prefix)}
                      className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openDeleteModal(key)}
                      className="p-2 rounded-md hover:bg-red-500/10 text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4 text-white">
            <Shield className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-semibold">IP Whitelisting</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Restrict API access to specific IP addresses or CIDR blocks.
          </p>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm font-mono focus:outline-none focus:border-brand-500"
            rows="3"
            placeholder="192.168.1.1&#10;10.0.0.0/24"
          ></textarea>
          <button className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
            Save Whitelist
          </button>
        </div>

        <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4 text-white">
            <EyeOff className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold">
              PII Detection (Data Loss Prevention)
            </h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Automatically detect and redact sensitive info in documents.
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-600 text-brand-600 bg-slate-700 focus:ring-brand-500"
                defaultChecked
              />
              <span className="text-sm text-slate-200">
                Redact Email Addresses
              </span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-600 text-brand-600 bg-slate-700 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-200">
                Redact Credit Card Numbers
              </span>
            </label>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dKey && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteKey(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Revoke API Key</h2>
                <p className="text-sm text-slate-400 mt-1">
                  This action cannot be undone.
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 font-mono">
                  {dKey.apiKeyName}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setDKey(null);
                      setIsCreateModalOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteApiKey}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-60"
                  >
                    Revoke Key
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Create API Key
                  </h2>
                  <p className="text-xs text-slate-400">
                    Create new api key for project
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateKey} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 ml-1">
                    Project Name
                  </label>
                  <Input
                    placeholder="API Key Name"
                    value={formData.apiKeyName}
                    onChange={(e) =>
                      setFormData({ ...formData, apiKeyName: e.target.value })
                    }
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-brand-500"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 ml-1">
                    Select Project
                  </label>

                  <select
                    value={formData.projectName}
                    onChange={(e) =>
                      setFormData({ ...formData, projectName: e.target.value })
                    }
                    className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:border-brand-500 transition-all"
                    required
                  >
                    <option value="" disabled className="text-slate-600">
                      Select Project
                    </option>

                    {projects.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        className="bg-slate-900 text-white"
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 ml-1 focus:border-brand-500">
                    Domain names (comma separated)
                  </label>
                  <textarea
                    placeholder="Allowed domains (comma separated)"
                    value={formData.domains}
                    onChange={(e) =>
                      setFormData({ ...formData, domains: e.target.value })
                    }
                    className="w-full min-h-[120px] rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                >
                  {creating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create API Key"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Security;
