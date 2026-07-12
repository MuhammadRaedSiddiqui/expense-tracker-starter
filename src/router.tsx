import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Transactions = lazy(() => import('./pages/transactions/Transactions'));
const Budgets = lazy(() => import('./pages/budgets/Budgets'));
const RecurringTransactions = lazy(() => import('./pages/recurring/RecurringTransactions'));
const TeamManagement = lazy(() => import('./pages/team/TeamManagement'));
const Reports = lazy(() => import('./pages/reports/Reports'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const AuthRedirect = lazy(() => import('./components/AuthRedirect'));
const CreateOrganization = lazy(() => import('./components/CreateOrganization'));
const AcceptInvitation = lazy(() => import('./pages/AcceptInvitation'));

// Legal pages
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const FAQ = lazy(() => import('./pages/legal/FAQ'));
const ContactUs = lazy(() => import('./pages/legal/ContactUs'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
      <p className="mt-4 text-sm text-on-surface-variant">Loading...</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/sign-in/*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthRedirect>
          <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-on-secondary text-2xl" data-icon="account_balance">
                      account_balance
                    </span>
                  </div>
                  <span className="text-xl font-bold uppercase tracking-widest text-on-surface">
                    Financial Architect
                  </span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter leading-none text-on-surface mb-2">
                  Sign In
                </h1>
                <p className="text-on-surface-variant font-medium">Welcome back to your financial dashboard</p>
              </div>
              <SignIn
                routing="path"
                path="/sign-in"
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: 'mx-auto',
                    card: 'shadow-lg bg-surface-container-lowest',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                  },
                }}
              />
            </div>
          </div>
        </AuthRedirect>
      </Suspense>
    ),
  },
  {
    path: '/sign-up/*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthRedirect>
          <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-on-secondary text-2xl" data-icon="account_balance">
                      account_balance
                    </span>
                  </div>
                  <span className="text-xl font-bold uppercase tracking-widest text-on-surface">
                    Financial Architect
                  </span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter leading-none text-on-surface mb-2">
                  Sign Up
                </h1>
                <p className="text-on-surface-variant font-medium">Create your account to get started</p>
              </div>
              <SignUp
                routing="path"
                path="/sign-up"
                afterSignUpUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: 'mx-auto',
                    card: 'shadow-lg bg-surface-container-lowest',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                  },
                }}
              />
            </div>
          </div>
        </AuthRedirect>
      </Suspense>
    ),
  },
  {
    path: '/org-setup',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <CreateOrganization />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthRedirect>
          <LandingPage />
        </AuthRedirect>
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/transactions',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/budgets',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <Budgets />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/recurring',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <RecurringTransactions />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/team',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <TeamManagement />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/reports',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/invitation/:token',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AcceptInvitation />
      </Suspense>
    ),
  },
  {
    path: '/terms',
    element: (
      <Suspense fallback={<PageLoader />}>
        <TermsOfService />
      </Suspense>
    ),
  },
  {
    path: '/privacy',
    element: (
      <Suspense fallback={<PageLoader />}>
        <PrivacyPolicy />
      </Suspense>
    ),
  },
  {
    path: '/faq',
    element: (
      <Suspense fallback={<PageLoader />}>
        <FAQ />
      </Suspense>
    ),
  },
  {
    path: '/contact',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ContactUs />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
