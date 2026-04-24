import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ToastContainer';
import AppLayout from '@/components/layout/AppLayout';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { useTransactions } from '@/hooks/useTransactions';
import { exportTransactionsToCSV, exportReportToPDF } from '@/integration/utils/exportUtils';

export default function ReportsFixed() {
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
      <div id="reports-container" className="p-8 max-w-7xl mx-auto w-full flex-grow">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Analytics Suite</span>
            <h1 className="text-4xl font-black tracking-tight text-on-surface">Fiscal Performance</h1>
            <p className="text-on-surface-variant max-w-md">Comprehensive analysis of spending patterns and budget variance for the current fiscal period.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-high p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold bg-surface-container-lowest text-secondary shadow-sm rounded">Q3 2023</button>
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Custom Range</button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant/30 text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="picture_as_pdf">picture_as_pdf</span>
                PDF
              </button>
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant/30 text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="description">description</span>
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Spending Trends (Large Chart) */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border-b-4 border-secondary/20 relative min-h-[420px]">
            <div className="p-8 pb-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">Time Series</span>
                  <h3 className="text-xl font-bold tracking-tight">Spending Trends</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black tabular-nums tracking-tighter text-on-surface">$142,850.00</div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase">Total Gross Outflow</div>
                </div>
              </div>
            </div>
            {/* Spending Trends: Data Content or Empty State Container */}
            <div className="relative h-[300px] w-full px-8 pb-8 flex flex-col justify-center items-center">
              {(!transactions || transactions.length === 0) ? (
                /* Empty State Overlay */
                <div className="flex flex-col items-center text-center max-w-xs z-10">
                  <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-secondary text-3xl" data-icon="bar_chart">bar_chart</span>
                  </div>
                  <h4 className="text-base font-bold text-on-surface mb-1">No spending data for this period</h4>
                  <p className="text-xs text-on-surface-variant mb-6">Try selecting a different date range or add your first transaction.</p>
                  <button className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-secondary-dim transition-colors">
                    <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                    Add Transaction
                  </button>
                </div>
              ) : (
                /* Simulated Chart Bars */
                <div className="absolute inset-x-8 bottom-8 top-0 flex items-end justify-between gap-4 opacity-50">
                  <div className="flex-1 bg-slate-200 h-[30%] rounded-t-sm"></div>
                  <div className="flex-1 bg-slate-200 h-[45%] rounded-t-sm"></div>
                  <div className="flex-1 bg-slate-200 h-[35%] rounded-t-sm"></div>
                  <div className="flex-1 bg-slate-200 h-[65%] rounded-t-sm"></div>
                  <div className="flex-1 bg-slate-200 h-[50%] rounded-t-sm"></div>
                  <div className="flex-1 bg-secondary h-[80%] rounded-t-sm"></div>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown (Donut Chart) */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-8 left-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">Distribution</span>
              <h3 className="text-xl font-bold tracking-tight">Category</h3>
            </div>
            {/* Circular Representation (SVG Donut) */}
            <div className="relative w-48 h-48 mt-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                <circle className="text-surface-container-highest" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="24"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#5B5BD6" strokeDasharray="502.65" strokeDashoffset="140.74" strokeLinecap="butt" strokeWidth="24"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#64748B" strokeDasharray="502.65" strokeDashoffset="412.17" strokeLinecap="butt" strokeWidth="24" style={{ transformOrigin: 'center', transform: 'rotate(259.2deg)' }}></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#0D9488" strokeDasharray="502.65" strokeDashoffset="452.38" strokeLinecap="butt" strokeWidth="24" style={{ transformOrigin: 'center', transform: 'rotate(324deg)' }}></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Total</span>
                <span className="text-2xl font-black tabular-nums tracking-tighter">100%</span>
              </div>
            </div>
            <div className="w-full mt-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#5B5BD6' }}></div>
                  <span className="text-xs font-semibold">Operations</span>
                </div>
                <span className="text-xs font-black tabular-nums">72%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#64748B' }}></div>
                  <span className="text-xs font-semibold">Payroll</span>
                </div>
                <span className="text-xs font-black tabular-nums">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#0D9488' }}></div>
                  <span className="text-xs font-semibold">Marketing</span>
                </div>
                <span className="text-xs font-black tabular-nums">10%</span>
              </div>
            </div>
          </div>

          {/* Period Comparison Table */}
          <div className="col-span-12 bg-surface-container-lowest border-t-2 border-slate-100">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight">Period Comparison (MoM)</h3>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[10px] font-bold text-secondary uppercase"><span className="w-2 h-2 rounded-full bg-secondary"></span> Current</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant uppercase"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Previous</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-left">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-r border-outline-variant/10">Department</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-r border-outline-variant/10">May Actual</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-r border-outline-variant/10">June Actual</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-r border-outline-variant/10">Variance ($)</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-8 py-4 font-bold border-r border-outline-variant/10">Engineering & DevOps</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$45,200.00</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$48,750.00</td>
                    <td className="px-8 py-4 tabular-nums text-error font-medium border-r border-outline-variant/10">+$3,550.00</td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-error/10 text-error">
                        <span className="material-symbols-outlined text-xs mr-1" data-icon="north">north</span> 7.8%
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-8 py-4 font-bold border-r border-outline-variant/10">Sales & Marketing</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$12,800.00</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$11,200.00</td>
                    <td className="px-8 py-4 tabular-nums text-secondary font-medium border-r border-outline-variant/10">-$1,600.00</td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary">
                        <span className="material-symbols-outlined text-xs mr-1" data-icon="south">south</span> 12.5%
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-8 py-4 font-bold border-r border-outline-variant/10">Infrastructure</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$33,450.00</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$32,100.00</td>
                    <td className="px-8 py-4 tabular-nums text-secondary font-medium border-r border-outline-variant/10">-$1,350.00</td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary">
                        <span className="material-symbols-outlined text-xs mr-1" data-icon="south">south</span> 4.1%
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-8 py-4 font-bold border-r border-outline-variant/10">Executive Payroll</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$22,000.00</td>
                    <td className="px-8 py-4 tabular-nums border-r border-outline-variant/10">$22,000.00</td>
                    <td className="px-8 py-4 tabular-nums text-on-surface-variant border-r border-outline-variant/10">$0.00</td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-on-surface-variant uppercase">
                        Flat
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footnote / Methodology */}
        <div className="py-12 flex justify-between items-center opacity-50 grayscale hover:grayscale-0 transition-all border-t border-outline-variant/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" data-icon="verified_user">verified_user</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Audited Fiscal Data</span>
          </div>
          <span className="text-[10px] font-medium">Updated: 2023-06-30 23:59:59 UTC</span>
        </div>
      </div>
    </AppLayout>
  );
}
