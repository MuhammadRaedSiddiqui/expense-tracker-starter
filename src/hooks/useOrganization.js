import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getUserOrganization, getTransactions } from '../lib/apiClient';

/**
 * Custom hook to manage organization state and transaction loading
 * @returns {Object} { organization, transactions, loading, error, refetch }
 */
export function useOrganization() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      setOrganization(org);

      // If organization exists, fetch transactions
      if (org) {
        const { data: txns, error: txnError } = await getTransactions(org.id, getToken);

        if (txnError) throw txnError;

        setTransactions(txns || []);
      }
    } catch (err) {
      console.error('Error fetching organization data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, isLoaded]);

  return {
    organization,
    transactions,
    loading,
    error,
    refetch: fetchData,
  };
}
