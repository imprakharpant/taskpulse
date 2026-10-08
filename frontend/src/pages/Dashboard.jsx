import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as dashboardApi from '../api/dashboard.api';
import * as projectApi from '../api/projects.api';
import { StatCard } from '../components/dashboard/StatCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatCardSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  Plus,
  RefreshCw,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, projectsRes] = await Promise.all([
        dashboardApi.getDashboard(),
        projectApi.getProjects({ limit: 3, sortBy: 'createdAt', order: 'desc' })
      ]);

      setStats(statsRes.data);
      setRecentProjects(projectsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateProject = async (data) => {
    try {
      setActionLoading(true);
      await projectApi.createProject(data);
      setIsCreateModalOpen(false);
      await fetchDashboardData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProject = async (data) => {
    try {
      setActionLoading(true);
      await projectApi.updateProject(editingProject.id, data);
      setEditingProject(null);
      await fetchDashboardData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      setActionLoading(true);
      await projectApi.deleteProject(deletingProject.id);
      setDeletingProject(null);
      await fetchDashboardData();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">System Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time aggregate overview of your projects and task workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            isLoading={loading}
            title="Refresh metrics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Error State with Retry Button */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold text-sm">Failed to load statistics</p>
              <p className="text-xs text-rose-400/80">{error}</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={fetchDashboardData}>
            Retry
          </Button>
        </div>
      )}

      {/* 5 Dynamic Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          stats && (
            <>
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={FolderKanban}
                color="indigo"
                description="Active workspace portfolios"
              />
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={Layers}
                color="blue"
                description="All tracked action items"
              />
              <StatCard
                title="Completed Tasks"
                value={stats.completedTasks}
                icon={CheckCircle2}
                color="emerald"
                description="Finished deliverables"
              />
              <StatCard
                title="Pending Tasks"
                value={stats.pendingTasks}
                icon={Clock}
                color="rose"
                description="Strictly pending items"
              />
              <StatCard
                title="Projects In Progress"
                value={stats.projectsInProgress}
                icon={Activity}
                color="amber"
                description="Actively underway"
              />
            </>
          )
        )}
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            Recent Projects
          </h2>
          <Link
            to="/projects"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View all projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
            <p className="text-sm text-slate-400 mb-3">No projects created yet.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={(proj) => setEditingProject(proj)}
                onDelete={(proj) => setDeletingProject(proj)}
              />
            ))}
          </div>
        )}
      </div>

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
