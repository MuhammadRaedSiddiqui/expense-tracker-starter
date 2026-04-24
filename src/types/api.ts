// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// API request types
export interface CreateTransactionRequest {
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface UpdateTransactionRequest {
  amount?: number;
  currency?: string;
  type?: 'income' | 'expense';
  category?: string;
  description?: string;
  date?: string;
}

export interface CreateBudgetRequest {
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
}

export interface CreateRecurringTransactionRequest {
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_execution_date: string;
  end_date?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}
