import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ToastContainer';
import AppLayout from '@/components/layout/AppLayout';
import SpendingTrends from './SpendingTrends';
import CategoryDonut from './CategoryDonut';
import PeriodComparison from './PeriodComparison';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { useTransactions } from '@/hooks/useTransactions';
import { exportTransactionsToCSV, exportReportToPDF } from '@/integration/utils/exportUtils';

export default function Reports() {
  const navigate = useNavigate();
  const toast = useToast();
  const { organization, loading: orgLoading } = useOrganization();

  // Use React Query hook (cached)
  const { data: transactions, isLoading } = useTransactions(organization?.id);

  const handleExportPDF = async () => {
    try {
      await exportReportToPDF('reports-container', 'financial-report.pdf', 'Financial Performance Report');
      toast.success('Report exported successfully');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      toast.warning('No data to export');
      return;
    }
    exportTransactionsToCSV(transactions, 'financial-report.csv');
    toast.success('Report exported successfully');
  };

  if (orgLoading || isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-surface-container rounded-lg"></div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 h-96 bg-surface-container rounded-lg"></div>
            <div className="col-span-4 h-96 bg-surface-container rounded-lg"></div>
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
      <div id="reports-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
              Analytics Suite
            </span>
            <h1 className="text-4xl font-black tracking-tight text-on-surface">Fiscal Performance</h1>
            <p className="text-on-surface-variant max-w-md">
              Comprehensive analysis of spending patterns and budget variance for the current fiscal period.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant/30 text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="picture_as_pdf">
                  picture_as_pdf
                </span>{' '}
                PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant/30 text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="description">
                  description
                </span>{' '}
                CSV
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <SpendingTrends transactions={transactions || []} />
          <CategoryDonut transactions={transactions || []} />
          <PeriodComparison transactions={transactions || []} />

          <div className="col-span-12 py-6 px-4 flex justify-between items-center opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" data-icon="verified_user">
                verified_user
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Data</span>
            </div>
            <span className="text-[10px] font-medium">
              Updated: {new Date().toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
