import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking
 * Call this before rendering your React app
 */
export function initSentry() {
  // Only initialize in production or if explicitly enabled
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_ENV || 'development';

  if (!sentryDsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    // Filter out sensitive data
    beforeSend(event) {
      // Remove sensitive data from event
      if (event.request) {
        delete event.request.cookies;
      }
      return event;
    },
  });
}

/**
 * Capture an exception manually
 */
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message manually
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level as any);
}

/**
 * Set user context for error tracking
 */
export function setUser(user) {
  Sentry.setUser(user ? {
    id: user.id,
    email: user.email,
    username: user.username,
  } : null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message, data = {}) {
  Sentry.addBreadcrumb({
    message,
    data,
    level: 'info',
  });
}
