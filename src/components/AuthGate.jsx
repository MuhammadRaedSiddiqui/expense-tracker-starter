import { useEffect } from 'react';
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import { usePostHog } from '@posthog/react';
import { setUser } from '../lib/sentry';
import { syncUserWithPostHog, syncUserWithSentry } from '../lib/clerk';
import { useOrganization } from '../hooks/useOrganization';
import CreateOrganization from './CreateOrganization';
import App from '../App';

function AuthGate() {
  const { user } = useUser();
  const posthog = usePostHog();
  const { organization, transactions, loading, error, refetch } = useOrganization();

  // Sync user with monitoring services when authenticated
  useEffect(() => {
    if (user) {
      syncUserWithPostHog(posthog, user);
      syncUserWithSentry(setUser, user);
    }
  }, [user, posthog]);

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Finance Tracker</h1>
              <p className="text-sm text-slate-600">
                Track your income and expenses with ease
              </p>
            </div>
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'mx-auto',
                  card: 'shadow-lg',
                }
              }}
            />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {loading && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-slate-600">Loading your data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                <p className="text-sm text-slate-600 mb-6">{error}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !organization && (
          <CreateOrganization onComplete={refetch} />
        )}

        {!loading && !error && organization && (
          <App
            organization={organization}
            initialTransactions={transactions}
            onDataChange={refetch}
          />
        )}
      </SignedIn>
    </>
  );
}

export default AuthGate;
