import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Team from './pages/Team';
import RecurringTransactions from './pages/RecurringTransactions';
import CreateOrganization from './components/CreateOrganization';
import AcceptInvitation from './pages/AcceptInvitation';

export const router = createBrowserRouter([
  {
    path: '/sign-in/*',
    element: <SignIn routing="path" path="/sign-in" />,
  },
  {
    path: '/sign-up/*',
    element: <SignUp routing="path" path="/sign-up" />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'recurring',
        element: <RecurringTransactions />,
      },
      {
        path: 'team',
        element: <Team />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/organization/create',
    element: (
      <ProtectedRoute>
        <CreateOrganization />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invitation/:token',
    element: (
      <ProtectedRoute>
        <AcceptInvitation />
      </ProtectedRoute>
    ),
  },
]);
