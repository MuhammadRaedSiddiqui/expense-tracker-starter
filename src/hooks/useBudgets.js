import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { getBudgets } from '../integration/api/apiClient';

/**
 * Hook to fetch and cache budgets for an organization
 * Automatically caches for 5 minutes to prevent unnecessary API calls
 */
export function useBudgets(organizationId) {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: ['budgets', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      const { data, error } = await getBudgets(organizationId, getToken);
      if (error) throw error;
      return data || [];
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    budgets: query.data || [],
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
