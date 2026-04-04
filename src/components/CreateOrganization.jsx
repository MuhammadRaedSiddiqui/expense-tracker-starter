import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { createOrganization, migrateLocalStorageData } from '../lib/supabaseQueries';
import { getClerkUserId, getUserName } from '../lib/clerk';
import { STORAGE_KEY } from '../constants';

function CreateOrganization({ onComplete }) {
  const { user } = useUser();
  const [orgName, setOrgName] = useState(`${getUserName(user)}'s Finances`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [migrationStep, setMigrationStep] = useState('setup'); // setup, migrate, complete

  // Check for localStorage data
  const localStorageData = localStorage.getItem(STORAGE_KEY);
  const existingTransactions = localStorageData ? JSON.parse(localStorageData) : null;
  const transactionCount = existingTransactions?.length || 0;

  const handleCreateOrg = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = getClerkUserId(user);

      // Create organization
      const { data: org, error: orgError } = await createOrganization(userId, orgName);

      if (orgError) throw orgError;

      // Check if we need to migrate data
      if (existingTransactions && existingTransactions.length > 0) {
        setMigrationStep('migrate');

        // Migrate localStorage data
        const { error: migrateError } = await migrateLocalStorageData(
          org.id,
          userId,
          existingTransactions
        );

        if (migrateError) throw migrateError;

        // Clear localStorage after successful migration
        localStorage.removeItem(STORAGE_KEY);
      }

      setMigrationStep('complete');

      // Notify parent component
      if (onComplete) {
        onComplete(org);
      }
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err.message || 'Failed to create organization. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to Finance Tracker
          </h1>
          <p className="text-sm text-slate-600">
            Let's set up your organization to get started
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md">
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {migrationStep === 'setup' && (
          <>
            <div className="mb-6">
              <label htmlFor="orgName" className="block text-sm font-medium text-slate-700 mb-2">
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Finances"
                disabled={loading}
              />
            </div>

            {transactionCount > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  📦 Existing Data Found
                </p>
                <p className="text-sm text-blue-700">
                  We found {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} in your browser.
                  They will be automatically imported to your new organization.
                </p>
              </div>
            )}

            <button
              onClick={handleCreateOrg}
              disabled={loading || !orgName.trim()}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </>
        )}

        {migrationStep === 'migrate' && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-slate-600">
              Importing your {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}...
            </p>
          </div>
        )}

        {migrationStep === 'complete' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900 mb-2">All Set!</p>
            <p className="text-sm text-slate-600">
              Loading your dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateOrganization;
