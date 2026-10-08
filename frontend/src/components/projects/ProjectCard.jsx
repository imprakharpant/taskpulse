import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { PROJECT_STATUS_CONFIG } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import { Calendar, CheckSquare, Edit, Trash2, ArrowRight } from 'lucide-react';

export const ProjectCard = ({ project, onEdit, onDelete }) => {
  const statusCfg = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.NOT_STARTED;
  const taskCount = project._count?.tasks ?? (project.tasks ? project.tasks.length : 0);

  return (
    <div className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20 transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link
            to={`/projects/${project.id}`}
            className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1"
          >
            {project.name}
          </Link>
          <Badge className={statusCfg.badgeClass}>{statusCfg.label}</Badge>
        </div>

        <p className="text-sm text-slate-400 line-clamp-2 mb-5 min-h-[2.5rem] leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Date and Tasks Metadata */}
        <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              {project.startDate ? formatDate(project.startDate) : 'Not scheduled'}
              {' — '}
              {project.endDate ? formatDate(project.endDate) : 'No deadline'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between pt-2">
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          View Tasks <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(project)}
            title="Edit project"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project)}
            title="Delete project"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
