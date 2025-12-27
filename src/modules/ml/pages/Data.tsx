import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataSourcesApi, type DataSource } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Upload, FileText, Calendar } from 'lucide-react';

export default function DataPage() {
  const { user } = useAuth();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      setLoading(true);
      const data = await dataSourcesApi.getAll();
      setDataSources(data);
    } catch (err) {
      console.error('Error fetching data sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get first project ID or create a default one
    const projectId = '000000000000000000000000'; // You should get this from context or props

    try {
      setUploading(true);
      const newDataSource = await dataSourcesApi.uploadFile(file, projectId);
      setDataSources([newDataSource, ...dataSources]);
      alert('File uploaded successfully!');
    } catch (err: any) {
      alert('Failed to upload file: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading data sources...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Data Sources</h1>
          <p className="text-gray-600 mt-1">Manage your datasets</p>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv,.xlsx,.json"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button as="span" className="flex items-center gap-2 cursor-pointer" disabled={uploading}>
              <Upload size={20} />
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map((dataSource) => (
          <Card key={dataSource._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                {dataSource.type === 'file' ? (
                  <FileText className="text-green-600" size={24} />
                ) : (
                  <Database className="text-green-600" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{dataSource.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{dataSource.description || 'No description'}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{dataSource.type}</span>
                  </div>
                  {dataSource.fileSize && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{formatFileSize(dataSource.fileSize)}</span>
                    </div>
                  )}
                  {dataSource.schema?.columns && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Columns:</span>
                      <span className="font-medium">{dataSource.schema.columns.length}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar size={14} />
                  <span>{new Date(dataSource.createdAt).toLocaleDateString()}</span>
                </div>

                <div>
                  <span className={`px-2 py-1 rounded text-xs ${dataSource.status === 'active' ? 'bg-green-100 text-green-700' :
                      dataSource.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {dataSource.status}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {dataSources.length === 0 && (
        <div className="text-center py-12">
          <Database size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No data sources yet</h3>
          <p className="text-gray-600 mb-4">Upload your first dataset to get started</p>
        </div>
      )}
    </div>
  );
}
