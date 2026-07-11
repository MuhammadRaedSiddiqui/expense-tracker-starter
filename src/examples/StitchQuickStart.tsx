/**
 * Quick Start Guide - Stitch Components
 *
 * This file demonstrates how to use the newly created Stitch components
 * in your existing expense tracker application.
 */

// Example 1: Using the complete Dashboard
import { Dashboard } from './components/stitch';

export function App() {
  return <Dashboard />;
}

// Example 2: Using individual components in your existing layout
import {
  MetricCard,
  AlertBanner,
  DataTable,
  StatusBadge
} from './components/stitch';
import { DollarSign, TrendingUp } from 'lucide-react';

export function CustomDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Alert */}
      <AlertBanner
        type="warning"
        title="Budget Alert"
        message="You're approaching your monthly limit"
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Balance"
          value="$45,231"
          trend={{ value: 12.5, direction: 'up', isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          label="Monthly Expenses"
          value="$8,450"
          trend={{ value: 3.2, direction: 'down', isPositive: true }}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Transactions Table */}
      <DataTable
        title="Recent Transactions"
        columns={[
          { key: 'date', header: 'Date' },
          { key: 'description', header: 'Description' },
          {
            key: 'amount',
            header: 'Amount',
            align: 'right',
            render: (value) => `$${value.toLocaleString()}`
          },
          {
            key: 'status',
            header: 'Status',
            render: (value) => <StatusBadge status={value} />
          }
        ]}
        data={[
          {
            id: '1',
            date: '2026-04-18',
            description: 'Grocery Shopping',
            amount: 125.50,
            status: 'success'
          }
        ]}
      />
    </div>
  );
}

// Example 3: Integrating with React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/stitch';

export function AppWithRouting() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/stitch-dashboard" element={<Dashboard />} />
        {/* Your other routes */}
      </Routes>
    </BrowserRouter>
  );
}

// Example 4: Using with your existing Supabase data
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { DataTable } from './components/stitch';

export function TransactionsWithSupabase() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(data || []);
    }
    fetchTransactions();
  }, []);

  return (
    <DataTable
      title="Live Transactions"
      columns={[
        { key: 'date', header: 'Date' },
        { key: 'description', header: 'Description' },
        { key: 'amount', header: 'Amount', align: 'right' }
      ]}
      data={transactions}
    />
  );
}
