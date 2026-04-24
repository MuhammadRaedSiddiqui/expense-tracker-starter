import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import {
  getTransactions as getTransactionsAPI,
  createTransaction as createTransactionAPI,
  updateTransaction as updateTransactionAPI,
  deleteTransaction as deleteTransactionAPI,
  deleteAllTransactions as deleteAllTransactionsAPI,
} from '../lib/supabaseQueries';

/**
 * Hook to fetch and cache transactions for an organization
 * Automatically caches for 5 minutes to prevent unnecessary API calls on navigation
 *
 * @param {string} organizationId - The organization ID to fetch transactions for
 * @param {boolean} enableRealtime - If true, polls every 30 seconds for updates
 */
export function useTransactions(organizationId, enableRealtime = false) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Query for fetching transactions
  const query = useQuery({
    queryKey: ['transactions', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      const { data, error } = await getTransactionsAPI(organizationId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
    refetchInterval: enableRealtime ? 30000 : false, // Poll every 30s if realtime enabled
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Mutation for creating transactions
  const createMutation = useMutation({
    mutationFn: async ({ organizationId, userId, transactionData }) => {
      const { data, error } = await createTransactionAPI(organizationId, userId, transactionData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions after creating
      queryClient.invalidateQueries({ queryKey: ['transactions', organizationId] });
    },
  });

  // Mutation for updating transactions
  const updateMutation = useMutation({
    mutationFn: async ({ transactionId, transactionData }) => {
      const { data, error } = await updateTransactionAPI(transactionId, transactionData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', organizationId] });
    },
  });

  // Mutation for deleting a single transaction
  const deleteMutation = useMutation({
    mutationFn: async (transactionId) => {
      const { data, error } = await deleteTransactionAPI(transactionId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', organizationId] });
    },
  });

  // Mutation for deleting all transactions
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await deleteAllTransactionsAPI(organizationId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', organizationId] });
    },
  });

  // Manual refetch function
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions', organizationId] });
  };

  return {
    // Query data
    transactions: query.data || [],
    data: query.data || [], // Alias for compatibility
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isRealtime: enableRealtime, // For compatibility with existing code

    // Mutations
    createTransaction: createMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    deleteAllTransactions: deleteAllMutation.mutateAsync,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDeletingAll: deleteAllMutation.isPending,

    // Manual refetch
    refetch,
  };
}

