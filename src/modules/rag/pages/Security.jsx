import { useState } from 'react';
import { Shield, Key, Lock, Copy, EyeOff, Plus, RefreshCw, Trash2 } from 'lucide-react';

const Security = () => {
    const [keys, setKeys] = useState([
        { id: 'row-prod-1', name: 'Production Key', prefix: 'sk_rag_...8f92a', created: 'Oct 24, 2023', lastUsed: 'Just now' }
    ]);

    const generateKey = () => {
        const newKey = {
            id: `key-${Date.now()}`,
            name: 'New Dev Key',
            prefix: `sk_rag_${Math.random().toString(36).substring(7)}...`,
            created: 'Just now',
            lastUsed: 'Never'
        };
        setKeys([newKey, ...keys]);
    };

    const revokeKey = (id) => {
        if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            setKeys(keys.filter(k => k.id !== id));
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">API Access & Security</h2>
                    <p className="text-slate-400">Manage API keys and access control for your RAG instance.</p>
                </div>
            </div>

            {/* API Keys Section */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Active API Keys</h3>
                    <button onClick={generateKey} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/20">
                        <Plus className="w-4 h-4" /> Generate New Key
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800/50 text-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Key Name</th>
                                <th className="px-6 py-3 font-medium">Key Preview</th>
                                <th className="px-6 py-3 font-medium">Created Check</th>
                                <th className="px-6 py-3 font-medium">Last Used</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {keys.map(key => (
                                <tr key={key.id} className="hover:bg-slate-800/30 transition-colors animate-fade-in">
                                    <td className="px-6 py-4 font-medium text-white">{key.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{key.prefix}</td>
                                    <td className="px-6 py-4">{key.created}</td>
                                    <td className="px-6 py-4 text-emerald-400">{key.lastUsed}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => revokeKey(key.id)} className="text-slate-400 hover:text-red-400 transition-colors">Revoke</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Advanced Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4 text-white">
                        <Shield className="w-5 h-5 text-brand-400" />
                        <h3 className="text-lg font-semibold">IP Whitelisting</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">Restrict API access to specific IP addresses or CIDR blocks.</p>
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
                        <h3 className="text-lg font-semibold">PII Detection (Data Loss Prevention)</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">Automatically detect and redact sensitive info in documents.</p>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-brand-600 bg-slate-700 focus:ring-brand-500" defaultChecked />
                            <span className="text-sm text-slate-200">Redact Email Addresses</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-brand-600 bg-slate-700 focus:ring-brand-500" />
                            <span className="text-sm text-slate-200">Redact Credit Card Numbers</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
