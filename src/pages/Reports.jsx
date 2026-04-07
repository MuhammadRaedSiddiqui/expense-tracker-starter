import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useOrganization } from '../hooks/useOrganization';
import { getTransactions } from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import { exportTransactionsToCSV, getExportFilename, exportReportToPDF, getPDFFilename } from '../lib/exportUtils';
import SpendingTrends from '../components/SpendingTrends';
import CategoryBreakdown from '../components/CategoryBreakdown';
import PeriodComparison from '../components/PeriodComparison';
import { useToast } from '../components/ToastContainer';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';

function Reports() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3); // Default: last 3 months
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadData = async () => {
    if (!organization) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getTransactions(organization.id, getToken);

      if (apiError) throw apiError;

      setTransactions(data || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
      captureException(err, { context: 'loadReportsData' });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return transactionDate >= start && transactionDate <= end;
  });

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;
  const transactionCount = filteredTransactions.length;

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleQuickRange = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleExportCSV = () => {
    const filename = getExportFilename('transactions', startDate, endDate);
    const success = exportTransactionsToCSV(filteredTransactions, filename);
    if (success) {
      toast.success('CSV exported successfully');
    } else {
      toast.warning('No transactions to export');
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);
      const filename = getPDFFilename(startDate, endDate);
      const title = `Financial Report (${startDate} to ${endDate})`;
      await exportReportToPDF('report-content', filename, title);
      toast.success('PDF exported successfully');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      captureException(err, { context: 'exportPDF' });
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-1">Reports & Analytics</h1>
          <p className="text-sm text-slate-500">
            Analyze your financial trends and patterns
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Date Range</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickRange(1)}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Last Month
            </button>
            <button
              onClick={() => handleQuickRange(3)}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Last 3 Months
            </button>
            <button
              onClick={() => handleQuickRange(6)}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Last 6 Months
            </button>
            <button
              onClick={() => handleQuickRange(12)}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Last Year
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="mb-6">
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </>
      ) : (
        <>
          {/* Report Content - Wrapped for PDF Export */}
          <div id="report-content">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Total Income</p>
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Total Expenses</p>
              <p className="text-2xl font-semibold text-rose-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Net Amount</p>
              <p className={`text-2xl font-semibold ${netAmount >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                {formatCurrency(netAmount)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Transactions</p>
              <p className="text-2xl font-semibold text-slate-900">{transactionCount}</p>
            </div>
          </div>

          {/* Period Comparison */}
          <div className="mb-6">
            <PeriodComparison transactions={transactions} startDate={startDate} endDate={endDate} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SpendingTrends transactions={filteredTransactions} />
            <CategoryBreakdown transactions={filteredTransactions} />
          </div>
          </div>
          {/* End Report Content */}

          {/* Export Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Export Data</h2>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exportingPDF ? 'Exporting PDF...' : 'Export as PDF'}
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
              >
                Export as CSV
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
