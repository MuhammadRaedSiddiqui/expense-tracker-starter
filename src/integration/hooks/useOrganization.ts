import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getUserOrganization } from '../api/apiClient';
import type { UseOrganizationReturn } from '@/types';

/**
 * Custom hook to manage organization state
 * Note: Transaction fetching removed - use useTransactions hook instead
 */
export function useOrganization(): UseOrganizationReturn {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [organization, setOrganization] = useState<UseOrganizationReturn['organization']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user's organization via API
      const { data: org, error: orgError } = await getUserOrganization(getToken);

      if (orgError) throw orgError;

      // Batch state updates to reduce re-renders
      setOrganization(org);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching organization data:', err);
      setError((err as Error).message || 'Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, isLoaded]);

  return {
    organization,
    transactions: [], // Deprecated - use useTransactions hook instead
    loading,
    error,
    refetch: fetchData,
  };
}
