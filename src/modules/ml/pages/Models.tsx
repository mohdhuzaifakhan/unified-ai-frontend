import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { modelsApi, type Model } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Brain, TrendingUp, Calendar, Download } from 'lucide-react';

export default function ModelsPage() {
    const { user } = useAuth();
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            setLoading(true);
            const data = await modelsApi.getAll();
            setModels(data);
        } catch (err) {
            console.error('Error fetching models:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (modelId: string, modelName: string) => {
        try {
            const blob = await modelsApi.download(modelId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${modelName}.joblib`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert('Failed to download model');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading models...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Models</h1>
                <p className="text-gray-600 mt-1">View and manage your trained models</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model) => (
                    <Card key={model._id} className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Brain className="text-purple-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">{model.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Algorithm:</span>
                                        <span className="font-medium">{model.algorithm}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Type:</span>
                                        <span className="font-medium capitalize">{model.type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Version:</span>
                                        <span className="font-medium">{model.version}</span>
                                    </div>
                                </div>

                                {model.metrics && Object.keys(model.metrics).length > 0 && (
                                    <div className="bg-gray-50 rounded p-3 mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp size={16} className="text-green-600" />
                                            <span className="font-medium text-sm">Metrics</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(model.metrics).slice(0, 4).map(([key, value]) => (
                                                <div key={key} className="text-xs">
                                                    <span className="text-gray-600">{key}:</span>
                                                    <span className="font-medium ml-1">
                                                        {typeof value === 'number' ? value.toFixed(3) : value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={14} />
                                        <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(model._id, model.name)}
                                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                </div>

                                <div className="mt-3">
                                    <span className={`px-2 py-1 rounded text-xs ${model.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        model.status === 'training' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {model.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {models.length === 0 && (
                <div className="text-center py-12">
                    <Brain size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No models yet</h3>
                    <p className="text-gray-600">Train your first model to get started</p>
                </div>
            )}
        </div>
    );
}
