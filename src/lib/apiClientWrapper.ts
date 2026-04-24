import { useAuth } from '@clerk/clerk-react';
import * as api from './apiClient';

/**
 * TypeScript wrapper for API client that automatically injects getToken
 */
class ApiClient {
  private getToken: () => Promise<string | null>;

  constructor(getToken: () => Promise<string | null>) {
    this.getToken = getToken;
  }

  // Organizations
  async getUserOrganization() {
    const { data, error } = await api.getUserOrganization(this.getToken);
    if (error) throw error;
    return data;
  }

  async createOrganization(name: string) {
    const { data, error } = await api.createOrganization(name, this.getToken);
    if (error) throw error;
    return data;
  }

  // Transactions
  async getTransactions(organizationId: string) {
    const { data, error } = await api.getTransactions(organizationId, this.getToken);
    if (error) throw error;
    return data || [];
  }

  async createTransaction(organizationId: string, transactionData: any) {
    const { data, error } = await api.createTransaction(
      organizationId,
      '', // userId not needed, extracted from JWT
      transactionData,
      this.getToken
    );
    if (error) throw error;
    return data;
  }

  async updateTransaction(transactionId: string, transactionData: any) {
    const { data, error } = await api.updateTransaction(transactionId, transactionData, this.getToken);
    if (error) throw error;
    return data;
  }

  async deleteTransaction(transactionId: string) {
    const { data, error } = await api.deleteTransaction(transactionId, this.getToken);
    if (error) throw error;
    return data;
  }

  async deleteAllTransactions(organizationId: string) {
    const { data, error } = await api.deleteAllTransactions(organizationId, this.getToken);
    if (error) throw error;
    return data;
  }

  // Members
  async getMembers(organizationId: string) {
    const { data, error } = await api.getMembers(organizationId, this.getToken);
    if (error) throw error;
    return data || [];
  }

  async updateMemberRole(memberId: string, role: string) {
    const { data, error } = await api.updateMemberRole(memberId, role, this.getToken);
    if (error) throw error;
    return data;
  }

  async removeMember(memberId: string) {
    const { data, error } = await api.removeMember(memberId, this.getToken);
    if (error) throw error;
    return data;
  }

  // Invitations
  async getInvitations(organizationId: string) {
    const { data, error } = await api.getInvitations(organizationId, this.getToken);
    if (error) throw error;
    return data || [];
  }

  async createInvitation(organizationId: string, email: string, role: string) {
    const { data, error } = await api.createInvitation(organizationId, email, role, this.getToken);
    if (error) throw error;
    return data;
  }

  async acceptInvitation(token: string) {
    const { data, error } = await api.acceptInvitation(token, this.getToken);
    if (error) throw error;
    return data;
  }

  async revokeInvitation(invitationId: string) {
    const { data, error } = await api.revokeInvitation(invitationId, this.getToken);
    if (error) throw error;
    return data;
  }

  // Recurring Transactions
  async getRecurringTransactions(organizationId: string) {
    const { data, error } = await api.getRecurringTransactions(organizationId, this.getToken);
    if (error) throw error;
    return data || [];
  }

  async createRecurringTransaction(organizationId: string, recurringData: any) {
    const { data, error } = await api.createRecurringTransaction(
      organizationId,
      recurringData,
      this.getToken
    );
    if (error) throw error;
    return data;
  }

  async updateRecurringTransaction(recurringId: string, recurringData: any) {
    const { data, error } = await api.updateRecurringTransaction(
      recurringId,
      recurringData,
      this.getToken
    );
    if (error) throw error;
    return data;
  }

  async deleteRecurringTransaction(recurringId: string) {
    const { data, error } = await api.deleteRecurringTransaction(recurringId, this.getToken);
    if (error) throw error;
    return data;
  }

  async toggleRecurringTransaction(recurringId: string) {
    const { data, error } = await api.toggleRecurringTransaction(recurringId, this.getToken);
    if (error) throw error;
    return data;
  }

  // Budgets
  async getBudgets(organizationId: string) {
    const { data, error } = await api.getBudgets(organizationId, this.getToken);
    if (error) throw error;
    return data || [];
  }

  async getBudgetStatus(budgetId: string) {
    const { data, error } = await api.getBudgetStatus(budgetId, this.getToken);
    if (error) throw error;
    return data;
  }

  async createBudget(organizationId: string, budgetData: any) {
    const { data, error } = await api.createBudget(organizationId, budgetData, this.getToken);
    if (error) throw error;
    return data;
  }

  async updateBudget(budgetId: string, budgetData: any) {
    const { data, error } = await api.updateBudget(budgetId, budgetData, this.getToken);
    if (error) throw error;
    return data;
  }

  async deleteBudget(budgetId: string) {
    const { data, error } = await api.deleteBudget(budgetId, this.getToken);
    if (error) throw error;
    return data;
  }
}

/**
 * Hook to get an authenticated API client instance
 */
export function useApiClient() {
  const { getToken } = useAuth();
  return new ApiClient(getToken);
}

export default ApiClient;
