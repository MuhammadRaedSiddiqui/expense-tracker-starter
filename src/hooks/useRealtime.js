import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

function useRealtimeSubscription({ table, filter, fetchFn, enabled = true }) {
  const [data, setData] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const refetch = useCallback(() => {
    if (!enabled) return;
    fetchFn().then(setData);
  }, [fetchFn, enabled]);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    fetchFn().then((result) => {
      if (mounted) setData(result);
    });

    const channel = supabase
      .channel(`${table}:${filter}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `organization_id=eq.${filter}`,
        },
        () => {
          fetchFn().then((result) => {
            if (mounted) setData(result);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          if (mounted) setIsRealtime(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
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
        fetchFn().then((result) => {
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
  }, [table, filter, enabled]);

  return { data, isRealtime, refetch };
}

export function useRealtimeTransactions(organizationId, fetchFunction, enabled = true) {
  return useRealtimeSubscription({
    table: 'transactions',
    filter: organizationId,
    fetchFn: fetchFunction,
    enabled: enabled && !!organizationId,
  });
}

export function useRealtimeRecurring(organizationId, fetchFunction, enabled = true) {
  return useRealtimeSubscription({
    table: 'recurring_transactions',
    filter: organizationId,
    fetchFn: fetchFunction,
    enabled: enabled && !!organizationId,
  });
}

export function useRealtimeTeam(organizationId, fetchMembersFunction, fetchInvitationsFunction, enabled = true) {
  const [members, setMembers] = useState(null);
  const [invitations, setInvitations] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);

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

    Promise.all([fetchMembersFunction(), fetchInvitationsFunction()]).then(
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
        () => {
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
        () => {
          fetchInvitationsFunction().then((result) => {
            if (mounted) setInvitations(result);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          if (mounted) setIsRealtime(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
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
