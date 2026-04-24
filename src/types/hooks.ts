// Hook return types
export interface UseOrganizationReturn {
  organization: import('./models').Organization | null;
  transactions: import('./models').Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseRealtimeReturn<T> {
  data: T | null;
  isRealtime: boolean;
  error: string | null;
}
