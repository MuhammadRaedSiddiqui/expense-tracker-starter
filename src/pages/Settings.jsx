import { useUser } from '@clerk/clerk-react';
import { useOrganization } from '../hooks/useOrganization';
import { useToast } from '../components/ToastContainer';

function Settings() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const toast = useToast();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-semibold text-slate-900 mb-1">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and organization settings</p>
      </div>

      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">User Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <p className="text-sm text-slate-900">{user?.fullName || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <p className="text-sm text-slate-900">
                {user?.primaryEmailAddress?.emailAddress || 'Not set'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
              <p className="text-xs text-slate-500 font-mono">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Organization Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Organization</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Organization Name
              </label>
              <p className="text-sm text-slate-900">{organization?.name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Organization ID
              </label>
              <p className="text-xs text-slate-500 font-mono">{organization?.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subscription Tier
              </label>
              <p className="text-sm text-slate-900 capitalize">
                {organization?.subscription_tier || 'free'}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h2>
          <p className="text-sm text-slate-500">
            Additional preferences and customization options will be available in future updates.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-rose-200 p-6">
          <h2 className="text-lg font-semibold text-rose-900 mb-4">Danger Zone</h2>
          <p className="text-sm text-slate-600 mb-4">
            These actions are permanent and cannot be undone.
          </p>
          <button
            onClick={() => toast.info('Account deletion will be implemented in a future update')}
            className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-md hover:bg-rose-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
