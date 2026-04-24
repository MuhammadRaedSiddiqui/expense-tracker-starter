import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ToastContainer';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import RecurringCard from './RecurringCard';
import RecurringTransactionModal from '@/components/RecurringTransactionModal';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { useRealtimeRecurring } from '@/integration/hooks/useRealtime';
import { getRecurringTransactions, createRecurringTransaction, updateRecurringTransaction } from '@/integration/api/apiClient';
import type { RecurringTransaction } from '@/types';

export default function RecurringTransactions() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { organization, loading: orgLoading } = useOrganization();
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);

  // Real-time recurring transactions
  const fetchRecurring = async () => {
    if (!organization) return [];
    const { data } = await getRecurringTransactions(organization.id, getToken);
    return data || [];
  };

  const { data: recurring, refetch } = useRealtimeRecurring(
    organization?.id,
    fetchRecurring,
    !!organization
  );

  // Mutation for creating recurring transaction
  const createRecurringMutation = useMutation({
    mutationFn: async (recurringData: any) => {
      if (!organization) throw new Error('No organization');
      const { data, error } = await createRecurringTransaction(organization.id, recurringData, getToken);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success('Recurring transaction created successfully');
      setShowRecurringModal(false);
      setEditingRecurring(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create recurring transaction');
    },
  });

  // Mutation for updating recurring transaction
  const updateRecurringMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await updateRecurringTransaction(id, data, getToken);
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      refetch();
      toast.success('Recurring transaction updated successfully');
      setShowRecurringModal(false);
      setEditingRecurring(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update recurring transaction');
    },
  });

  const handleRecurringSubmit = (data: any) => {
    if (editingRecurring) {
      updateRecurringMutation.mutate({ id: editingRecurring.id, data });
    } else {
      createRecurringMutation.mutate(data);
    }
  };

  const handleEditRecurring = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setShowRecurringModal(true);
  };

  const handleCreateRecurring = () => {
    setEditingRecurring(null);
    setShowRecurringModal(true);
  };

  const handleCloseModal = () => {
    setShowRecurringModal(false);
    setEditingRecurring(null);
  };

  const stats = useMemo(() => {
    if (!recurring) return { totalMonthly: 0, activeCount: 0, nextBilling: null };

    const active = recurring.filter((r) => r.is_active);

    // Calculate total monthly recurring (convert all to monthly equivalent)
    const totalMonthly = active.reduce((sum, r) => {
      const amount = parseFloat(r.amount.toString());
      switch (r.frequency) {
        case 'daily':
          return sum + amount * 30;
        case 'weekly':
          return sum + amount * 4;
        case 'monthly':
          return sum + amount;
        case 'yearly':
          return sum + amount / 12;
        default:
          return sum;
      }
    }, 0);

    // Find next billing date
    const nextBilling = active
      .map((r) => new Date(r.next_execution_date))
      .sort((a, b) => a.getTime() - b.getTime())[0];

    return {
      totalMonthly,
      activeCount: active.length,
      nextBilling,
    };
  }, [recurring]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleUpdate = () => {
    refetch();
  };

  if (orgLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-surface-container rounded-lg"></div>
          <div className="grid grid-cols-4 gap-6">
            <div className="h-48 bg-surface-container rounded-lg"></div>
            <div className="h-48 bg-surface-container rounded-lg"></div>
            <div className="h-48 bg-surface-container rounded-lg"></div>
            <div className="h-48 bg-surface-container rounded-lg"></div>
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
      <div className="space-y-12">
        <section id="recurring">
          <PageHeader subtitle="Treasury Automation" title="Recurring Transactions">
            <button
              onClick={handleCreateRecurring}
              className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-dim transition-all"
            >
              <span className="material-symbols-outlined text-sm" data-icon="add">
                add
              </span>
              NEW AUTOMATION
            </button>
          </PageHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            {recurring && recurring.length > 0 ? (
              recurring.map((r) => (
                <RecurringCard key={r.id} recurring={r} onUpdate={handleUpdate} onEdit={handleEditRecurring} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-on-surface-variant">
                No recurring transactions yet
              </div>
            )}

            {/* Ghost Card */}
            <button
              onClick={handleCreateRecurring}
              className="bg-surface-container-lowest/50 p-6 rounded-lg border-[2px] border-dashed border-outline-variant/30 hover:border-primary hover:bg-surface-container-lowest transition-all group h-full flex flex-col items-center justify-center text-center"
            >
              <div className="p-4 bg-surface-container rounded-full mb-4 group-hover:bg-primary-container transition-colors">
                <span
                  className="material-symbols-outlined text-on-surface-variant group-hover:text-primary"
                  data-icon="add"
                >
                  add
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-1">New Automation</h3>
              <p className="text-xs text-on-surface-variant px-4">
                Schedule a recurring payment or subscription
              </p>
            </button>
          </div>

          {/* Monthly Commitment Overview */}
          <div className="mt-6 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
              <div className="flex flex-col gap-1 pb-4 md:pb-0 md:pr-6">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  TOTAL MONTHLY RECURRING
                </p>
                <p className="text-[20px] font-bold text-on-surface tabular-nums">
                  {formatCurrency(stats.totalMonthly)}
                </p>
              </div>
              <div className="flex flex-col gap-1 py-4 md:py-0 md:px-6">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  ACTIVE AUTOMATIONS
                </p>
                <p className="text-[20px] font-bold text-on-surface">
                  {stats.activeCount} Active
                </p>
              </div>
              <div className="flex flex-col gap-1 pt-4 md:pt-0 md:pl-6">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  NEXT BILLING
                </p>
                <p className="text-[20px] font-bold text-on-surface">
                  {formatDate(stats.nextBilling)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showRecurringModal && (
        <RecurringTransactionModal
          recurringTransaction={editingRecurring}
          onClose={handleCloseModal}
          onSubmit={handleRecurringSubmit}
        />
      )}
    </AppLayout>
  );
}
