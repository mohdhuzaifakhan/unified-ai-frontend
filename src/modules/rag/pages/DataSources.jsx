import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { dataSourcesApi } from "@/services/api";
import {
  FileText,
  UploadCloud,
  RefreshCw,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  Database
} from "lucide-react";
import clsx from "clsx";
import { useProject } from "../context/ProjectContext";

const DataSources = () => {
  const { selectedProject } = useProject();
  const [searchParams] = useSearchParams();
  const projectId = selectedProject._id;
  const [activeTab, setActiveTab] = useState("files");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchData();
    } else {
      setLoading(false);
      setError(
        "No project selected. Please select a project from the projects page."
      );
    }
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dataSourcesApi.getAll(projectId);
      setSources(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data sources:", err);
      setError("Failed to load data sources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const documents = useMemo(
    () => sources.filter((s) => s.type === "file"),
    [sources]
  );

  const apiSources = useMemo(
    () => sources.filter((s) => s.type === "api"),
    [sources]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        handleFileUpload(file);
      });
    },
    [projectId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !projectId,
  });

  const handleFileUpload = async (file) => {
    if (!projectId) return;

    const tempId = Math.random().toString();
    const tempSource = {
      _id: tempId,
      name: file.name,
      fileSize: file.size,
      createdAt: new Date().toISOString(),
      status: "uploading",
      type: "file",
    };
    setSources((prev) => [tempSource, ...prev]);

    try {
      const newSource = await dataSourcesApi.uploadFile(file, projectId);
      setSources((prev) => prev.map((s) => (s._id === tempId ? newSource : s)));
    } catch (err) {
      console.error("Upload failed:", err);
      setSources((prev) => prev.filter((s) => s._id !== tempId));
      alert(`Failed to upload ${file.name}`);
    }
  };

  const handleAddApiSource = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const config = {
      url: formData.get("url"),
      method: formData.get("method"),
      frequency: formData.get("frequency"),
    };
    const name = formData.get("name");

    try {
      const newSource = await dataSourcesApi.create({
        name,
        projectId,
        type: "api",
        config,
      });
      setSources((prev) => [newSource, ...prev]);
      e.target.reset();
    } catch (err) {
      console.error("Failed to add API source:", err);
      alert("Failed to add API source");
    }
  };

  const handleDeleteSource = async (id) => {
    if (!confirm("Are you sure you want to delete this data source?")) return;
    try {
      await dataSourcesApi.delete(id);
      setSources((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete source:", err);
      alert("Failed to delete source");
    }
  };

  if (loading && sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Loading data sources...</p>
      </div>
    );
  }

  if (error && !projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-900/50 rounded-xl border border-slate-800">
        <AlertCircle className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          No Project Selected
        </h3>
        <p className="text-slate-400 max-w-md mb-6">
          Data sources must be associated with a specific RAG project. Please
          select a project from the projects list to continue.
        </p>
        <button
          onClick={() => (window.location.href = "/rag/projects")}
          className="px-6 py-2 bg-brand-600 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all"
        >
          View Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Connect Your Data
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Upload documents or connect external sources.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-brand-600 hover:bg-blue-500 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />{" "}
          Sync All
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {["files", "cloud", "database", "api"].map((tab) => (
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
              {tab === "api" ? "API Connectors" : tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "files" && (
        <div className="space-y-8 animate-fade-in">
          <div
            {...getRootProps()}
            className={clsx(
              "p-8 rounded-xl border-dashed border-2 transition-colors cursor-pointer text-center",
              isDragActive
                ? "border-brand-500 bg-brand-500/5"
                : "border-slate-700 hover:border-brand-500/50 bg-slate-900/50",
              !projectId && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-1">
              {isDragActive ? "Drop files here" : "Upload Documents"}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Drag & drop files here, or click to browse <br />
              <span className="text-xs text-slate-500">
                Supports PDF, DOCX, TXT (Max 50MB)
              </span>
            </p>
          </div>

          <div>
            <h3 className="text-md font-semibold text-white mb-4">
              Recent Uploads
            </h3>
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
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <tr
                        key={doc._id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <FileText className="w-4 h-4 text-brand-400" />
                          <span className="text-slate-200">{doc.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          {doc.fileSize
                            ? (doc.fileSize / 1024).toFixed(1) + " KB"
                            : "--"}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={clsx(
                              "px-2 py-1 rounded-full text-xs font-medium border capitalize",
                              doc.status === "active" ||
                                doc.status === "Indexed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            )}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteSource(doc._id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No files uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-200 mb-4">
              Add API Source
            </h3>

            <form onSubmit={handleAddApiSource} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Source Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="User Data API"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Endpoint URL
                </label>
                <input
                  name="url"
                  required
                  type="url"
                  placeholder="https://api.example.com/v1"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Method
                  </label>
                  <select
                    name="method"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  >
                    <option>GET</option>
                    <option>POST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="manual">Manual</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!projectId}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Source
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-md font-semibold text-white mb-4">
              Active Connectors
            </h3>

            <div className="bg-dark-900 rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/50 text-slate-200 font-medium">
                  <tr>
                    <th className="px-6 py-3">Source Name</th>
                    <th className="px-6 py-3">Endpoint</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {apiSources.map((src) => (
                    <tr
                      key={src._id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-200">{src.name}</td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {src.config?.url || "--"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteSource(src._id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {apiSources.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No API sources connected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === "cloud" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
                className="w-8 h-8 opacity-80"
                alt="Drive"
              />
              <div className="h-2 w-2 rounded-full bg-slate-600" />
            </div>

            <h3 className="text-lg font-medium text-slate-200 mb-1">
              Google Drive
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Connect folders for auto-sync.
            </p>

            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
              Connect
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center text-white font-bold">
                S3
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <h3 className="text-lg font-medium text-slate-200 mb-1">
              Amazon S3
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Bucket: rag-production-assets
            </p>

            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
              Manage
            </button>
          </div>
        </div>
      )}

      {activeTab === "database" && (
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-12 text-center animate-fade-in">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300">
            Database Connectors
          </h3>
          <p className="text-slate-500 mt-2">
            PostgreSQL, MongoDB, and MySQL connectors coming soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataSources;
