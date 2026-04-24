import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ToastContainer';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import BudgetHealthBanner from './BudgetHealthBanner';
import BudgetCard from './BudgetCard';
import BudgetModal from '@/components/BudgetModal';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { useTransactions } from '@/hooks/useTransactions';
import { getBudgets, createBudget, updateBudget } from '@/integration/api/apiClient';
import { exportBudgetsToCSV } from '@/integration/utils/exportBudgets';
import type { Budget } from '@/types';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Budgets() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { organization, loading: orgLoading } = useOrganization();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [quarterFilter, setQuarterFilter] = useState<string | null>(null);



  // Use React Query for transactions (cached)
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(organization?.id);

  // Use React Query for budgets
  const { data: budgets = [], isLoading: budgetsLoading, refetch: refetchBudgets } = useQuery({
    queryKey: ['budgets', organization?.id],
    queryFn: async () => {
      console.log('🔴 [Budgets] API CALL - Fetching budgets from server', {
        organizationId: organization?.id,
      });

      if (!organization) return [];
      const { data, error } = await getBudgets(organization.id, getToken);
      if (error) throw error;

      console.log('✅ [Budgets] Budgets API response', {
        count: data?.length || 0,
      });

      return data || [];
    },
    enabled: !!organization,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const loading = budgetsLoading || transactionsLoading;

  const budgetsWithSpending = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category &&
            new Date(t.date) >= new Date(budget.start_date) &&
            (!budget.end_date || new Date(t.date) <= new Date(budget.end_date))
        )
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

      const utilization = (spent / budget.amount) * 100;

      return { budget, spent, utilization };
    });
  }, [budgets, transactions]);

  // Mutation for creating budget
  const createBudgetMutation = useMutation({
    mutationFn: async (budgetData: any) => {
      if (!organization) throw new Error('No organization');
      const { data, error } = await createBudget(organization.id, budgetData, getToken);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', organization?.id] });
      toast.success('Budget created successfully');
      setShowBudgetModal(false);
      setEditingBudget(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create budget');
    },
  });

  // Mutation for updating budget
  const updateBudgetMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await updateBudget(id, data, getToken);
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', organization?.id] });
      toast.success('Budget updated successfully');
      setShowBudgetModal(false);
      setEditingBudget(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update budget');
    },
  });

  const handleBudgetDeleted = () => {
    // Refetch budgets using React Query
    refetchBudgets();
  };

  const handleBudgetSubmit = (data: any) => {
    if (editingBudget) {
      updateBudgetMutation.mutate({ id: editingBudget.id, data });
    } else {
      createBudgetMutation.mutate(data);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowBudgetModal(true);
  };

  const handleCreateBudget = () => {
    setEditingBudget(null);
    setShowBudgetModal(true);
  };

  const handleCloseModal = () => {
    setShowBudgetModal(false);
    setEditingBudget(null);
  };

  const handleExportBudgets = () => {
    if (!budgetsWithSpending || budgetsWithSpending.length === 0) {
      toast.warning('No budgets to export');
      return;
    }

    const success = exportBudgetsToCSV(budgetsWithSpending);
    if (success) {
      toast.success('Budgets exported successfully');
    } else {
      toast.error('Failed to export budgets');
    }
  };

  const handleQuarterFilter = () => {
    // Toggle Q4 filter
    setQuarterFilter(quarterFilter === 'Q4' ? null : 'Q4');
    toast.info('Quarter filtering coming soon!');
  };

  if (orgLoading || loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-surface-container rounded-lg"></div>
          <div className="h-32 bg-surface-container rounded-lg"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 bg-surface-container rounded-lg"></div>
            <div className="h-64 bg-surface-container rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!organization) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-outline" data-icon="corporate_fare">
                  corporate_fare
                </span>
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-2">No Organization Found</h2>
              <p className="text-sm text-on-surface-variant">
                Please create an organization to get started.
              </p>
            </div>
            <button
              onClick={() => navigate('/org-setup')}
              className="px-6 py-3 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-sm hover:bg-on-secondary-fixed-variant transition-all rounded-lg"
            >
              Create Organization
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <PageHeader subtitle="Fiscal Boundaries" title="Strategic Budgets">
          <button
            onClick={handleQuarterFilter}
            className="bg-surface-container px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Q4 OVERVIEW
          </button>
          <button
            onClick={handleExportBudgets}
            className="bg-surface-container px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            EXPORT DATA
          </button>
        </PageHeader>

        <BudgetHealthBanner budgets={budgetsWithSpending} />

        <section id="budgets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {budgetsWithSpending.map((b) => (
              <BudgetCard
                key={b.budget.id}
                budget={b.budget}
                spent={b.spent}
                onDelete={handleBudgetDeleted}
                onEdit={handleEditBudget}
              />
            ))}

            <button
              onClick={handleCreateBudget}
              className="border-2 border-dashed border-outline-variant/30 p-8 rounded-lg flex flex-col items-center justify-center text-center group hover:border-primary transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
                <span
                  className="material-symbols-outlined text-on-surface-variant group-hover:text-primary"
                  data-icon="add_chart"
                >
                  add_chart
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Create Budget</h3>
              <p className="text-xs text-on-surface-variant mt-2 max-w-[180px]">
                Set a new spending limit for a category.
              </p>
            </button>
          </div>
        </section>
      </div>

      {showBudgetModal && (
        <BudgetModal
          budget={editingBudget}
          onClose={handleCloseModal}
          onSubmit={handleBudgetSubmit}
        />
      )}
    </AppLayout>
  );
}
