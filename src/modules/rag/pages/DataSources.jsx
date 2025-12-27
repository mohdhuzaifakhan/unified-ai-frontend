import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
    FileText, UploadCloud, RefreshCw, MoreHorizontal,
    Trash2, Plus, Copy, Check
} from 'lucide-react';
import clsx from 'clsx';

const DataSources = () => {
    const [activeTab, setActiveTab] = useState('files');
    const [documents, setDocuments] = useState([]);
    const [apiSources, setApiSources] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Mock data for now, or fetch from existing endpoints if available
            // The Flask app renders documents into the template, so we need an API endpoint for it.
            // Assuming GET /api/documents exists or we need to create it.
            // For now, I'll use placeholders or try to fetch from a generic endpoint.

            // Let's assume we implement GET /api/documents in backend next step.
            // For now, empty or mock.
            setDocuments([
                { filename: 'q4_financial_report.pdf', size: 2400000, upload_date: '2024-03-15', status: 'Indexed' },
                { filename: 'employee_handbook_v2.docx', size: 1200000, upload_date: '2024-03-10', status: 'Processing' }
            ]);

            const configRes = await axios.get('/api/config');
            setApiSources(configRes.data.api_sources || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Dropzone handling
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach(file => {
            uploadFile(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Optimistic UI
        const tempDoc = {
            filename: file.name,
            size: file.size,
            upload_date: new Date().toISOString().split('T')[0],
            status: 'Uploading...'
        };
        setDocuments(prev => [tempDoc, ...prev]);

        try {
            await axios.post('/api/upload', formData);
            // Reload on success
            fetchData(); // Or just update status
            setDocuments(prev => prev.map(d => d.filename === file.name ? { ...d, status: 'Indexed' } : d));
        } catch (err) {
            console.error(err);
            setDocuments(prev => prev.filter(d => d.filename !== file.name));
            alert("Upload failed");
        }
    };

    // API Source Handling
    const handleAddApiSource = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newSource = Object.fromEntries(formData.entries());

        try {
            const updatedSources = [...apiSources, newSource];
            await axios.post('/api/config', { api_sources: updatedSources });
            setApiSources(updatedSources);
            e.target.reset();
            alert('API Source Added');
        } catch (err) {
            alert('Failed to add API source');
        }
    };

    const handleDeleteApiSource = async (index) => {
        if (!confirm("Are you sure?")) return;
        try {
            const updatedSources = apiSources.filter((_, i) => i !== index);
            await axios.post('/api/config', { api_sources: updatedSources });
            setApiSources(updatedSources);
        } catch (err) {
            alert('Failed to delete source');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect Your Data</h2>
                    <p className="text-slate-400">Upload documents or connect external sources.</p>
                </div>
                <button onClick={fetchData} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
                    <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} /> Sync All
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700">
                <nav className="flex space-x-8">
                    {['files', 'cloud', 'database', 'api'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors",
                                activeTab === tab
                                    ? "border-brand-500 text-brand-400"
                                    : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
                            )}
                        >
                            {tab === 'api' ? 'API Connectors' : tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Files Tab */}
            {activeTab === 'files' && (
                <div className="space-y-8 animate-fade-in">
                    <div {...getRootProps()} className={clsx(
                        "p-8 rounded-xl border-dashed border-2 transition-colors cursor-pointer text-center",
                        isDragActive ? "border-brand-500 bg-brand-500/5" : "border-slate-700 hover:border-brand-500/50 bg-slate-900/50"
                    )}>
                        <input {...getInputProps()} />
                        <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UploadCloud className="w-8 h-8 text-brand-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-200 mb-1">
                            {isDragActive ? "Drop files here" : "Upload Documents"}
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Drag & drop files here, or click to browse <br />
                            <span className="text-xs text-slate-500">Supports PDF, DOCX, TXT (Max 50MB)</span>
                        </p>
                    </div>

                    <div>
                        <h3 className="text-md font-semibold text-white mb-4">Recent Uploads</h3>
                        <div className="bg-dark-900 rounded-lg border border-slate-800 overflow-hidden">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800/50 text-slate-200 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Filename</th>
                                        <th className="px-6 py-3">Size</th>
                                        <th className="px-6 py-3">Uploaded</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {documents.length > 0 ? documents.map((doc, i) => (
                                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-brand-400" />
                                                <span className="text-slate-200">{doc.filename}</span>
                                            </td>
                                            <td className="px-6 py-4">{(doc.size / 1024).toFixed(1)} KB</td>
                                            <td className="px-6 py-4">{doc.upload_date}</td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "px-2 py-1 rounded-full text-xs font-medium border",
                                                    doc.status === 'Indexed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                )}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-500 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No files uploaded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* API Tab */}
            {activeTab === 'api' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    {/* Add Form */}
                    <div className="lg:col-span-1 p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl h-fit">
                        <h3 className="text-lg font-bold text-white mb-4">Add API Source</h3>
                        <form onSubmit={handleAddApiSource} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Source Name</label>
                                <input name="name" required placeholder="User Data API" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Endpoint URL</label>
                                <input name="url" required type="url" placeholder="https://api.example.com/v1" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Method</label>
                                    <select name="method" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none">
                                        <option>GET</option>
                                        <option>POST</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Frequency</label>
                                    <select name="frequency" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none">
                                        <option value="manual">Manual</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Source
                            </button>
                        </form>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2">
                        <h3 className="text-md font-semibold text-white mb-4">Active Connectors</h3>
                        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800/50 text-slate-200 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Source Name</th>
                                        <th className="px-6 py-3">Endpoint</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {apiSources.map((src, i) => (
                                        <tr key={i} className="hover:bg-slate-800/30">
                                            <td className="px-6 py-4 font-medium text-slate-200">{src.name}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{src.url}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteApiSource(i)} className="text-rose-400 hover:text-rose-300 text-xs font-medium">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {apiSources.length === 0 && (
                                        <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">No API sources connected.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholders for other tabs */}
            {(activeTab === 'cloud' || activeTab === 'database') && (
                <div className="p-12 text-center border border-slate-800 rounded-xl bg-slate-900/50">
                    <p className="text-slate-400">This connector type is coming soon.</p>
                </div>
            )}

        </div>
    );
};

export default DataSources;
