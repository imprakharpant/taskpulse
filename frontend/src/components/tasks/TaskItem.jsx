import React from 'react';
import { Badge } from '../common/Badge';
import { TASK_STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/formatDate';
import { Calendar, CheckCircle2, Circle, Edit, Trash2, AlertCircle } from 'lucide-react';

export const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isCompleted = task.status === 'COMPLETED';
  const statusCfg = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.PENDING;
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-150 ${
        isCompleted
          ? 'bg-slate-900/30 border-slate-800/60 opacity-75'
          : overdue
          ? 'bg-rose-950/10 border-rose-900/40 hover:border-rose-800/60'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle complete button */}
        <button
          onClick={() => onToggleComplete(task)}
          className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
          ) : (
            <Circle className="w-5 h-5 hover:scale-105 transition-transform" />
          )}
        </button>

        {/* Task Details */}
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold truncate ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
              }`}
            >
              {task.name}
            </span>
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Metadata badges and due date */}
          <div className="flex items-center gap-2.5 pt-1.5 flex-wrap text-xs">
            <Badge className={statusCfg.badgeClass}>{statusCfg.label}</Badge>
            <Badge className={priorityCfg.badgeClass}>{priorityCfg.label}</Badge>

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 font-medium ${
                  overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {overdue ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>
                  {formatDate(task.dueDate)} {overdue && '(Overdue)'}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 shrink-0">
        <button
          onClick={() => onEdit(task)}
          title="Edit task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          title="Delete task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
