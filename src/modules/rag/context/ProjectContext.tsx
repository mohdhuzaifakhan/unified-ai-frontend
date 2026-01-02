// import { createContext, useContext, useState, useEffect } from "react";
// import { projectsApi } from "@/services/api";

// type ProjectContextType = {
//   projects: any[];
//   selectedProject: any;
//   selectProject: (projectId: string) => void;
//   fetchProjects: () => Promise<void>;
//   createProject: (formData: any) => Promise<boolean>;
//   updateProject: (id, formData: any) => Promise<boolean>;
//   loading: boolean;
//   creating: boolean;
//   error: any;
// };

// const ProjectContextDefaultValue: ProjectContextType = {
//   projects: [],
//   selectedProject: null,
//   selectProject: () => {},
//   fetchProjects: async () => {},
//   createProject: async () => false,
//   updateProject: async () => false,
//   loading: false,
//   creating: false,
//   error: null,
// };

// const ProjectContext = createContext<ProjectContextType>(
//   ProjectContextDefaultValue
// );

// export const ProjectProvider = ({ children }) => {
//   const [projects, setProjects] = useState<any[]>([]);
//   const [selectedProject, setSelectedProject] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [error, setError] = useState<any>(null);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const data = await projectsApi.getAll("rag");
//       setProjects(data);

//       if (data.length > 0) {
//         setSelectedProject(data[0]);
//       }

//       setError(null);
//     } catch (err: any) {
//       setError((err.message as any) || "Failed to fetch projects");
//       console.error("Error fetching projects:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createProject = async (formData) => {
//     try {
//       setCreating(true);
//       const newProject = await projectsApi.create({
//         ...formData,
//         type: "rag",
//       });

//       setProjects((prev) => [newProject, ...prev]);
//       setSelectedProject(newProject);
//       setError(null);
//       return true;
//     } catch (err: any) {
//       console.log("err:", err);
//       setError(err.message || "Failed to create project");
//       return false;
//     } finally {
//       setCreating(false);
//     }
//   };

//   const updateProject = async (id, formData) => {
//     try {
//       setCreating(true);

//       const updatedProject = await projectsApi.update(id, formData);

//       setProjects((prev) =>
//         prev.map((project) => (project._id === id ? updatedProject : project))
//       );

//       setError(null);
//       return true;
//     } catch (err: any) {
//       setError(err?.message || "Failed to update project");
//       return false;
//     } finally {
//       setCreating(false);
//     }
//   };

//   const selectProject = (projectId) => {
//     const project = projects.find((p) => p.id === projectId);
//     if (project) {
//       setSelectedProject(project);
//     }
//   };

//   return (
//     <ProjectContext.Provider
//       value={{
//         projects,
//         selectedProject,
//         selectProject,
//         fetchProjects,
//         createProject,
//         updateProject,
//         loading,
//         creating,
//         error,
//       }}
//     >
//       {!loading && children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProject = () => useContext(ProjectContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import { projectsApi } from "@/services/api";

type ProjectContextType = {
  projects: any[];
  selectedProject: any;
  selectProject: (projectId: string) => void;
  fetchProjects: () => Promise<void>;
  createProject: (formData: any) => Promise<boolean>;
  updateProject: (id: string, formData: any) => Promise<boolean>;
  loading: boolean;
  creating: boolean;
  error: any;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll("rag");
      setProjects(data);

      // Persistence: Restore selection from localStorage or default to first project
      const savedId = localStorage.getItem("selectedProjectId");
      const existingProject = data.find((p) => p._id === savedId);

      if (existingProject) {
        setSelectedProject(existingProject);
      } else if (data.length > 0) {
        setSelectedProject(data[0]);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const selectProject = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId);
    if (project) {
      setSelectedProject(project);
      localStorage.setItem("selectedProjectId", projectId);
    }
  };

  const createProject = async (formData: any) => {
    try {
      setCreating(true);
      const newProject = await projectsApi.create({ ...formData, type: "rag" });
      setProjects((prev) => [newProject, ...prev]);

      // Automatically select the newly created project
      setSelectedProject(newProject);
      localStorage.setItem("selectedProjectId", newProject._id);

      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to create project");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateProject = async (id: string, formData: any) => {
    try {
      setCreating(true);
      const updatedProject = await projectsApi.update(id, formData);
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? updatedProject : p))
      );

      // If the currently selected project was updated, sync it
      if (selectedProject?._id === id) {
        setSelectedProject(updatedProject);
      }
      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to update project");
      return false;
    } finally {
      setCreating(false);
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
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProject must be used within a ProjectProvider");
  return context;
};
