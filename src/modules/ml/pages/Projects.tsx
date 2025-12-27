import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi, type Project } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Folder, Calendar } from 'lucide-react';

export default function ProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectsApi.getAll();
            setProjects(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch projects');
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        try {
            const newProject = await projectsApi.create({
                name: 'New Project',
                description: 'Project description',
            });
            setProjects([newProject, ...projects]);
        } catch (err: any) {
            alert('Failed to create project: ' + (err.message || 'Unknown error'));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading projects...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-gray-600 mt-1">Manage your ML projects</p>
                </div>
                <Button onClick={handleCreateProject} className="flex items-center gap-2">
                    <Plus size={20} />
                    New Project
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project._id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Folder className="text-blue-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">{project.description || 'No description'}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-3">
                                    <span className={`px-2 py-1 rounded text-xs ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {projects.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Folder size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-4">Create your first project to get started</p>
                    <Button onClick={handleCreateProject}>Create Project</Button>
                </div>
            )}
        </div>
    );
}
