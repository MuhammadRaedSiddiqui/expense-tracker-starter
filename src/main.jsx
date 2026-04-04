import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AuthGate from './components/AuthGate.jsx';
import { initSentry } from './lib/sentry';
import { PostHogProvider } from '@posthog/react';
import { ClerkProvider } from '@clerk/clerk-react';

// Initialize Sentry
initSentry();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN}
        options={posthogOptions}
      >
        <AuthGate />
      </PostHogProvider>
    </ClerkProvider>
  </StrictMode>
);
