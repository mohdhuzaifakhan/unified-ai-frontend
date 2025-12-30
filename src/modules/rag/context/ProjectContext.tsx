import { createContext, useContext, useState, useEffect } from "react";
import { projectsApi } from "@/services/api";

type ProjectContextType = {
  projects: any[];
  selectedProject: any;
  selectProject: (projectId: string) => void;
  fetchProjects: () => Promise<void>;
  createProject: (formData: any) => Promise<boolean>;
  updateProject: (id, formData: any) => Promise<boolean>;
  loading: boolean;
  creating: boolean;
  error: any;
};

const ProjectContextDefaultValue: ProjectContextType = {
  projects: [],
  selectedProject: null,
  selectProject: () => {},
  fetchProjects: async () => {},
  createProject: async () => false,
  updateProject: async () => false,
  loading: false,
  creating: false,
  error: null,
};

const ProjectContext = createContext<ProjectContextType>(
  ProjectContextDefaultValue
);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll("rag");
      setProjects(data);

      if (data.length > 0) {
        setSelectedProject(data[0]);
      }

      setError(null);
    } catch (err: any) {
      setError((err.message as any) || "Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (formData) => {
    try {
      setCreating(true);
      const newProject = await projectsApi.create({
        ...formData,
        type: "rag",
      });

      setProjects((prev) => [newProject, ...prev]);
      setSelectedProject(newProject);
      setError(null);
      return true;
    } catch (err: any) {
      console.log("err:", err);
      setError(err.message || "Failed to create project");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateProject = async (id, formData) => {
    try {
      setCreating(true);

      const updatedProject = await projectsApi.update(id, formData);
      
      setProjects((prev) =>
        prev.map((project) => (project._id === id ? updatedProject : project))
      );

      setError(null);
      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to update project");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const selectProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        selectProject,
        fetchProjects,
        createProject,
        updateProject,
        loading,
        creating,
        error,
      }}
    >
      {!loading && children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
