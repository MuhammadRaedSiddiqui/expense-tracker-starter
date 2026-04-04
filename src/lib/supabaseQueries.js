import { supabase } from './supabase';

/**
 * Create a new organization and add the user as owner
 */
export async function createOrganization(userId, orgName) {
  try {
    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName,
        slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      })
      .select()
      .single();

    if (orgError) throw orgError;

    // Add user as owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: userId,
        role: 'owner',
        joined_at: new Date().toISOString(),
      });

    if (memberError) throw memberError;

    return { data: org, error: null };
  } catch (error) {
    console.error('Error creating organization:', error);
    return { data: null, error };
  }
}

/**
 * Get user's organization (first one for Phase 1)
 */
export async function getUserOrganization(userId) {
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .select('organization_id, organizations(*)')
      .eq('user_id', userId)
      .not('joined_at', 'is', null)
      .single();

    if (error) throw error;

    return { data: data?.organizations, error: null };
  } catch (error) {
    // User might not have an organization yet
    if (error.code === 'PGRST116') {
      return { data: null, error: null };
    }
    console.error('Error fetching organization:', error);
    return { data: null, error };
  }
}

/**
 * Get all transactions for an organization
 */
export async function getTransactions(organizationId) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('date', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: null, error };
  }
}

/**
 * Create a new transaction
 */
export async function createTransaction(organizationId, userId, transactionData) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        organization_id: organizationId,
        created_by: userId,
        description: transactionData.description,
        amount: transactionData.amount,
        currency: transactionData.currency || 'USD',
        type: transactionData.type,
        category: transactionData.category,
        date: transactionData.date,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { data: null, error };
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(transactionId, transactionData) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        description: transactionData.description,
        amount: transactionData.amount,
        currency: transactionData.currency,
        type: transactionData.type,
        category: transactionData.category,
        date: transactionData.date,
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { data: null, error };
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(transactionId) {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) throw error;

    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { data: null, error };
  }
}

/**
 * Delete all transactions for an organization
 */
export async function deleteAllTransactions(organizationId) {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('organization_id', organizationId);

    if (error) throw error;

    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting all transactions:', error);
    return { data: null, error };
  }
}

/**
 * Migrate localStorage transactions to Supabase
 */
export async function migrateLocalStorageData(organizationId, userId, transactions) {
  try {
    // Transform localStorage format to Supabase format
    const transformedTransactions = transactions.map(t => ({
      organization_id: organizationId,
      created_by: userId,
      description: t.description,
      amount: t.amount,
      currency: t.currency || 'USD',
      type: t.type,
      category: t.category,
      date: t.date,
    }));

    const { data, error } = await supabase
      .from('transactions')
      .insert(transformedTransactions)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
    return { data: null, error };
  }
}
