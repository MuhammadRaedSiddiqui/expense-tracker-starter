// Core data models
export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  subscription_tier?: string;
}

export interface Transaction {
  id: string;
  organization_id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  attachment_url?: string;
}

export interface Budget {
  id: string;
  organization_id: string;
  category: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringTransaction {
  id: string;
  organization_id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_execution_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
}

export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invited_by: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface Category {
  id: string;
  organization_id: string;
  name: string;
  type: 'income' | 'expense';
  created_at: string;
}
