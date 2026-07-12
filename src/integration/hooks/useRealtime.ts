import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Transaction, RecurringTransaction, OrganizationMember, Invitation } from '@/types';

interface SubscriptionConfig {
  table: string;
  filter: string;
  channelName: string;
}

function useRealtimeSubscription<T>(
  organizationId: string | undefined,
  fetchFunction: () => Promise<T>,
  subscriptions: SubscriptionConfig[],
  enabled = true
) {
  const [data, setData] = useState<T | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refetch = useCallback(() => {
    if (!enabled || !organizationId) return;
    fetchFunction()
      .then(setData)
      .catch((err) => setError(err.message));
  }, [fetchFunction, enabled, organizationId]);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    let mounted = true;

    fetchFunction()
      .then((result) => { if (mounted) setData(result); })
      .catch((err) => { if (mounted) setError(err.message); });

    let channel = supabase.channel(subscriptions[0].channelName);

    for (const sub of subscriptions) {
      channel = channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: sub.table,
          filter: sub.filter,
        },
        () => {
          fetchFunction().then((result) => { if (mounted) setData(result); });
        }
      );
    }

    channel.subscribe((status) => {
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
        fetchFunction().then((result) => { if (mounted) setData(result); });
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

export function useRealtimeTransactions(
  organizationId: string | undefined,
  fetchFunction: () => Promise<Transaction[]>,
  enabled = true
) {
  return useRealtimeSubscription(
    organizationId,
    fetchFunction,
    [{
      table: 'transactions',
      filter: `organization_id=eq.${organizationId}`,
      channelName: `transactions:${organizationId}`,
    }],
    enabled
  );
}

export function useRealtimeRecurring(
  organizationId: string | undefined,
  fetchFunction: () => Promise<RecurringTransaction[]>,
  enabled = true
) {
  return useRealtimeSubscription(
    organizationId,
    fetchFunction,
    [{
      table: 'recurring_transactions',
      filter: `organization_id=eq.${organizationId}`,
      channelName: `recurring:${organizationId}`,
    }],
    enabled
  );
}

export function useRealtimeTeam(
  organizationId: string | undefined,
  fetchMembersFunction: () => Promise<OrganizationMember[]>,
  fetchInvitationsFunction: () => Promise<Invitation[]>,
  enabled = true
) {
  const combinedFetch = useCallback(async () => {
    const [members, invitations] = await Promise.all([
      fetchMembersFunction(),
      fetchInvitationsFunction(),
    ]);
    return { members, invitations };
  }, [fetchMembersFunction, fetchInvitationsFunction]);

  const result = useRealtimeSubscription(
    organizationId,
    combinedFetch,
    [
      {
        table: 'organization_members',
        filter: `organization_id=eq.${organizationId}`,
        channelName: `team:${organizationId}`,
      },
      {
        table: 'invitations',
        filter: `organization_id=eq.${organizationId}`,
        channelName: `team:${organizationId}`,
      },
    ],
    enabled
  );

  return {
    members: result.data?.members ?? null,
    invitations: result.data?.invitations ?? null,
    isRealtime: result.isRealtime,
    error: result.error,
    refetch: result.refetch,
  };
}
