import { vi } from 'vitest';

// Create a chainable mock for Supabase
function createChainableMock() {
  const mock = {};
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'neq', 'is', 'gte', 'lte', 'order', 'range', 'single'];

  methods.forEach((method) => {
    mock[method] = vi.fn(() => mock);
  });

  return mock;
}

export const mockSupabase = createChainableMock();

vi.mock('../lib/supabase.js', () => ({
  supabase: mockSupabase,
}));

// Mock orgAccess — tests override this per-case
export const mockVerifyAccess = vi.fn();

vi.mock('../middleware/orgAccess.js', () => ({
  verifyOrganizationAccess: (...args) => mockVerifyAccess(...args),
  requireOrgAccess: () => (req, res, next) => next(),
}));

vi.mock('../middleware/idempotency.js', () => ({
  idempotent: () => (_req, _res, next) => next(),
}));

vi.mock('../lib/validation.js', () => ({
  validateRequest: () => (_req, _res, next) => next(),
  transactionSchema: {},
  budgetSchema: {},
  invitationSchema: {},
  organizationSchema: {},
  recurringTransactionSchema: {},
}));

vi.mock('../lib/auditLog.js', () => ({
  logAuditEvent: vi.fn(),
}));

vi.mock('../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('../middleware/auth.js', () => ({
  clerkMiddleware: (req, _res, next) => {
    req.userId = req.headers['x-test-user-id'] || 'test-user-123';
    next();
  },
}));

vi.mock('../lib/scheduler.js', () => ({
  initializeScheduler: vi.fn(),
}));

vi.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      getUser: vi.fn(() => Promise.resolve({
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      })),
    },
  },
}));

export function resetMocks() {
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'neq', 'is', 'gte', 'lte', 'order', 'range', 'single'];
  methods.forEach((method) => {
    mockSupabase[method].mockClear();
    mockSupabase[method].mockReturnValue(mockSupabase);
  });
  mockVerifyAccess.mockReset();
}
