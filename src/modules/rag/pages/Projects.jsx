import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsApi } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Loader2,
  ArrowRight,
  X,
  MoreVertical,
  Database,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";

export default function RAGProjectsPage() {
  const { user } = useAuth();
  const { projects, createProject, updateProject, loading, creating, error, selectedProject, selectProject } =
    useProject();
  const [editingProject, setEditingProject] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();

    let success = false;

    if (editingProject) {
      success = await updateProject(editingProject._id, formData);
    } else {
      success = await createProject(formData);
    }

    if (success) {
      setIsCreateModalOpen(false);
      setEditingProject(null);
      setFormData({ name: "", description: "" });
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsCreateModalOpen(true);
    setFormData({
      name: project.name,
      description: project.description || "",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">
          Initializing your RAG workspace...
        </p>
      </div>
    );
  }

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await projectsApi.delete(project._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">RAG Projects</h1>
          <p className="text-slate-400">
            Manage your knowledge bases and AI agents.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-brand-600 hover:bg-blue-500 bg-blue-600 text-white gap-2 h-11 px-6 shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          New RAG Project
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
          <X
            className="w-4 h-4 cursor-pointer"
            onClick={() => setError(null)}
          />
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-brand-500/20 blur-[60px] rounded-full" />
            <div className="relative w-24 h-24 rounded-3xl bg-slate-900/50 border border-white/10 flex items-center justify-center">
              <Database className="w-10 h-10 text-brand-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center border-2 border-slate-900">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            No RAG projects yet
          </h3>
          <p className="text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
            Create your first RAG project to start building powerful
            knowledge-based AI solutions.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            Initialize Your Workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => selectProject(project._id)}
              className="cursor-pointer"
            >
              <Card className={`group transition-all duration-300 overflow-hidden relative ${selectedProject?._id === project._id
                ? "bg-slate-800/80 border-blue-500 shadow-lg shadow-blue-500/20"
                : "bg-slate-900/50 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700"
                }`}>
                <CardContent className="py-4 px-3">
                  <div className="flex items-start gap-3 mb-3">
                    <Database className={`w-7 h-7 shrink-0 ${selectedProject?._id === project._id ? "text-blue-400" : "text-brand-400"
                      }`} />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm truncate transition-colors ${selectedProject?._id === project._id
                        ? "text-blue-400"
                        : "text-white group-hover:text-brand-400"
                        }`}>
                        {project.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 hover:bg-slate-800 text-slate-400 hover:text-blue-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(project);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 hover:bg-slate-800 text-slate-400 hover:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] mb-3">
                    {project.description?.trim()
                      ? project.description
                      : "Build intelligent agents with your own data sources."}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${project.status === "active"
                          ? "bg-emerald-500"
                          : "bg-slate-600"
                          }`}
                      />
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        {project.status}
                      </span>
                    </div>

                    {selectedProject?._id === project._id && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Selected
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

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
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingProject ? "Update RAG Project" : "New RAG Project"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Initialize a new RAG workspace
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingProject(null);
                    setFormData({ name: "", description: "" });
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 ml-1">
                    Project Name
                  </label>
                  <Input
                    placeholder="e.g., Customer Support Knowledge Base"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-brand-500"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 ml-1">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Briefly describe the objective of this project..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full min-h-[120px] rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1  bg-red-600 hover:bg-red-700 border-0"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 border-0"
                    disabled={creating || !formData.name}
                  >
                    {creating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingProject ? "Updating..." : "Initializing..."}
                      </div>
                    ) : editingProject ? (
                      "Update Project"
                    ) : (
                      "Initialize Project"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
