import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as projectApi from '../api/projects.api';
import * as taskApi from '../api/tasks.api';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { PROJECT_STATUS_CONFIG } from '../utils/constants';
import { formatDate } from '../utils/formatDate';
import {
  ArrowLeft, Plus, Search, Filter, X, Edit, Trash2,
  Calendar, CheckSquare, AlertTriangle, RefreshCw, ListTodo
} from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState('');

  // Task filters
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);

  // Modal state
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      setProjectLoading(true);
      const res = await projectApi.getProjectById(id);
      setProject(res.data);
    } catch (err) {
      setError(err.message || 'Project not found');
    } finally {
      setProjectLoading(false);
    }
  }, [id]);

  const fetchTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      const params = { projectId: id };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await taskApi.getTasks(params);
      setTasks(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  }, [id, debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => { fetchProject(); }, [fetchProject]);
  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreateTask = async (data) => {
    setActionLoading(true);
    try {
      await taskApi.createTask({ ...data, projectId: id });
      setIsCreateTaskOpen(false);
      await Promise.all([fetchTasks(), fetchProject()]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTask = async (data) => {
    setActionLoading(true);
    try {
      await taskApi.updateTask(editingTask.id, data);
      setEditingTask(null);
      await fetchTasks();
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await taskApi.updateTask(task.id, { status: newStatus });
      await Promise.all([fetchTasks(), fetchProject()]);
    } catch (err) {
      // silently retry
    }
  };

  const handleDeleteTask = async () => {
    setActionLoading(true);
    try {
      await taskApi.deleteTask(deletingTask.id);
      setDeletingTask(null);
      await Promise.all([fetchTasks(), fetchProject()]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProject = async (data) => {
    setActionLoading(true);
    try {
      await projectApi.updateProject(id, data);
      setIsEditProjectOpen(false);
      await fetchProject();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setActionLoading(true);
    try {
      await projectApi.deleteProject(id);
      navigate('/projects');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const hasActiveFilters = Boolean(searchInput || statusFilter || priorityFilter);

  if (error && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400" />
        <p className="text-slate-300 font-semibold">{error}</p>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  const statusCfg = project ? PROJECT_STATUS_CONFIG[project.status] : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back nav */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Projects
      </button>

      {/* Project Header Card */}
      {projectLoading ? (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse space-y-3">
          <div className="h-6 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800/60 rounded w-2/3" />
          <div className="flex gap-2 pt-2">
            <div className="h-5 bg-slate-800 rounded-full w-20" />
            <div className="h-5 bg-slate-800 rounded w-32" />
          </div>
        </div>
      ) : project && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">{project.name}</h1>
                {statusCfg && (
                  <Badge className={statusCfg.badgeClass}>{statusCfg.label}</Badge>
                )}
              </div>
              {project.description && (
                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              )}
              <div className="flex items-center gap-5 pt-1 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {project.startDate ? formatDate(project.startDate) : 'No start date'}
                  {' → '}
                  {project.endDate ? formatDate(project.endDate) : 'No deadline'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                  {project._count?.tasks ?? 0} tasks
                </span>
              </div>
            </div>

            {/* Project Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setIsEditProjectOpen(true)}>
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsDeletingProject(true)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Task Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-indigo-400" />
            Tasks
            {tasks.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {tasks.length}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchTasks} isLoading={tasksLoading}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsCreateTaskOpen(true)}>
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Task List */}
        {tasksLoading ? (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : tasks.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              title="No matching tasks"
              description="No tasks match your current search or filters."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Break this project down into actionable tasks to track your progress."
              actionLabel="Add First Task"
              onAction={() => setIsCreateTaskOpen(true)}
            />
          )
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* All Modals */}
      <TaskFormModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        defaultProjectId={id}
        isLoading={actionLoading}
      />

      <TaskFormModal
        isOpen={!!editingTask}
        initialData={editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        defaultProjectId={id}
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete Task?"
        message={`Delete "${deletingTask?.name}"? This cannot be undone.`}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        isLoading={actionLoading}
      />

      <ProjectFormModal
        isOpen={isEditProjectOpen}
        initialData={project}
        onClose={() => setIsEditProjectOpen(false)}
        onSubmit={handleUpdateProject}
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={isDeletingProject}
        title="Delete Project?"
        message={`Delete "${project?.name}" and all its tasks permanently?`}
        onClose={() => setIsDeletingProject(false)}
        onConfirm={handleDeleteProject}
        isLoading={actionLoading}
      />
    </div>
  );
};
