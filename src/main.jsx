import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';
import { initSentry } from './lib/sentry';
import { PostHogProvider } from '@posthog/react';
import { ClerkProvider } from '@clerk/clerk-react';
import { ToastProvider } from './components/ToastContainer';

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
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </PostHogProvider>
    </ClerkProvider>
  </StrictMode>
);
