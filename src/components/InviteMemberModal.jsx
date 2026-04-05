import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createInvitation } from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import Modal from './Modal';

function InviteMemberModal({ isOpen, onClose, organizationId, onInvite }) {
  const { getToken } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: inviteError } = await createInvitation(
        organizationId,
        email,
        role,
        getToken
      );

      if (inviteError) throw inviteError;

      setEmail('');
      setRole('member');
      onInvite();
      onClose();
    } catch (err) {
      console.error('Error inviting member:', err);
      captureException(err, { context: 'inviteMember' });
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="colleague@example.com"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="viewer">Viewer - Read-only access</option>
            <option value="member">Member - Can manage own transactions</option>
            <option value="admin">Admin - Can manage all transactions and members</option>
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
          <p className="text-xs text-blue-900">
            An invitation link will be created. Share it with the person you want to invite.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Invitation'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default InviteMemberModal;
