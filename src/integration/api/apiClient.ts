import { invalidateCache } from '../cache/cache';
import type {
  ApiResponse,
  Organization,
  Transaction,
  Budget,
  RecurringTransaction,
  OrganizationMember,
  Invitation,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  CreateBudgetRequest,
  CreateRecurringTransactionRequest,
  InviteMemberRequest,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  getToken: () => Promise<string>,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return { data, error: null };
  } catch (error) {
    console.error('API request error:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get user's organization
 */
export async function getUserOrganization(
  getToken: () => Promise<string>
): Promise<ApiResponse<Organization>> {
  const { data, error } = await apiRequest<{ organization: Organization }>(
    '/api/organizations/me',
    getToken
  );
  return { data: data?.organization || null, error };
}

/**
 * Create organization
 */
export async function createOrganization(
  name: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<Organization>> {
  const { data, error } = await apiRequest<{ organization: Organization }>(
    '/api/organizations',
    getToken,
    {
      method: 'POST',
      body: JSON.stringify({ name }),
    }
  );
  invalidateCache('organization');
  return { data: data?.organization || null, error };
}

/**
 * Get transactions for organization
 */
export async function getTransactions(
  organizationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<Transaction[]>> {
  const { data, error } = await apiRequest<{ transactions: Transaction[] }>(
    `/api/transactions?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.transactions || null, error };
}

/**
 * Create transaction
 */
export async function createTransaction(
  organizationId: string,
  userId: string,
  transactionData: CreateTransactionRequest,
  getToken: () => Promise<string>
): Promise<ApiResponse<Transaction>> {
  const { data, error } = await apiRequest<{ transaction: Transaction }>(
    '/api/transactions',
    getToken,
    {
      method: 'POST',
      body: JSON.stringify({
        organizationId,
        ...transactionData,
      }),
    }
  );
  invalidateCache('transactions');
  return { data: data?.transaction || null, error };
}

/**
 * Update transaction
 */
export async function updateTransaction(
  transactionId: string,
  transactionData: UpdateTransactionRequest,
  getToken: () => Promise<string>
): Promise<ApiResponse<Transaction>> {
  const { data, error } = await apiRequest<{ transaction: Transaction }>(
    `/api/transactions/${transactionId}`,
    getToken,
    {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    }
  );
  invalidateCache('transactions');
  return { data: data?.transaction || null, error };
}

/**
 * Delete transaction
 */
export async function deleteTransaction(
  transactionId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<void>> {
  const { data, error } = await apiRequest<void>(
    `/api/transactions/${transactionId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  invalidateCache('transactions');
  return { data, error };
}

/**
 * Delete all transactions for organization
 */
export async function deleteAllTransactions(
  organizationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<void>> {
  const { data, error } = await apiRequest<void>(
    `/api/transactions?organizationId=${organizationId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  invalidateCache('transactions');
  return { data, error };
}

/**
 * Migrate localStorage data to backend
 */
export async function migrateLocalStorageData(
  organizationId: string,
  userId: string,
  transactions: CreateTransactionRequest[],
  getToken: () => Promise<string>
): Promise<ApiResponse<{ count: number }>> {
  const results = await Promise.all(
    transactions.map((transaction) =>
      createTransaction(organizationId, userId, transaction, getToken)
    )
  );

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    return {
      data: null,
      error: new Error(`Failed to migrate ${errors.length} transactions`),
    };
  }

  return { data: { count: results.length }, error: null };
}

/**
 * Get organization members
 */
export async function getMembers(
  organizationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<OrganizationMember[]>> {
  const { data, error } = await apiRequest<{ members: OrganizationMember[] }>(
    `/api/members?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.members || null, error };
}

/**
 * Update member role
 */
export async function updateMemberRole(
  memberId: string,
  role: 'admin' | 'member' | 'viewer',
  getToken: () => Promise<string>
): Promise<ApiResponse<OrganizationMember>> {
  const { data, error } = await apiRequest<{ member: OrganizationMember }>(
    `/api/members/${memberId}`,
    getToken,
    {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }
  );
  invalidateCache('members');
  return { data: data?.member || null, error };
}

/**
 * Remove member
 */
export async function removeMember(
  memberId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<void>> {
  const { data, error } = await apiRequest<void>(
    `/api/members/${memberId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  invalidateCache('members');
  return { data, error };
}

/**
 * Create invitation
 */
export async function createInvitation(
  organizationId: string,
  email: string,
  role: 'admin' | 'member' | 'viewer',
  getToken: () => Promise<string>
): Promise<ApiResponse<Invitation>> {
  const { data, error } = await apiRequest<{ invitation: Invitation }>(
    '/api/invitations',
    getToken,
    {
      method: 'POST',
      body: JSON.stringify({ organizationId, email, role }),
    }
  );
  invalidateCache('invitations');
  return { data: data?.invitation || null, error };
}

/**
 * Get pending invitations
 */
export async function getInvitations(
  organizationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<Invitation[]>> {
  const { data, error } = await apiRequest<{ invitations: Invitation[] }>(
    `/api/invitations?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.invitations || null, error };
}

/**
 * Accept invitation
 */
export async function acceptInvitation(
  token: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<any>> {
  const { data, error } = await apiRequest<any>(
    `/api/invitations/${token}/accept`,
    getToken,
    {
      method: 'POST',
    }
  );
  invalidateCache('invitations');
  invalidateCache('members');
  return { data, error };
}

/**
 * Revoke invitation
 */
export async function revokeInvitation(
  invitationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<void>> {
  const { data, error } = await apiRequest<void>(
    `/api/invitations/${invitationId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  invalidateCache('invitations');
  return { data, error };
}

/**
 * Get recurring transactions for organization
 */
export async function getRecurringTransactions(
  organizationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<RecurringTransaction[]>> {
  const { data, error } = await apiRequest<{
    recurringTransactions: RecurringTransaction[];
  }>(`/api/recurring-transactions?organizationId=${organizationId}`, getToken);
  return { data: data?.recurringTransactions || null, error };
}

/**
 * Create recurring transaction
 */
export async function createRecurringTransaction(
  organizationId: string,
  recurringData: CreateRecurringTransactionRequest,
  getToken: () => Promise<string>
): Promise<ApiResponse<RecurringTransaction>> {
  const { data, error } = await apiRequest<{
    recurringTransaction: RecurringTransaction;
  }>('/api/recurring-transactions', getToken, {
    method: 'POST',
    body: JSON.stringify({
      organizationId,
      ...recurringData,
    }),
  });
  invalidateCache('recurring');
  return { data: data?.recurringTransaction || null, error };
}

/**
 * Update recurring transaction
 */
export async function updateRecurringTransaction(
  recurringId: string,
  recurringData: Partial<CreateRecurringTransactionRequest>,
  getToken: () => Promise<string>
): Promise<ApiResponse<RecurringTransaction>> {
  const { data, error } = await apiRequest<{
    recurringTransaction: RecurringTransaction;
  }>(`/api/recurring-transactions/${recurringId}`, getToken, {
    method: 'PUT',
    body: JSON.stringify(recurringData),
  });
  invalidateCache('recurring');
  return { data: data?.recurringTransaction || null, error };
}

/**
 * Delete recurring transaction
 */
export async function deleteRecurringTransaction(
  recurringId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<void>> {
  const { data, error } = await apiRequest<void>(
    `/api/recurring-transactions/${recurringId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  invalidateCache('recurring');
  return { data, error };
}

/**
 * Toggle recurring transaction active status
 */
export async function toggleRecurringTransaction(
  recurringId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<RecurringTransaction>> {
  const { data, error } = await apiRequest<{
    recurringTransaction: RecurringTransaction;
  }>(`/api/recurring-transactions/${recurringId}/toggle`, getToken, {
    method: 'POST',
  });
  invalidateCache('recurring');
  return { data: data?.recurringTransaction || null, error };
}

/**
 * Get budgets for organization
 */
export async function getBudgets(
  organizationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<Budget[]>> {
  const { data, error } = await apiRequest<{ budgets: Budget[] }>(
    `/api/budgets?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.budgets || null, error };
}

/**
 * Get budget status with spending comparison
 */
export async function getBudgetStatus(
  budgetId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<any>> {
  const { data, error } = await apiRequest<any>(
    `/api/budgets/${budgetId}/status`,
    getToken
  );
  return { data, error };
}

/**
 * Create budget
 */
export async function createBudget(
  organizationId: string,
  budgetData: CreateBudgetRequest,
  getToken: () => Promise<string>
): Promise<ApiResponse<Budget>> {
  const { data, error } = await apiRequest<{ budget: Budget }>(
    '/api/budgets',
    getToken,
    {
      method: 'POST',
      body: JSON.stringify({
        organizationId,
        ...budgetData,
      }),
    }
  );
  invalidateCache('budgets');
  return { data: data?.budget || null, error };
}

/**
 * Update budget
 */
export async function updateBudget(
  budgetId: string,
  budgetData: Partial<CreateBudgetRequest>,
  getToken: () => Promise<string>
): Promise<ApiResponse<Budget>> {
  const { data, error } = await apiRequest<{ budget: Budget }>(
    `/api/budgets/${budgetId}`,
    getToken,
    {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    }
  );
  invalidateCache('budgets');
  return { data: data?.budget || null, error };
}

/**
 * Delete budget
 */
export async function deleteBudget(
  budgetId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<void>> {
  const { data, error } = await apiRequest<void>(
    `/api/budgets/${budgetId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  invalidateCache('budgets');
  return { data, error };
}

/**
 * Delete organization
 */
export async function deleteOrganization(
  organizationId: string,
  getToken: () => Promise<string>
): Promise<ApiResponse<void>> {
  const { data, error } = await apiRequest<void>(
    `/api/organizations/${organizationId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  invalidateCache('organization');
  return { data, error };
}
