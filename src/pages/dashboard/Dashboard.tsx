import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePostHog } from '@posthog/react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import CommandModal from '@/components/CommandModal';
import BudgetAlert from './BudgetAlert';
import MetricsRow from './MetricsRow';
import PerformanceChart from './PerformanceChart';
import LiveFeed from './LiveFeed';
import AllocationSidebar from './AllocationSidebar';
import RecentLedger from './RecentLedger';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { useTransactions } from '@/hooks/useTransactions';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';

export default function Dashboard() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const { organization, loading: orgLoading } = useOrganization();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use React Query hook with realtime polling
  const { data: transactions, isLoading, isRealtime, refetch } = useTransactions(
    organization?.id,
    true // Enable realtime polling
  );

  // Memoize transactions array to prevent child re-renders
  const memoizedTransactions = useMemo(() => transactions || [], [transactions]);

  // Track page view
  useEffect(() => {
    if (organization) {
      posthog?.capture('dashboard_viewed', {
        organization_id: organization.id,
        organization_name: organization.name,
      });
    }
  }, [organization, posthog]);

  // Memoize callbacks to prevent child re-renders
  const handleTransactionSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (orgLoading || isLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
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
      <div className="space-y-6">
        <BudgetAlert organizationId={organization.id} />
        <MetricsRow transactions={memoizedTransactions} isRealtime={isRealtime} />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PerformanceChart transactions={memoizedTransactions} />
            <LiveFeed transactions={memoizedTransactions} />
          </div>
          <AllocationSidebar organizationId={organization.id} />
        </section>

        <RecentLedger
          transactions={memoizedTransactions}
          onAddTransaction={handleOpenModal}
        />
      </div>

      {isModalOpen && (
        <CommandModal
          onClose={handleCloseModal}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </AppLayout>
  );
}
