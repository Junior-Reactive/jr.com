const { z } = require('zod');

const adminLoginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
});

const adminActionSchema = z.object({
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT']),
  resource: z.string(),
  resourceId: z.string().uuid('Invalid resource ID').optional(),
  changes: z.record(z.any()).optional(),
  reason: z.string()
    .min(10, 'Reason for action must be at least 10 characters')
    .optional(),
});

const serviceCreateSchema = z.object({
  title: z.string()
    .min(5, 'Service title must be at least 5 characters')
    .max(100, 'Service title must not exceed 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  icon: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  featured: z.boolean().default(false),
});

const serviceUpdateSchema = serviceCreateSchema.partial();

module.exports = {
  adminLoginSchema,
  adminActionSchema,
  serviceCreateSchema,
  serviceUpdateSchema,
};
