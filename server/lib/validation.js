import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
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
    .regex(/^[A-Z]{3}$/, 'Currency must be uppercase')
    .default('USD'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Budget validation schema
export const budgetSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  amount: z.number()
    .positive('Amount must be positive')
    .max(999999999, 'Amount is too large'),
  currency: z.string()
    .length(3, 'Currency must be a 3-letter code')
    .regex(/^[A-Z]{3}$/, 'Currency must be uppercase')
    .default('USD'),
  period: z.enum(['monthly', 'yearly']),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
});

// Organization validation schema
export const organizationSchema = z.object({
  name: z.string()
    .min(1, 'Organization name is required')
    .max(100, 'Organization name must be less than 100 characters')
    .trim(),
});

// Invitation validation schema
export const invitationSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  role: z.enum(['admin', 'member', 'viewer']),
});

// Recurring transaction validation schema
export const recurringTransactionSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
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

// Validation middleware factory
export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    // Replace req.body with validated data
    req.body = result.data;
    next();
  };
}

// Query parameter validation
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        error: 'Invalid query parameters',
        details: errors,
      });
    }

    req.query = result.data;
    next();
  };
}
