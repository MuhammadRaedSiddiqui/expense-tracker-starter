/**
 * Clerk authentication utilities
 */

/**
 * Get the current Clerk user ID
 * @param {Object} user - Clerk user object
 * @returns {string} User ID
 */
export function getClerkUserId(user) {
  return user?.id;
}

/**
 * Get user's email address
 * @param {Object} user - Clerk user object
 * @returns {string|null} Email address
 */
export function getUserEmail(user) {
  return user?.primaryEmailAddress?.emailAddress || null;
}

/**
 * Get user's full name
 * @param {Object} user - Clerk user object
 * @returns {string} Full name or email
 */
export function getUserName(user) {
  if (user?.fullName) return user.fullName;
  if (user?.firstName) return user.firstName;
  return getUserEmail(user) || 'User';
}

/**
 * Sync user data with PostHog
 * @param {Object} posthog - PostHog instance
 * @param {Object} user - Clerk user object
 */
export function syncUserWithPostHog(posthog, user) {
  if (!posthog || !user) return;

  posthog.identify(user.id, {
    email: getUserEmail(user),
    name: getUserName(user),
    created_at: user.createdAt,
  });
}

/**
 * Sync user data with Sentry
 * @param {Function} setUser - Sentry setUser function
 * @param {Object} user - Clerk user object
 */
export function syncUserWithSentry(setUser, user) {
  if (!setUser || !user) return;

  setUser({
    id: user.id,
    email: getUserEmail(user),
    username: getUserName(user),
  });
}
