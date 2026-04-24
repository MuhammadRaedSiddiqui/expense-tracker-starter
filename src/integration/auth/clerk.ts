/**
 * Clerk authentication utilities
 */

interface ClerkUser {
  id: string;
  fullName?: string;
  firstName?: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
  createdAt?: string;
}

interface PostHogInstance {
  identify: (userId: string, properties: Record<string, any>) => void;
}

interface SentryUser {
  id: string;
  email: string | null;
  username: string;
}

/**
 * Get the current Clerk user ID
 */
export function getClerkUserId(user: ClerkUser | null | undefined): string | undefined {
  return user?.id;
}

/**
 * Get user's email address
 */
export function getUserEmail(user: ClerkUser | null | undefined): string | null {
  return user?.primaryEmailAddress?.emailAddress || null;
}

/**
 * Get user's full name
 */
export function getUserName(user: ClerkUser | null | undefined): string {
  if (user?.fullName) return user.fullName;
  if (user?.firstName) return user.firstName;
  return getUserEmail(user) || 'User';
}

/**
 * Sync user data with PostHog
 */
export function syncUserWithPostHog(
  posthog: PostHogInstance | null | undefined,
  user: ClerkUser | null | undefined
): void {
  if (!posthog || !user) return;

  posthog.identify(user.id, {
    email: getUserEmail(user),
    name: getUserName(user),
    created_at: user.createdAt,
  });
}

/**
 * Sync user data with Sentry
 */
export function syncUserWithSentry(
  setUser: (user: SentryUser | null) => void,
  user: ClerkUser | null | undefined
): void {
  if (!setUser || !user) return;

  setUser({
    id: user.id,
    email: getUserEmail(user),
    username: getUserName(user),
  });
}
