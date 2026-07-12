import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import './index.css';
import { router } from './router';
import { initSentry } from './integration/monitoring/sentry';
import { PostHogProvider } from '@posthog/react';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { ToastProvider } from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import { setUser } from './integration/monitoring/sentry';
import { queryClient, persister } from './lib/queryClient';
import { useEffect } from 'react';

// Initialize Sentry
initSentry();

// Component to sync user context with Sentry
function SentryUserSync() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        username: user.fullName || '',
      });
    } else {
      setUser(null);
    }
  }, [user]);

  return null;
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file');
}

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '[data-private]',
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={clerkPubKey}
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      >
        <SentryUserSync />
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN}
            options={posthogOptions}
          >
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </PostHogProvider>
        </PersistQueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>
);
