import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { mockSupabase, mockVerifyAccess, resetMocks } from './setup.js';

let app;

beforeEach(async () => {
  resetMocks();

  const { default: transactionRoutes } = await import('../routes/transactions.js');

  app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.userId = req.headers['x-test-user-id'] || 'test-user-123';
    next();
  });
  app.use('/api/transactions', transactionRoutes);
});

describe('GET /api/transactions', () => {
  it('returns 400 when organizationId is missing', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Organization ID is required');
  });

  it('returns 403 when user has no access', async () => {
    mockVerifyAccess.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/transactions?organizationId=org-1');

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Access denied');
  });

  it('returns paginated transactions on success', async () => {
    mockVerifyAccess.mockResolvedValue('owner');

    const mockTransactions = [
      { id: '1', description: 'Salary', amount: 5000, type: 'income' },
      { id: '2', description: 'Rent', amount: 1500, type: 'expense' },
    ];

    // Count query (select with head: true)
    mockSupabase.select.mockImplementationOnce(() => ({
      ...mockSupabase,
      eq: vi.fn(() => Promise.resolve({ count: 2, error: null })),
    }));

    // Data query
    mockSupabase.range.mockResolvedValueOnce({ data: mockTransactions, error: null });

    const res = await request(app)
      .get('/api/transactions?organizationId=org-1&page=1&limit=50');

    expect(res.status).toBe(200);
    expect(res.body.transactions).toEqual(mockTransactions);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.total).toBe(2);
  });
});

describe('POST /api/transactions', () => {
  it('returns 403 when user has viewer role', async () => {
    mockVerifyAccess.mockResolvedValue('viewer');

    const res = await request(app)
      .post('/api/transactions')
      .send({
        organizationId: 'org-1',
        description: 'Test',
        amount: 100,
        type: 'expense',
        category: 'food',
        date: '2026-07-12',
      });

    expect(res.status).toBe(403);
  });

  it('creates transaction with valid data', async () => {
    mockVerifyAccess.mockResolvedValue('member');

    const newTransaction = {
      id: 'txn-1',
      description: 'Groceries',
      amount: 75.50,
      type: 'expense',
      category: 'food',
      currency: 'USD',
      date: '2026-07-12',
    };

    mockSupabase.single.mockResolvedValueOnce({ data: newTransaction, error: null });

    const res = await request(app)
      .post('/api/transactions')
      .send({
        organizationId: 'org-1',
        description: 'Groceries',
        amount: 75.50,
        type: 'expense',
        category: 'food',
        date: '2026-07-12',
      });

    expect(res.status).toBe(201);
    expect(res.body.transaction).toEqual(newTransaction);
  });
});

describe('DELETE /api/transactions/:id', () => {
  it('returns 404 when transaction not found', async () => {
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST116' },
    });

    const res = await request(app).delete('/api/transactions/nonexistent');
    expect(res.status).toBe(404);
  });

  it('returns 403 when viewer tries to delete', async () => {
    mockSupabase.single.mockResolvedValueOnce({
      data: { organization_id: 'org-1', created_by: 'other-user' },
      error: null,
    });
    mockVerifyAccess.mockResolvedValue('viewer');

    const res = await request(app).delete('/api/transactions/txn-1');
    expect(res.status).toBe(403);
  });

  it('allows owner to delete any transaction', async () => {
    mockSupabase.single.mockResolvedValueOnce({
      data: { organization_id: 'org-1', created_by: 'other-user' },
      error: null,
    });
    mockVerifyAccess.mockResolvedValue('owner');
    // The delete chain: .from().delete().eq() needs to resolve with no error
    // The final .eq() in the delete chain resolves the promise
    const deleteChain = { eq: vi.fn(() => Promise.resolve({ error: null })) };
    mockSupabase.delete.mockReturnValueOnce(deleteChain);

    const res = await request(app).delete('/api/transactions/txn-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
