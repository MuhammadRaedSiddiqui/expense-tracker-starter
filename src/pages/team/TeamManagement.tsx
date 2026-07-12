import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ToastContainer';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import MemberTable from './MemberTable';
import PendingInvitations from './PendingInvitations';
import InviteMemberModal from '@/components/InviteMemberModal';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { useRealtimeTeam } from '@/integration/hooks/useRealtime';
import { getMembers, getInvitations, createInvitation } from '@/integration/api/apiClient';

export default function TeamManagement() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { organization, loading: orgLoading } = useOrganization();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Real-time team updates — stable references prevent effect re-runs
  const fetchMembers = useCallback(async () => {
    if (!organization) return [];
    const { data } = await getMembers(organization.id, getToken);
    return data || [];
  }, [organization?.id, getToken]);

  const fetchInvitations = useCallback(async () => {
    if (!organization) return [];
    const { data } = await getInvitations(organization.id, getToken);
    return data || [];
  }, [organization?.id, getToken]);

  const { members, invitations, refetch } = useRealtimeTeam(
    organization?.id,
    fetchMembers,
    fetchInvitations,
    !!organization
  );

  // Mutation for creating invitation
  const createInvitationMutation = useMutation({
    mutationFn: async (inviteData: { email: string; role: 'admin' | 'member' | 'viewer' }) => {
      if (!organization) throw new Error('No organization');
      const { data, error } = await createInvitation(
        organization.id,
        inviteData.email,
        inviteData.role,
        getToken
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success('Invitation sent successfully');
      setShowInviteModal(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send invitation');
    },
  });

  const handleInviteSubmit = (data: { email: string; role: string }) => {
    createInvitationMutation.mutate(data as { email: string; role: 'admin' | 'member' | 'viewer' });
  };

  const handleUpdate = () => {
    refetch();
  };

  if (orgLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-surface-container rounded-lg"></div>
          <div className="h-64 bg-surface-container rounded-lg"></div>
          <div className="h-48 bg-surface-container rounded-lg"></div>
        </div>
      </AppLayout>
    );
  }

  if (!organization) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-outline" data-icon="corporate_fare">
                  corporate_fare
                </span>
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-2">No Organization Found</h2>
              <p className="text-sm text-on-surface-variant">
                Please create an organization to get started.
              </p>
            </div>
            <button
              onClick={() => navigate('/org-setup')}
              className="px-6 py-3 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-sm hover:bg-on-secondary-fixed-variant transition-all rounded-lg"
            >
              Create Organization
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <PageHeader subtitle="Organization management" title="Team Members">
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-secondary-dim transition-all shadow-xl shadow-secondary/10"
          >
            <span className="material-symbols-outlined text-sm" data-icon="person_add">
              person_add
            </span>
            Invite Member
          </button>
        </PageHeader>

        <MemberTable members={members || []} onUpdate={handleUpdate} />
        <PendingInvitations invitations={invitations || []} onUpdate={handleUpdate} />
      </div>

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteSubmit}
        />
      )}
    </AppLayout>
  );
}
