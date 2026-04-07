const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/api/organizations/me')
 * @param {Function} getToken - Clerk's getToken function
 * @param {Object} options - Fetch options
 */
async function apiRequest(endpoint, getToken, options = {}) {
  try {
    // Get Clerk JWT token
    const token = await getToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    // Make request with Authorization header
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return { data, error: null };
  } catch (error) {
    console.error('API request error:', error);
    return { data: null, error };
  }
}

/**
 * Get user's organization
 */
export async function getUserOrganization(getToken) {
  const { data, error } = await apiRequest('/api/organizations/me', getToken);
  return { data: data?.organization, error };
}

/**
 * Create organization
 */
export async function createOrganization(name, getToken) {
  const { data, error } = await apiRequest('/api/organizations', getToken, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return { data: data?.organization, error };
}

/**
 * Get transactions for organization
 */
export async function getTransactions(organizationId, getToken) {
  const { data, error } = await apiRequest(
    `/api/transactions?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.transactions, error };
}

/**
 * Create transaction
 */
export async function createTransaction(organizationId, userId, transactionData, getToken) {
  const { data, error } = await apiRequest('/api/transactions', getToken, {
    method: 'POST',
    body: JSON.stringify({
      organizationId,
      ...transactionData,
    }),
  });
  return { data: data?.transaction, error };
}

/**
 * Update transaction
 */
export async function updateTransaction(transactionId, transactionData, getToken) {
  const { data, error } = await apiRequest(`/api/transactions/${transactionId}`, getToken, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  });
  return { data: data?.transaction, error };
}

/**
 * Delete transaction
 */
export async function deleteTransaction(transactionId, getToken) {
  const { data, error } = await apiRequest(`/api/transactions/${transactionId}`, getToken, {
    method: 'DELETE',
  });
  return { data, error };
}

/**
 * Delete all transactions for organization
 */
export async function deleteAllTransactions(organizationId, getToken) {
  const { data, error } = await apiRequest(
    `/api/transactions?organizationId=${organizationId}`,
    getToken,
    {
      method: 'DELETE',
    }
  );
  return { data, error };
}

/**
 * Migrate localStorage data to backend
 */
export async function migrateLocalStorageData(organizationId, userId, transactions, getToken) {
  // Create each transaction individually
  const results = await Promise.all(
    transactions.map(transaction =>
      createTransaction(organizationId, userId, transaction, getToken)
    )
  );

  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    return { data: null, error: new Error(`Failed to migrate ${errors.length} transactions`) };
  }

  return { data: { count: results.length }, error: null };
}

/**
 * Get organization members
 */
export async function getMembers(organizationId, getToken) {
  const { data, error } = await apiRequest(
    `/api/members?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.members, error };
}

/**
 * Update member role
 */
export async function updateMemberRole(memberId, role, getToken) {
  const { data, error } = await apiRequest(`/api/members/${memberId}`, getToken, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
  return { data: data?.member, error };
}

/**
 * Remove member
 */
export async function removeMember(memberId, getToken) {
  const { data, error } = await apiRequest(`/api/members/${memberId}`, getToken, {
    method: 'DELETE',
  });
  return { data, error };
}

/**
 * Create invitation
 */
export async function createInvitation(organizationId, email, role, getToken) {
  const { data, error } = await apiRequest('/api/invitations', getToken, {
    method: 'POST',
    body: JSON.stringify({ organizationId, email, role }),
  });
  return { data: data?.invitation, error };
}

/**
 * Get pending invitations
 */
export async function getInvitations(organizationId, getToken) {
  const { data, error } = await apiRequest(
    `/api/invitations?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.invitations, error };
}

/**
 * Accept invitation
 */
export async function acceptInvitation(token, getToken) {
  const { data, error } = await apiRequest(`/api/invitations/${token}/accept`, getToken, {
    method: 'POST',
  });
  return { data, error };
}

/**
 * Revoke invitation
 */
export async function revokeInvitation(invitationId, getToken) {
  const { data, error } = await apiRequest(`/api/invitations/${invitationId}`, getToken, {
    method: 'DELETE',
  });
  return { data, error };
}

/**
 * Get recurring transactions for organization
 */
export async function getRecurringTransactions(organizationId, getToken) {
  const { data, error } = await apiRequest(
    `/api/recurring-transactions?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.recurringTransactions, error };
}

/**
 * Create recurring transaction
 */
export async function createRecurringTransaction(organizationId, recurringData, getToken) {
  const { data, error } = await apiRequest('/api/recurring-transactions', getToken, {
    method: 'POST',
    body: JSON.stringify({
      organizationId,
      ...recurringData,
    }),
  });
  return { data: data?.recurringTransaction, error };
}

/**
 * Update recurring transaction
 */
export async function updateRecurringTransaction(recurringId, recurringData, getToken) {
  const { data, error } = await apiRequest(`/api/recurring-transactions/${recurringId}`, getToken, {
    method: 'PUT',
    body: JSON.stringify(recurringData),
  });
  return { data: data?.recurringTransaction, error };
}

/**
 * Delete recurring transaction
 */
export async function deleteRecurringTransaction(recurringId, getToken) {
  const { data, error } = await apiRequest(`/api/recurring-transactions/${recurringId}`, getToken, {
    method: 'DELETE',
  });
  return { data, error };
}

/**
 * Toggle recurring transaction active status
 */
export async function toggleRecurringTransaction(recurringId, getToken) {
  const { data, error } = await apiRequest(`/api/recurring-transactions/${recurringId}/toggle`, getToken, {
    method: 'POST',
  });
  return { data: data?.recurringTransaction, error };
}

/**
 * Get budgets for organization
 */
export async function getBudgets(organizationId, getToken) {
  const { data, error } = await apiRequest(
    `/api/budgets?organizationId=${organizationId}`,
    getToken
  );
  return { data: data?.budgets, error };
}

/**
 * Get budget status with spending comparison
 */
export async function getBudgetStatus(budgetId, getToken) {
  const { data, error } = await apiRequest(`/api/budgets/${budgetId}/status`, getToken);
  return { data, error };
}

/**
 * Create budget
 */
export async function createBudget(organizationId, budgetData, getToken) {
  const { data, error } = await apiRequest('/api/budgets', getToken, {
    method: 'POST',
    body: JSON.stringify({
      organizationId,
      ...budgetData,
    }),
  });
  return { data: data?.budget, error };
}

/**
 * Update budget
 */
export async function updateBudget(budgetId, budgetData, getToken) {
  const { data, error } = await apiRequest(`/api/budgets/${budgetId}`, getToken, {
    method: 'PUT',
    body: JSON.stringify(budgetData),
  });
  return { data: data?.budget, error };
}

/**
 * Delete budget
 */
export async function deleteBudget(budgetId, getToken) {
  const { data, error } = await apiRequest(`/api/budgets/${budgetId}`, getToken, {
    method: 'DELETE',
  });
  return { data, error };
}
