import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useOrganization } from '../hooks/useOrganization';
import { getMembers, getInvitations, revokeInvitation, updateMemberRole, removeMember } from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import InviteMemberModal from '../components/InviteMemberModal';

function Team() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const loadData = async () => {
    if (!organization) return;

    try {
      setLoading(true);
      setError(null);

      const [membersRes, invitationsRes] = await Promise.all([
        getMembers(organization.id, getToken),
        getInvitations(organization.id, getToken),
      ]);

      if (membersRes.error) throw membersRes.error;
      if (invitationsRes.error) throw invitationsRes.error;

      setMembers(membersRes.data || []);
      setInvitations(invitationsRes.data || []);
    } catch (err) {
      console.error('Error loading team data:', err);
      captureException(err, { context: 'loadTeamData' });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

  const handleRevokeInvitation = async (invitationId) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) {
      return;
    }

    try {
      const { error } = await revokeInvitation(invitationId, getToken);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error revoking invitation:', err);
      captureException(err, { context: 'revokeInvitation' });
      alert('Failed to revoke invitation');
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      const { error } = await updateMemberRole(memberId, newRole, getToken);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error updating role:', err);
      captureException(err, { context: 'updateMemberRole' });
      alert('Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const { error } = await removeMember(memberId, getToken);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error removing member:', err);
      captureException(err, { context: 'removeMember' });
      alert('Failed to remove member');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-1">Team</h1>
          <p className="text-sm text-slate-500">Manage your organization members</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Invite Member
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Members ({members.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <div key={member.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.user_id}</p>
                    <p className="text-xs text-slate-500">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                      disabled={member.role === 'owner'}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-sm text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Pending Invitations ({invitations.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{invitation.email}</p>
                      <p className="text-xs text-slate-500">
                        Invited {new Date(invitation.created_at).toLocaleDateString()} • {invitation.role}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRevokeInvitation(invitation.id)}
                      className="text-sm text-rose-600 hover:text-rose-700"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        organizationId={organization?.id}
        onInvite={loadData}
      />
    </div>
  );
}

export default Team;
