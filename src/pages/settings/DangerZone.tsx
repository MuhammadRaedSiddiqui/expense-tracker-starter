import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { deleteOrganization } from '@/integration/api/apiClient';

export default function DangerZone() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!organization) return;
    if (confirmText !== organization.name) {
      setError('Organization name does not match');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await deleteOrganization(organization.id, getToken);

      if (!response.error) {
        navigate('/org-setup');
      } else {
        setError(response.error.message || 'Failed to delete organization');
      }
    } catch (err) {
      setError('An error occurred while deleting the organization');
      console.error('Delete organization error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="bg-error-container/10 p-8 rounded-lg border border-error/20">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="material-symbols-outlined text-error"
          data-icon="dangerous"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          dangerous
        </span>
        <h3 className="text-lg font-bold tracking-tight text-error">Danger Zone</h3>
      </div>

      {!showConfirm ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-on-error-container">Delete organization</p>
            <p className="text-[11px] text-on-error-container opacity-80 max-w-sm mt-1">
              Permanently deletes all data, members, and transaction history. This cannot be
              undone.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-6 py-2 bg-transparent border-[1.5px] border-[#dc2626] text-[#dc2626] text-[10px] font-extrabold uppercase tracking-widest rounded hover:bg-[#fef2f2] transition-all"
          >
            Delete workspace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-on-error-container mb-2">
              Are you absolutely sure?
            </p>
            <p className="text-[11px] text-on-error-container opacity-80 mb-4">
              This action cannot be undone. This will permanently delete the{' '}
              <span className="font-bold">{organization?.name}</span> organization and remove all
              associated data.
            </p>
            <p className="text-[11px] text-on-error-container opacity-80 mb-2">
              Please type <span className="font-bold">{organization?.name}</span> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError(null);
              }}
              className="w-full bg-surface-container-low border-2 border-error/30 px-3 py-2 text-sm font-medium rounded focus:ring-2 focus:ring-error focus:border-error"
              placeholder="Type organization name"
              disabled={isDeleting}
            />
            {error && (
              <p className="text-xs text-error font-medium mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" data-icon="error">
                  error
                </span>
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== organization?.name}
              className="px-6 py-2 bg-[#dc2626] text-white text-[10px] font-extrabold uppercase tracking-widest rounded hover:bg-[#b91c1c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'I understand, delete this organization'}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmText('');
                setError(null);
              }}
              disabled={isDeleting}
              className="px-6 py-2 bg-transparent border-[1.5px] border-outline text-on-surface text-[10px] font-extrabold uppercase tracking-widest rounded hover:bg-surface-container transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
