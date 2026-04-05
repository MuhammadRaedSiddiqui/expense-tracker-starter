import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { acceptInvitation } from '../lib/apiClient';
import { captureException } from '../lib/sentry';

function AcceptInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handleAcceptInvitation() {
      // Wait for auth to load
      if (!isLoaded) return;

      // Redirect to sign-in if not authenticated
      if (!isSignedIn) {
        navigate(`/sign-in?redirect_url=/invitation/${token}`);
        return;
      }

      try {
        setStatus('loading');
        const { data, error: apiError } = await acceptInvitation(token, getToken);

        if (apiError) {
          throw apiError;
        }

        setStatus('success');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } catch (err) {
        console.error('Error accepting invitation:', err);
        captureException(err, { context: 'acceptInvitation' });
        setError(err.message || 'Failed to accept invitation');
        setStatus('error');
      }
    }

    handleAcceptInvitation();
  }, [token, isLoaded, isSignedIn, getToken, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Accepting invitation...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Welcome to the team!</h1>
          <p className="text-gray-600 mb-6">
            You've successfully joined the organization. Redirecting to dashboard...
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Taking you to the dashboard
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-100 mb-4">
            <svg
              className="h-8 w-8 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Unable to accept invitation</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/sign-in')}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default AcceptInvitation;
