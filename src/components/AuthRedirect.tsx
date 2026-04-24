import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface AuthRedirectProps {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users away from auth pages (sign-in/sign-up)
 * to the dashboard. Only renders children if user is not authenticated.
 */
export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for auth to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already signed in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render auth pages if not signed in
  return <>{children}</>;
}
