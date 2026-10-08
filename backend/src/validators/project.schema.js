const { z } = require('zod');

const projectStatusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);

const createProjectSchema = z
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
      .nullable(),
    status: projectStatusEnum.default('NOT_STARTED'),
    startDate: z
      .string()
      .datetime({ message: 'Start date must be a valid ISO datetime' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'))
      .transform((val) => new Date(val))
      .optional()
      .nullable(),
    endDate: z
      .string()
      .datetime({ message: 'End date must be a valid ISO datetime' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'))
      .transform((val) => new Date(val))
      .optional()
      .nullable()
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: 'End date cannot be earlier than start date',
      path: ['endDate']
    }
  );

const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Project name cannot be empty')
      .max(150, 'Project name cannot exceed 150 characters')
      .optional(),
    description: z
      .string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional()
      .nullable(),
    status: projectStatusEnum.optional(),
    startDate: z
      .string()
      .datetime({ message: 'Start date must be a valid ISO datetime' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'))
      .transform((val) => new Date(val))
      .optional()
      .nullable(),
    endDate: z
      .string()
      .datetime({ message: 'End date must be a valid ISO datetime' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'))
      .transform((val) => new Date(val))
      .optional()
      .nullable()
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: 'End date cannot be earlier than start date',
      path: ['endDate']
    }
  );

const projectQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: projectStatusEnum.optional(),
  sortBy: z.enum(['name', 'createdAt', 'startDate', 'endDate', 'status']).default('createdAt'),
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

const projectIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid project ID format' })
});

module.exports = {
  projectStatusEnum,
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
  projectIdParamSchema
};
