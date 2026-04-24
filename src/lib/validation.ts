import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description must be less than 200 characters')
    .trim(),

  amount: z.number()
    .positive('Amount must be positive')
    .max(999999999, 'Amount is too large')
    .refine((val) => Number.isFinite(val), 'Amount must be a valid number'),

  type: z.enum(['income', 'expense']),

  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),

  currency: z.string()
    .length(3, 'Currency must be a 3-letter code')
    .regex(/^[A-Z]{3}$/, 'Currency must be uppercase letters')
    .default('USD'),

  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid date'),

  idempotencyKey: z.string().optional(),
});

// Budget validation schema
export const budgetSchema = z.object({
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),

  limit: z.number()
    .positive('Limit must be positive')
    .max(999999999, 'Limit is too large'),

  period: z.enum(['monthly', 'yearly']),

  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),

  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
});

// Organization validation schema
export const organizationSchema = z.object({
  name: z.string()
    .min(1, 'Organization name is required')
    .max(100, 'Organization name must be less than 100 characters')
    .trim(),

  slug: z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
});

// Invitation validation schema
export const invitationSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),

  role: z.enum(['owner', 'admin', 'member']),
});

// Recurring transaction validation schema
export const recurringTransactionSchema = z.object({
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description must be less than 200 characters')
    .trim(),

  amount: z.number()
    .positive('Amount must be positive')
    .max(999999999, 'Amount is too large'),

  type: z.enum(['income', 'expense']),

  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),

  currency: z.string()
    .length(3, 'Currency must be a 3-letter code')
    .default('USD'),

  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),

  interval: z.number()
    .int('Interval must be a whole number')
    .positive('Interval must be positive')
    .max(365, 'Interval is too large')
    .default(1),

  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),

  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),

  isActive: z.boolean().default(true),
});

// Type exports for TypeScript
export type Transaction = z.infer<typeof transactionSchema>;
export type Budget = z.infer<typeof budgetSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type Invitation = z.infer<typeof invitationSchema>;
export type RecurringTransaction = z.infer<typeof recurringTransactionSchema>;

// Helper function to validate and return errors
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
