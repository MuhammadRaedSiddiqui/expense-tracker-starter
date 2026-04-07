import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useOrganization } from '../hooks/useOrganization';
import { getMembers, getInvitations, revokeInvitation, updateMemberRole, removeMember } from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import InviteMemberModal from '../components/InviteMemberModal';
import { useRealtimeTeam } from '../hooks/useRealtime';
import { useToast } from '../components/ToastContainer';
import { SkeletonMemberCard } from '../components/Skeleton';

function Team() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Real-time team updates with polling fallback
  const fetchMembers = async () => {
    if (!organization) return [];
    const { data } = await getMembers(organization.id, getToken);
    return data || [];
  };

  const fetchInvitations = async () => {
    if (!organization) return [];
    const { data } = await getInvitations(organization.id, getToken);
    return data || [];
  };

  const { members, invitations, isRealtime } = useRealtimeTeam(
    organization?.id,
    fetchMembers,
    fetchInvitations,
    !!organization
  );

  const handleRevokeInvitation = async (invitationId) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) {
      return;
    }

    try {
      const { error } = await revokeInvitation(invitationId, getToken);
      if (error) throw error;
      toast.success('Invitation revoked successfully');
      // Real-time will update the list automatically
    } catch (err) {
      console.error('Error revoking invitation:', err);
      captureException(err, { context: 'revokeInvitation' });
      toast.error('Failed to revoke invitation');
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      const { error } = await updateMemberRole(memberId, newRole, getToken);
      if (error) throw error;
      toast.success('Member role updated successfully');
      // Real-time will update the list automatically
    } catch (err) {
      console.error('Error updating role:', err);
      captureException(err, { context: 'updateMemberRole' });
      toast.error('Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const { error } = await removeMember(memberId, getToken);
      if (error) throw error;
      toast.success('Member removed successfully');
      // Real-time will update the list automatically
    } catch (err) {
      console.error('Error removing member:', err);
      captureException(err, { context: 'removeMember' });
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold text-slate-900">Team</h1>
            {isRealtime && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </span>
            )}
          </div>
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
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMemberCard key={i} />
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonMemberCard key={i} />
            ))}
          </div>
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
