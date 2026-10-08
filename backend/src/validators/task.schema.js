const { z } = require('zod');

const taskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

const createTaskSchema = z.object({
  name: z
    .string({ required_error: 'Task name is required' })
    .trim()
    .min(1, 'Task name cannot be empty')
    .max(150, 'Task name cannot exceed 150 characters'),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional()
    .nullable(),
  priority: priorityEnum.default('MEDIUM'),
  status: taskStatusEnum.default('PENDING'),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO datetime' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'))
    .transform((val) => new Date(val))
    .optional()
    .nullable(),
  projectId: z.string({ required_error: 'Project ID is required' }).uuid({
    message: 'Invalid project ID format'
  })
});

const updateTaskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Task name cannot be empty')
    .max(150, 'Task name cannot exceed 150 characters')
    .optional(),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional()
    .nullable(),
  priority: priorityEnum.optional(),
  status: taskStatusEnum.optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO datetime' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'))
    .transform((val) => new Date(val))
    .optional()
    .nullable(),
  projectId: z.string().uuid({ message: 'Invalid project ID format' }).optional()
});

const taskQuerySchema = z.object({
  projectId: z.string().uuid({ message: 'Invalid project ID format' }).optional(),
  search: z.string().trim().optional(),
  status: taskStatusEnum.optional(),
  priority: priorityEnum.optional(),
  sortBy: z.enum(['name', 'createdAt', 'dueDate', 'priority', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().positive().default(1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().positive().max(100).default(50))
});

const taskIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid task ID format' })
});

module.exports = {
  taskStatusEnum,
  priorityEnum,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdParamSchema
};
