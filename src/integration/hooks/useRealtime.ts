import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Transaction, RecurringTransaction, OrganizationMember, Invitation } from '@/types';

/**
 * Hook for real-time transactions with polling fallback
 */
export function useRealtimeTransactions(
  organizationId: string | undefined,
  fetchFunction: () => Promise<Transaction[]>,
  enabled = true
) {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    fetchFunction().then((result) => {
      setData(result);
    }).catch((err) => {
      setError(err.message);
    });
  }, [fetchFunction, enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    // Initial fetch
    fetchFunction().then((result) => {
      if (mounted) setData(result);
    }).catch((err) => {
      if (mounted) setError(err.message);
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
  }, [organizationId, enabled, fetchFunction]);

  return { data, isRealtime, error, refetch };
}

/**
 * Hook for real-time recurring transactions with polling fallback
 */
export function useRealtimeRecurring(
  organizationId: string | undefined,
  fetchFunction: () => Promise<RecurringTransaction[]>,
  enabled = true
) {
  const [data, setData] = useState<RecurringTransaction[] | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    fetchFunction().then((result) => {
      setData(result);
    }).catch((err) => {
      setError(err.message);
    });
  }, [fetchFunction, enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    fetchFunction().then((result) => {
      if (mounted) setData(result);
    }).catch((err) => {
      if (mounted) setError(err.message);
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
  }, [organizationId, enabled, fetchFunction]);

  return { data, isRealtime, error, refetch };
}

/**
 * Hook for real-time team updates (members and invitations) with polling fallback
 */
export function useRealtimeTeam(
  organizationId: string | undefined,
  fetchMembersFunction: () => Promise<OrganizationMember[]>,
  fetchInvitationsFunction: () => Promise<Invitation[]>,
  enabled = true
) {
  const [members, setMembers] = useState<OrganizationMember[] | null>(null);
  const [invitations, setInvitations] = useState<Invitation[] | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    Promise.all([fetchMembersFunction(), fetchInvitationsFunction()])
      .then(([membersResult, invitationsResult]) => {
        setMembers(membersResult);
        setInvitations(invitationsResult);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [fetchMembersFunction, fetchInvitationsFunction, enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    Promise.all([fetchMembersFunction(), fetchInvitationsFunction()])
      .then(([membersResult, invitationsResult]) => {
        if (mounted) {
          setMembers(membersResult);
          setInvitations(invitationsResult);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      });

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
  }, [organizationId, enabled, fetchMembersFunction, fetchInvitationsFunction]);

  return { members, invitations, isRealtime, error, refetch };
}
