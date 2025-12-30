import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi, type Project } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Folder,
    Calendar,
    Loader2,
    ArrowRight,
    X,
    Settings,
    MoreVertical,
    BarChart3,
    Clock
} from 'lucide-react';

export default function ProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectsApi.getAll('ml');
            setProjects(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch projects');
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreating(true);
            const newProject = await projectsApi.create({
                ...formData,
                type: 'ml'
            });
            setProjects([newProject, ...projects]);
            setIsCreateModalOpen(false);
            setFormData({ name: '', description: '' });
        } catch (err: any) {
            setError(err.message || 'Failed to create project');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-slate-400 animate-pulse">Initializing your workspace...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white mb-2">Projects</h1>
                    <p className="text-slate-400">Build, train and deploy your machine learning models.</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow text-white gap-2 h-11 px-6"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-3">
                    <X className="w-4 h-4 cursor-pointer" onClick={() => setError(null)} />
                    {error}
                </div>
            )}

            {/* Empty state */}
            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
                        <div className="relative w-24 h-24 rounded-3xl bg-glass border border-white/10 flex items-center justify-center">
                            <Folder className="w-10 h-10 text-primary" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-background">
                            <Plus className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No projects yet</h3>
                    <p className="text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
                        Create your first machine learning project to start building intelligent solutions.
                    </p>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
                    >
                        Initialize Your Workspace
                    </Button>
                </div>
            ) : (
                /* Projects Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group glass hover:bg-white/10 transition-all duration-300 overflow-hidden relative border-white/5">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <BarChart3 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{project.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 h-10">
                                        {project.description || 'Harness the power of AI to transform your raw data into actionable insights.'}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-success animate-pulse' : 'bg-slate-600'}`} />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{project.status}</span>
                                        </div>
                                        <Button variant="ghost" className="h-8 px-3 text-xs gap-2 group/btn">
                                            Open Workspace
                                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Project Modal Overlay */}
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
                            className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white">New ML Project</h2>
                                    <p className="text-xs text-slate-400">Initialize a new machine learning environment</p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProject} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 ml-1">Project Name</label>
                                    <Input
                                        placeholder="e.g., Customer Churn Analysis"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-12 text-base"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 ml-1">Description (Optional)</label>
                                    <textarea
                                        placeholder="Briefly describe the objective of this project..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full min-h-[120px] rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 h-12"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] h-12 bg-gradient-to-r from-primary to-secondary text-white font-bold"
                                        disabled={creating || !formData.name}
                                    >
                                        {creating ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating...
                                            </div>
                                        ) : 'Initialize Project'}
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
