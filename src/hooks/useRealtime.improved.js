import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for real-time transactions with polling fallback
 * Uses ref pattern to avoid stale closures while preventing unnecessary re-subscriptions
 */
export function useRealtimeTransactions(organizationId, fetchFunction, enabled = true) {
  const [data, setData] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const fetchFunctionRef = useRef(fetchFunction);

  // Keep fetchFunction ref up to date
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  // Expose refetch method for manual updates
  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    fetchFunctionRef.current().then((result) => {
      setData(result);
    });
  }, [enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    // Initial fetch
    fetchFunctionRef.current().then((result) => {
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
          // Use ref to always get latest fetchFunction
          fetchFunctionRef.current().then((result) => {
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
      if (pollingIntervalRef.current) return;

      pollingIntervalRef.current = setInterval(() => {
        fetchFunctionRef.current().then((result) => {
          if (mounted) setData(result);
        });
      }, 30000);
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
  }, [organizationId, enabled]); // Now safe without fetchFunction

  return { data, isRealtime, refetch };
}

/**
 * Hook for real-time recurring transactions with polling fallback
 * Uses ref pattern to avoid stale closures
 */
export function useRealtimeRecurring(organizationId, fetchFunction, enabled = true) {
  const [data, setData] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const fetchFunctionRef = useRef(fetchFunction);

  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    fetchFunctionRef.current().then((result) => {
      setData(result);
    });
  }, [enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    fetchFunctionRef.current().then((result) => {
      if (mounted) setData(result);
    });

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
          fetchFunctionRef.current().then((result) => {
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
        fetchFunctionRef.current().then((result) => {
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
 * Uses ref pattern to avoid stale closures
 */
export function useRealtimeTeam(organizationId, fetchMembersFunction, fetchInvitationsFunction, enabled = true) {
  const [members, setMembers] = useState(null);
  const [invitations, setInvitations] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const fetchMembersRef = useRef(fetchMembersFunction);
  const fetchInvitationsRef = useRef(fetchInvitationsFunction);

  useEffect(() => {
    fetchMembersRef.current = fetchMembersFunction;
    fetchInvitationsRef.current = fetchInvitationsFunction;
  }, [fetchMembersFunction, fetchInvitationsFunction]);

  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    Promise.all([fetchMembersRef.current(), fetchInvitationsRef.current()]).then(
      ([membersResult, invitationsResult]) => {
        setMembers(membersResult);
        setInvitations(invitationsResult);
      }
    );
  }, [enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    Promise.all([fetchMembersRef.current(), fetchInvitationsRef.current()]).then(
      ([membersResult, invitationsResult]) => {
        if (mounted) {
          setMembers(membersResult);
          setInvitations(invitationsResult);
        }
      }
    );

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
          fetchMembersRef.current().then((result) => {
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
          fetchInvitationsRef.current().then((result) => {
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
        Promise.all([fetchMembersRef.current(), fetchInvitationsRef.current()]).then(
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
