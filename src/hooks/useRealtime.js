import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for real-time transactions with polling fallback
 * @param {string} organizationId - Organization ID to filter transactions
 * @param {Function} fetchFunction - Function to fetch transactions from API
 * @param {boolean} enabled - Whether to enable real-time updates
 */
export function useRealtimeTransactions(organizationId, fetchFunction, enabled = true) {
  const [data, setData] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Expose refetch method for manual updates
  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    fetchFunction().then((result) => {
      setData(result);
    });
  }, [fetchFunction, enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    // Initial fetch
    fetchFunction().then((result) => {
      if (mounted) setData(result);
    });

    // Try to establish real-time subscription
    const channel = supabase
      .channel(`transactions:${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          console.log('[Realtime] Transaction change:', payload.eventType);
          // Refetch data when change detected
          fetchFunction().then((result) => {
            if (mounted) setData(result);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Transactions subscription active');
          if (mounted) setIsRealtime(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[Realtime] Subscription failed, falling back to polling');
          if (mounted) {
            setIsRealtime(false);
            startPolling();
          }
        }
      });

    subscriptionRef.current = channel;

    // Fallback polling (starts if real-time fails)
    function startPolling() {
      if (pollingIntervalRef.current) return; // Already polling

      pollingIntervalRef.current = setInterval(() => {
        fetchFunction().then((result) => {
          if (mounted) setData(result);
        });
      }, 30000); // Poll every 30 seconds
    }

    // Cleanup
    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [organizationId, enabled]);

  return { data, isRealtime, refetch };
}

/**
 * Hook for real-time recurring transactions with polling fallback
 */
export function useRealtimeRecurring(organizationId, fetchFunction, enabled = true) {
  const [data, setData] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Expose refetch method for manual updates
  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    fetchFunction().then((result) => {
      setData(result);
    });
  }, [fetchFunction, enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    // Initial fetch
    fetchFunction().then((result) => {
      if (mounted) setData(result);
    });

    // Try to establish real-time subscription
    const channel = supabase
      .channel(`recurring:${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recurring_transactions',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          console.log('[Realtime] Recurring transaction change:', payload.eventType);
          fetchFunction().then((result) => {
            if (mounted) setData(result);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Recurring transactions subscription active');
          if (mounted) setIsRealtime(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[Realtime] Subscription failed, falling back to polling');
          if (mounted) {
            setIsRealtime(false);
            startPolling();
          }
        }
      });

    subscriptionRef.current = channel;

    function startPolling() {
      if (pollingIntervalRef.current) return;

      pollingIntervalRef.current = setInterval(() => {
        fetchFunction().then((result) => {
          if (mounted) setData(result);
        });
      }, 30000);
    }

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [organizationId, enabled]);

  return { data, isRealtime, refetch };
}

/**
 * Hook for real-time team updates (members and invitations) with polling fallback
 */
export function useRealtimeTeam(organizationId, fetchMembersFunction, fetchInvitationsFunction, enabled = true) {
  const [members, setMembers] = useState(null);
  const [invitations, setInvitations] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Expose refetch method for manual updates
  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    Promise.all([fetchMembersFunction(), fetchInvitationsFunction()]).then(
      ([membersResult, invitationsResult]) => {
        setMembers(membersResult);
        setInvitations(invitationsResult);
      }
    );
  }, [fetchMembersFunction, fetchInvitationsFunction, enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    // Initial fetch
    Promise.all([fetchMembersFunction(), fetchInvitationsFunction()]).then(
      ([membersResult, invitationsResult]) => {
        if (mounted) {
          setMembers(membersResult);
          setInvitations(invitationsResult);
        }
      }
    );

    // Try to establish real-time subscription for both tables
    const channel = supabase
      .channel(`team:${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_members',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          console.log('[Realtime] Member change:', payload.eventType);
          fetchMembersFunction().then((result) => {
            if (mounted) setMembers(result);
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invitations',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          console.log('[Realtime] Invitation change:', payload.eventType);
          fetchInvitationsFunction().then((result) => {
            if (mounted) setInvitations(result);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Team subscription active');
          if (mounted) setIsRealtime(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[Realtime] Subscription failed, falling back to polling');
          if (mounted) {
            setIsRealtime(false);
            startPolling();
          }
        }
      });

    subscriptionRef.current = channel;

    function startPolling() {
      if (pollingIntervalRef.current) return;

      pollingIntervalRef.current = setInterval(() => {
        Promise.all([fetchMembersFunction(), fetchInvitationsFunction()]).then(
          ([membersResult, invitationsResult]) => {
            if (mounted) {
              setMembers(membersResult);
              setInvitations(invitationsResult);
            }
          }
        );
      }, 30000);
    }

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [organizationId, enabled]);

  return { members, invitations, isRealtime, refetch };
}
