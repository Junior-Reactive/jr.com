const { z } = require('zod');

const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
  service: z.string()
    .optional()
    .nullable(),
});

module.exports = { contactFormSchema };
