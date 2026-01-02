import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Folder, Check, LayoutGrid } from "lucide-react";

const ProjectDropdown = ({ projects = [], projectId, setProjectId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentProject = projects.find((p) => p._id === projectId);

  return (
    <div className="relative inline-block w-64" ref={ref}>
      {/* Select Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between gap-3 px-3 py-2 
          bg-slate-900 border transition-all duration-200 rounded-lg
          ${
            open
              ? "border-blue-500 ring-2 ring-blue-500/20"
              : "border-slate-700 hover:border-slate-500"
          }
          text-slate-200 text-sm font-medium
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {projectId === "all" ? (
            <LayoutGrid className="w-4 h-4 text-slate-400" />
          ) : (
            <Folder className="w-4 h-4 text-blue-400" />
          )}
          <span className="truncate">
            {projectId === "all"
              ? "All Projects"
              : currentProject?.name || "Select Project"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-1 max-h-72 overflow-y-auto custom-scrollbar">
            {/* Header / Label */}
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Workspace
            </div>

            {/* "All Projects" Option */}
            <DropdownItem
              label="All Projects"
              icon={<LayoutGrid className="w-4 h-4" />}
              isSelected={projectId === "all"}
              onClick={() => {
                setProjectId("all");
                setOpen(false);
              }}
            />

            <div className="my-1 border-t border-slate-800" />

            {/* Project List */}
            {projects.map((p) => (
              <DropdownItem
                key={p._id}
                label={p.name}
                icon={<Folder className="w-4 h-4 text-blue-400" />}
                isSelected={projectId === p._id}
                onClick={() => {
                  setProjectId(p._id);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for cleaner mapping
const DropdownItem = ({ label, icon, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors
      ${
        isSelected
          ? "bg-blue-600/10 text-blue-400"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }
    `}
  >
    <div className="flex items-center gap-2 truncate">
      {icon}
      <span className="truncate">{label}</span>
    </div>
    {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
  </button>
);

export default ProjectDropdown;
