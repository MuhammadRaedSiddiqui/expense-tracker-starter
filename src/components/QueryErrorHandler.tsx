import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './ToastContainer';
import { onApiError } from '../lib/apiClient';

const DEDUPE_WINDOW_MS = 3000;

export function QueryErrorHandler() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const recentErrors = useRef(new Map());

  function showError(message: string) {
    const now = Date.now();
    const lastShown = recentErrors.current.get(message);
    if (lastShown && now - lastShown < DEDUPE_WINDOW_MS) return;

    recentErrors.current.set(message, now);
    toast.error(message);

    for (const [key, time] of recentErrors.current) {
      if (now - time > DEDUPE_WINDOW_MS * 2) {
        recentErrors.current.delete(key);
      }
    }
  }

  // Subscribe to React Query cache errors (useTransactions, useBudgets, etc.)
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== 'updated' || event.action?.type !== 'error') return;
      const error = event.action.error;
      showError(error?.message || 'Something went wrong. Please try again.');
    });

    return unsubscribe;
  }, [queryClient, toast]);

  // Subscribe to API client error bus (realtime hooks, manual fetches)
  useEffect(() => {
    return onApiError((error) => {
      showError(error?.message || 'Something went wrong. Please try again.');
    });
  }, [toast]);

  return null;
}
