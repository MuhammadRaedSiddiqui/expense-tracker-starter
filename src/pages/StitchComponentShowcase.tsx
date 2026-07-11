import { useState } from 'react';
import {
  MetricCard,
  AlertBanner,
  StatusBadge,
  DataTable,
  NavigationItem,
  Header,
  Sidebar,
  DashboardLayout
} from './components/stitch';
import {
  TrendingUp,
  DollarSign,
  Activity,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import type { DataTableColumn, Transaction } from './types/stitch-components';

/**
 * Component Showcase - Examples of all Stitch components
 * Use this as a reference for implementing components in your app
 */
export function StitchComponentShowcase() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <h1 className="text-display-md font-bold text-on-surface mb-8">
        Stitch Component Showcase
      </h1>

      {/* Alert Banners */}
      <section>
        <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
          Alert Banners
        </h2>
        <div className="space-y-4">
          {showAlert && (
            <AlertBanner
              type="warning"
              title="Warning Alert"
              message="This is a warning message with a close button."
              onClose={() => setShowAlert(false)}
            />
          )}
          <AlertBanner
            type="info"
            title="Information"
            message="This is an informational message."
          />
          <AlertBanner
            type="error"
            title="Error"
            message="This is an error message."
          />
          <AlertBanner
            type="success"
            title="Success"
            message="This is a success message."
          />
        </div>
      </section>

      {/* Metric Cards */}
      <section>
        <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
          Metric Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            label="Total Revenue"
            value="$124,563"
            trend={{ value: 12.5, direction: 'up', isPositive: true }}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            label="Active Users"
            value="8,432"
            trend={{ value: 8.2, direction: 'up', isPositive: true }}
            icon={<Activity className="w-5 h-5" />}
          />
          <MetricCard
            label="Conversion Rate"
            value="3.2%"
            trend={{ value: 2.1, direction: 'down', isPositive: false }}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Status Badges */}
      <section>
        <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
          Status Badges
        </h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="success" size="sm" />
          <StatusBadge status="pending" size="md" />
          <StatusBadge status="failed" size="lg" />
          <StatusBadge status="warning" label="Custom Label" />
        </div>
      </section>

      {/* Navigation Items */}
      <section>
        <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
          Navigation Items
        </h2>
        <div className="max-w-xs space-y-2 bg-surface-container-low p-4 rounded-lg">
          <NavigationItem
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            href="/dashboard"
            isActive={true}
          />
          <NavigationItem
            icon={<TrendingUp className="w-5 h-5" />}
            label="Analytics"
            href="/analytics"
            badge={5}
          />
          <NavigationItem
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            href="/settings"
          />
        </div>
      </section>

      {/* Data Table */}
      <section>
        <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
          Data Table
        </h2>
        <DataTable
          title="Sample Transactions"
          columns={[
            { key: 'date', header: 'Date' },
            { key: 'description', header: 'Description' },
            {
              key: 'amount',
              header: 'Amount',
              align: 'right',
              render: (value) => (
                <span className={value >= 0 ? 'text-tertiary' : 'text-error'}>
                  ${Math.abs(value).toLocaleString()}
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              align: 'center',
              render: (value) => <StatusBadge status={value} size="sm" />
            }
          ]}
          data={[
            {
              id: '1',
              date: '2026-04-18',
              description: 'Payment received',
              amount: 5000,
              status: 'success',
              type: 'income'
            },
            {
              id: '2',
              date: '2026-04-17',
              description: 'Office supplies',
              amount: -250,
              status: 'pending',
              type: 'expense'
            }
          ]}
        />
      </section>
    </div>
  );
}
