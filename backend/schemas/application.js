const { z } = require('zod');

const applicationFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number format'),
  position: z.string()
    .min(2, 'Position must be specified')
    .max(100, 'Position must not exceed 100 characters'),
  experience: z.string()
    .min(0, 'Experience required')
    .max(5000, 'Experience description too long'),
  portfolioUrl: z.string()
    .url('Invalid portfolio URL')
    .optional()
    .nullable(),
  resume: z.string()
    .optional()
    .nullable(),
  coverLetter: z.string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(3000, 'Cover letter must not exceed 3000 characters')
    .optional()
    .nullable(),
});

module.exports = { applicationFormSchema };
