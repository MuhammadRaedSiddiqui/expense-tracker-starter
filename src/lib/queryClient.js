import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
    },
    mutations: {
      retry: 0,
    },
  },
});

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'EXPENSE_TRACKER_CACHE',
});
