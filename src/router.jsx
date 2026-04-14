import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';

// Lazy load components
const Layout = lazy(() => import('./components/Layout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Settings = lazy(() => import('./pages/Settings'));
const Team = lazy(() => import('./pages/Team'));
const RecurringTransactions = lazy(() => import('./pages/RecurringTransactions'));
const Budgets = lazy(() => import('./pages/Budgets'));
const Reports = lazy(() => import('./pages/Reports'));
const CreateOrganization = lazy(() => import('./components/CreateOrganization'));
const AcceptInvitation = lazy(() => import('./pages/AcceptInvitation'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
      <p className="mt-4 text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/sign-in/*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Finance Tracker</h1>
            <p className="text-sm text-slate-600">
              Track your income and expenses with ease
            </p>
          </div>
          <SignIn
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-lg',
              }
            }}
          />
        </div>
      </div>
    ),
  },
  {
    path: '/sign-up/*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Finance Tracker</h1>
            <p className="text-sm text-slate-600">
              Track your income and expenses with ease
            </p>
          </div>
          <SignUp
            routing="path"
            path="/sign-up"
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-lg',
              }
            }}
          />
        </div>
      </div>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'transactions',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Transactions />
          </Suspense>
        ),
      },
      {
        path: 'recurring',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RecurringTransactions />
          </Suspense>
        ),
      },
      {
        path: 'budgets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Budgets />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Reports />
          </Suspense>
        ),
      },
      {
        path: 'team',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Team />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/organization/create',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <CreateOrganization />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/invitation/:token',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <AcceptInvitation />
        </ProtectedRoute>
      </Suspense>
    ),
  },
]);
