import { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Settings,
  Users,
  CreditCard,
  PieChart,
  Plus,
  ArrowRight,
  DollarSign,
  Activity,
  Wallet
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MetricCard } from './MetricCard';
import { AlertBanner } from './AlertBanner';
import { DataTable } from './DataTable';
import { StatusBadge } from './StatusBadge';
import { ChartCard, StitchLineChart, StitchPieChart } from './Charts';
import type { Transaction, DataTableColumn } from '../../types/stitch-components';

export default function Dashboard() {
  const [showAlert, setShowAlert] = useState(true);

  // Navigation items
  const navigationItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      href: '/dashboard',
      isActive: true
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Analytics',
      href: '/analytics',
      badge: 3
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Transactions',
      href: '/transactions'
    },
    {
      icon: <PieChart className="w-5 h-5" />,
      label: 'Budgets',
      href: '/budgets'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Reports',
      href: '/reports'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Team',
      href: '/team'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      href: '/settings'
    }
  ];

  // Mock data for metrics
  const metrics = [
    {
      label: 'Total Balance',
      value: '$124,563.00',
      trend: { value: 12.5, direction: 'up' as const, isPositive: true },
      icon: <Wallet className="w-5 h-5" />
    },
    {
      label: 'Monthly Revenue',
      value: '$45,231.00',
      trend: { value: 8.2, direction: 'up' as const, isPositive: true },
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      label: 'Monthly Expenses',
      value: '$32,450.00',
      trend: { value: 3.1, direction: 'down' as const, isPositive: true },
      icon: <Activity className="w-5 h-5" />
    }
  ];

  // Mock transaction data
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2026-04-18',
      description: 'Client Payment - Acme Corp',
      category: 'Revenue',
      amount: 15000,
      status: 'success',
      type: 'income'
    },
    {
      id: '2',
      date: '2026-04-17',
      description: 'Office Supplies',
      category: 'Operations',
      amount: -450,
      status: 'success',
      type: 'expense'
    },
    {
      id: '3',
      date: '2026-04-17',
      description: 'Software Subscription',
      category: 'Technology',
      amount: -299,
      status: 'pending',
      type: 'expense'
    },
    {
      id: '4',
      date: '2026-04-16',
      description: 'Consulting Services',
      category: 'Revenue',
      amount: 8500,
      status: 'success',
      type: 'income'
    },
    {
      id: '5',
      date: '2026-04-16',
      description: 'Marketing Campaign',
      category: 'Marketing',
      amount: -2100,
      status: 'success',
      type: 'expense'
    }
  ];

  // Mock data for line chart (Revenue Trend)
  const revenueData = [
    { name: 'Jan', value: 35000 },
    { name: 'Feb', value: 42000 },
    { name: 'Mar', value: 38000 },
    { name: 'Apr', value: 45000 },
    { name: 'May', value: 52000 },
    { name: 'Jun', value: 48000 },
  ];

  // Mock data for pie chart (Expense Breakdown)
  const expenseData = [
    { name: 'Operations', value: 12000, color: '#0ea5e9' },
    { name: 'Marketing', value: 8500, color: '#8b5cf6' },
    { name: 'Technology', value: 6200, color: '#ec4899' },
    { name: 'Salaries', value: 25000, color: '#f59e0b' },
    { name: 'Other', value: 3800, color: '#10b981' },
  ];

  // Table columns configuration
  const columns: DataTableColumn<Transaction>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    {
      key: 'description',
      header: 'Description'
    },
    {
      key: 'category',
      header: 'Category'
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (value) => (
        <span className={value >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
          {value >= 0 ? '+' : ''}{new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (value) => <StatusBadge status={value} size="sm" />
    }
  ];

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          navigationItems={navigationItems}
          userInfo={{
            name: 'John Doe',
            email: 'john.doe@company.com'
          }}
        />
      }
      header={
        <Header
          searchPlaceholder="Search transactions..."
          notificationCount={5}
          userInfo={{
            name: 'John Doe',
            email: 'john.doe@company.com'
          }}
        />
      }
    >
      {/* Alert Banner */}
      {showAlert && (
        <div className="mb-6">
          <AlertBanner
            type="warning"
            title="Budget Alert"
            message="Your marketing budget is at 85% capacity for this month. Consider reviewing upcoming expenses."
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Revenue Trend">
          <StitchLineChart data={revenueData} color="#0ea5e9" />
        </ChartCard>
        <ChartCard title="Expense Breakdown">
          <StitchPieChart data={expenseData} />
        </ChartCard>
      </div>

      {/* Recent Transactions Table */}
      <div className="mb-8">
        <DataTable
          title="Recent Transactions"
          columns={columns}
          data={recentTransactions}
          actions={
            <button
              className={`
                flex items-center gap-2
                px-4 py-2
                bg-slate-800
                text-white
                rounded-lg
                text-body-md
                font-medium
                transition-all
                hover:bg-slate-700
                focus:outline-none
                focus:ring-2
                focus:ring-slate-500
                focus:ring-offset-2
              `}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Transaction
            </button>
          }
        />
      </div>

      {/* View Full History Link */}
      <div className="flex justify-center">
        <a
          href="/transactions"
          className={`
            inline-flex items-center gap-2
            text-body-md
            font-medium
            text-slate-700
            hover:text-slate-900
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-slate-300
            rounded
            px-2 py-1
          `}
        >
          VIEW FULL HISTORY
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </DashboardLayout>
  );
}
