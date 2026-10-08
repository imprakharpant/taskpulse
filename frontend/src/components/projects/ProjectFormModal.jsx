import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { toInputDateFormat } from '../../utils/formatDate';

const projectFormSchema = z
  .object({
    name: z
      .string({ required_error: 'Project name is required' })
      .trim()
      .min(1, 'Project name cannot be empty')
      .max(150, 'Project name cannot exceed 150 characters'),
    description: z
      .string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional()
      .or(z.literal('')),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal(''))
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date cannot be earlier than start date',
      path: ['endDate']
    }
  );

export const ProjectFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
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
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'NOT_STARTED',
      startDate: '',
      endDate: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        status: initialData.status || 'NOT_STARTED',
        startDate: toInputDateFormat(initialData.startDate),
        endDate: toInputDateFormat(initialData.endDate)
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'NOT_STARTED',
        startDate: '',
        endDate: ''
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || null,
        status: values.status,
        startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
        endDate: values.endDate ? new Date(values.endDate).toISOString() : null
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e) => {
          setError(e.field, { message: e.message });
        });
      } else {
        setError('root', { message: err.message || 'Failed to save project' });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {errors.root && (
          <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-xs font-semibold text-rose-400">
            {errors.root.message}
          </div>
        )}

        <Input
          label="Project Name *"
          placeholder="e.g. Website Redesign"
          error={errors.name}
          {...register('name')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief scope and deliverables..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-rose-400 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <Select
          label="Status"
          error={errors.status}
          options={[
            { value: 'NOT_STARTED', label: 'Not Started' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' }
          ]}
          {...register('status')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            error={errors.startDate}
            {...register('startDate')}
          />
          <Input
            label="End Date"
            type="date"
            error={errors.endDate}
            {...register('endDate')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
