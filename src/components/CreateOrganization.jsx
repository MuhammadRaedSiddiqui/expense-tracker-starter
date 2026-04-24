import { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { createOrganization, migrateLocalStorageData } from '../lib/apiClient';
import { getClerkUserId, getUserName } from '../lib/clerk';
import { STORAGE_KEY } from '../constants';

function CreateOrganization({ onComplete }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState(`${getUserName(user)}'s Finances`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [migrationStep, setMigrationStep] = useState('setup'); // setup, migrate, complete

  // Check for localStorage data
  const localStorageData = localStorage.getItem(STORAGE_KEY);
  const existingTransactions = localStorageData ? JSON.parse(localStorageData) : null;
  const transactionCount = existingTransactions?.length || 0;

  const handleCreateOrg = async () => {
    if (!orgName.trim()) {
      setError('Organization name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = getClerkUserId(user);

      // Create organization via API
      const { data: org, error: orgError } = await createOrganization(orgName, getToken);

      if (orgError) throw orgError;

      // Check if we need to migrate data
      if (existingTransactions && existingTransactions.length > 0) {
        setMigrationStep('migrate');

        // Migrate localStorage data via API
        const { error: migrateError } = await migrateLocalStorageData(
          org.id,
          userId,
          existingTransactions,
          getToken
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

      // Navigate to dashboard after brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err.message || 'Failed to create organization. Please try again.');
      setLoading(false);
      setMigrationStep('setup');
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex flex-col items-center justify-center p-6 antialiased w-full">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1920px] mx-auto">
          <div className="text-xl font-bold uppercase tracking-widest text-on-surface">
            Financial Architect
          </div>
          <div className="flex items-center gap-6">
            <span className="text-outline font-medium hover:text-on-surface transition-colors cursor-pointer">
              Support
            </span>
            <span
              className="material-symbols-outlined text-outline cursor-pointer"
              data-icon="help_outline"
            >
              help_outline
            </span>
            <span
              className="material-symbols-outlined text-outline cursor-pointer"
              data-icon="language"
            >
              language
            </span>
          </div>
        </div>
        <div className="bg-outline-variant/15 h-[1px] w-full absolute bottom-0"></div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[540px] mt-16 mb-16">
        <div className="bg-surface-container-lowest p-10 shadow-[0_4px_24px_rgba(86,94,116,0.04)] rounded-lg">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">
              {migrationStep === 'setup' ? 'Almost done' : migrationStep === 'migrate' ? 'Migrating data' : 'Complete'}
            </span>
            <div className="flex gap-1">
              <div className={`h-1 w-8 rounded-full ${migrationStep !== 'setup' ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
              <div className={`h-1 w-8 rounded-full ${migrationStep === 'complete' ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">
              {migrationStep === 'setup' ? 'Set up your organization' : migrationStep === 'migrate' ? 'Importing your data' : 'All set!'}
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              {migrationStep === 'setup' ? 'This takes less than a minute.' : migrationStep === 'migrate' ? 'Please wait while we migrate your transactions...' : 'Loading your dashboard...'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-container/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error font-medium">{error}</p>
            </div>
          )}

          {/* Setup Form */}
          {migrationStep === 'setup' && (
            <>
              {/* Migration Notice */}
              {transactionCount > 0 && (
                <div className="mb-6 p-4 bg-secondary-container/20 border border-secondary/30 rounded-lg">
                  <p className="text-sm text-on-secondary-container font-medium mb-1">
                    📦 Existing Data Found
                  </p>
                  <p className="text-sm text-on-secondary-container opacity-80">
                    We found {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} in your browser.
                    They will be automatically imported to your new organization.
                  </p>
                </div>
              )}

              {/* Organization Name Field */}
              <div className="space-y-2 mb-8">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
                  Organization Legal Name
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-2 py-3 text-on-surface placeholder:text-outline-variant font-medium transition-all"
                    placeholder="e.g. Acme Corp Treasury"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleCreateOrg}
                  disabled={loading || !orgName.trim()}
                  className="w-full block text-center bg-secondary text-on-secondary py-4 font-bold uppercase tracking-widest text-sm hover:bg-on-secondary-fixed-variant active:opacity-70 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Organization'}
                </button>
              </div>

              {/* Legal Link */}
              <div className="text-center pt-6">
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  By creating an organization, you agree to the <br />
                  <a
                    className="text-secondary font-bold hover:underline underline-offset-4 transition-all"
                    href="#"
                  >
                    Master Service Agreement
                  </a>{' '}
                  and{' '}
                  <a
                    className="text-secondary font-bold hover:underline underline-offset-4 transition-all"
                    href="#"
                  >
                    Data Processing Addendum
                  </a>
                  .
                </p>
              </div>
            </>
          )}

          {/* Migration Progress */}
          {migrationStep === 'migrate' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
              <p className="text-sm text-on-surface-variant">
                Importing your {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}...
              </p>
            </div>
          )}

          {/* Complete State */}
          {migrationStep === 'complete' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-container rounded-full mb-4">
                <span className="material-symbols-outlined text-4xl text-secondary" data-icon="check_circle">
                  check_circle
                </span>
              </div>
              <p className="text-lg font-semibold text-on-surface mb-2">All Set!</p>
              <p className="text-sm text-on-surface-variant">Loading your dashboard...</p>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4 py-3 px-6 bg-surface-container rounded-full border border-outline-variant/10">
            <span
              className="material-symbols-outlined text-secondary"
              data-icon="verified_user"
              data-weight="fill"
            >
              verified_user
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              SOC2 Type II Compliant Infrastructure
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto border-t border-outline-variant/20 bg-surface-container">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full gap-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-outline">
            © 2024 Financial Architect. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              className="text-[11px] font-medium uppercase tracking-wider text-outline hover:text-on-surface underline underline-offset-4 transition-all cursor-pointer"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-[11px] font-medium uppercase tracking-wider text-outline hover:text-on-surface underline underline-offset-4 transition-all cursor-pointer"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-[11px] font-medium uppercase tracking-wider text-outline hover:text-on-surface underline underline-offset-4 transition-all cursor-pointer"
              href="#"
            >
              Security
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CreateOrganization;
