import React, { useState, useEffect } from 'react';
import * as projectApi from '../api/projects.api';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import { useDebounce } from '../hooks/useDebounce';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  X,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;

      const res = await projectApi.getProjects(params);
      setProjects(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [debouncedSearch, statusFilter]);

  const handleCreateProject = async (data) => {
    try {
      setActionLoading(true);
      await projectApi.createProject(data);
      setIsCreateModalOpen(false);
      await fetchProjects();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProject = async (data) => {
    try {
      setActionLoading(true);
      await projectApi.updateProject(editingProject.id, data);
      setEditingProject(null);
      await fetchProjects();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      setActionLoading(true);
      await projectApi.deleteProject(deletingProject.id);
      setDeletingProject(null);
      await fetchProjects();
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setStatusFilter('');
  };

  const hasActiveFilters = Boolean(searchInput || statusFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-indigo-400" />
            Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize and manage your project portfolios and milestone deadlines.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[160px]">
            <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              title="Clear all active filters"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold text-sm">Failed to load projects</p>
              <p className="text-xs text-rose-400/80">{error}</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={fetchProjects}>
            Retry
          </Button>
        </div>
      )}

      {/* Projects Grid or States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="No matching projects"
            description="No projects match your current search and filter criteria."
            actionLabel="Clear Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start organizing tasks and tracking progress."
            actionLabel="Create Project"
            onAction={() => setIsCreateModalOpen(true)}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onEdit={(p) => setEditingProject(p)}
              onDelete={(p) => setDeletingProject(p)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        isLoading={actionLoading}
      />

      <ProjectFormModal
        isOpen={!!editingProject}
        initialData={editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={handleUpdateProject}
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={!!deletingProject}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deletingProject?.name}"? All associated tasks will be permanently removed.`}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteProject}
        isLoading={actionLoading}
      />
    </div>
  );
};
