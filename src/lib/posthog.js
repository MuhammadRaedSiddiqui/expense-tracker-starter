import posthog from 'posthog-js';

/**
 * Initialize PostHog for product analytics
 * Call this before rendering your React app
 */
export function initPostHog() {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const apiHost = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
  const environment = import.meta.env.VITE_ENV || 'development';

  if (!apiKey) {
    console.warn('PostHog API key not configured. Analytics disabled.');
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    // Disable in development unless explicitly enabled
    loaded: (posthog) => {
      if (environment === 'development') {
        posthog.opt_out_capturing();
      }
    },
    // Privacy settings
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    // Session recording
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-private]',
    },
  });
}

/**
 * Track a custom event
 */
export function trackEvent(eventName, properties = {}) {
  if (typeof posthog !== 'undefined') {
    posthog.capture(eventName, properties);
  }
}

/**
 * Identify a user
 */
export function identifyUser(userId, properties = {}) {
  if (typeof posthog !== 'undefined') {
    posthog.identify(userId, properties);
  }
}

/**
 * Track page view manually
 */
export function trackPageView(pageName) {
  if (typeof posthog !== 'undefined') {
    posthog.capture('$pageview', { page: pageName });
  }
}

/**
 * Reset user identity (on logout)
 */
export function resetUser() {
  if (typeof posthog !== 'undefined') {
    posthog.reset();
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties) {
  if (typeof posthog !== 'undefined') {
    posthog.people.set(properties);
  }
}

// Export posthog instance for advanced usage
export { posthog };
