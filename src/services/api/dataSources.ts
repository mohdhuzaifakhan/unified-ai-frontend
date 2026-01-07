import { coreApi } from "./client";

export interface DataSource {
  _id: string;
  name: string;
  description?: string;
  projectId: string;
  userId: string;
  type: "file" | "s3" | "database" | "api";
  config: Record<string, any>;
  filePath?: string;
  fileSize?: number;
  fileType?: string;
  schema: Record<string, any>;
  status: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataSourceData {
  name: string;
  description?: string;
  projectId: string;
  type: "file" | "s3" | "database" | "api";
  config: Record<string, any>;
}

export const dataSourcesApi = {
  getAll: async (projectId?: string): Promise<DataSource[]> => {
    const params = projectId ? { projectId } : {};
    const response = await coreApi.get("/data-sources", { params });
    return response.data;
  },

  getById: async (id: string): Promise<DataSource> => {
    const response = await coreApi.get(`/data-sources/${id}`);
    return response.data;
  },

  create: async (data: CreateDataSourceData): Promise<DataSource> => {
    const response = await coreApi.post("/data-sources", data);
    return response.data;
  },
  uploadFile: async (file: File, projectId: string): Promise<DataSource> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found");
    }

    const CORE_API_URL =
      import.meta.env.VITE_CORE_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${CORE_API_URL}/data-sources/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    return response.json();
  },

  uploadFileToS3: async (
    file: File,
    projectId: string
  ): Promise<DataSource> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    const CORE_API_URL =
      import.meta.env.VITE_CORE_API_URL || "http://localhost:3001/api";

    const cleanFileName = file.name.replace(/[^a-z0-9.]/gi, "_");
    const presignRes = await fetch(`${CORE_API_URL}/files/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: `${cleanFileName}`,
        mimeType: file.type,
      }),
    });

    if (!presignRes.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const { uploadUrl, key } = await presignRes.json();
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("S3 upload failed");
    }

    const saveRes = await fetch(`${CORE_API_URL}/data-sources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        name: cleanFileName,
        type: "file",
        config: {
          s3Key: key,
          mimeType: file.type,
          size: file.size,
        },
      }),
    });

    if (!saveRes.ok) {
      const errorText = await saveRes.text();
      throw new Error(`Metadata save failed: ${errorText}`);
    }

    return saveRes.json();
  },
  update: async (
    id: string,
    data: Partial<CreateDataSourceData>
  ): Promise<DataSource> => {
    const response = await coreApi.patch(`/data-sources/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await coreApi.delete(`/data-sources/${id}`);
  },

  getPreview: async (id: string): Promise<any[]> => {
    const response = await coreApi.get(`/data-sources/${id}/preview`);
    return response.data;
  },
};
