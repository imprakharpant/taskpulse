import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { toInputDateFormat } from '../../utils/formatDate';

const taskFormSchema = z.object({
  name: z
    .string({ required_error: 'Task name is required' })
    .trim()
    .min(1, 'Task name cannot be empty')
    .max(150, 'Task name cannot exceed 150 characters'),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  dueDate: z.string().optional().or(z.literal('')),
  projectId: z.string({ required_error: 'Project is required' }).min(1, 'Project is required')
});

export const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  projects = [],
  defaultProjectId = '',
  isLoading = false
}) => {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: '',
      projectId: defaultProjectId
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        priority: initialData.priority || 'MEDIUM',
        status: initialData.status || 'PENDING',
        dueDate: toInputDateFormat(initialData.dueDate),
        projectId: initialData.projectId || defaultProjectId
      });
    } else {
      reset({
        name: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: '',
        projectId: defaultProjectId
      });
    }
  }, [initialData, defaultProjectId, reset, isOpen]);

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || null,
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        projectId: values.projectId
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e) => {
          setError(e.field, { message: e.message });
        });
      } else {
        setError('root', { message: err.message || 'Failed to save task' });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {errors.root && (
          <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-xs font-semibold text-rose-400">
            {errors.root.message}
          </div>
        )}

        <Input
          label="Task Name *"
          placeholder="e.g. Implement user authentication"
          error={errors.name}
          {...register('name')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Details or acceptance criteria..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-rose-400 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Project Selector (shown if projects list provided) */}
        {projects.length > 0 && !defaultProjectId && (
          <Select
            label="Assigned Project *"
            error={errors.projectId}
            {...register('projectId')}
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority"
            error={errors.priority}
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' }
            ]}
            {...register('priority')}
          />

          <Select
            label="Status"
            error={errors.status}
            options={[
              { value: 'PENDING', label: 'Pending' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' }
            ]}
            {...register('status')}
          />
        </div>

        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate}
          {...register('dueDate')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
