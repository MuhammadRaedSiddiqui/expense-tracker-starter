import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { revokeInvitation } from '@/integration/api/apiClient';
import type { Invitation } from '@/types';

interface PendingInvitationsProps {
  invitations: Invitation[];
  onUpdate?: () => void;
}

export default function PendingInvitations({ invitations, onUpdate }: PendingInvitationsProps) {
  const { getToken } = useAuth();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const getStatusInfo = (invitation: Invitation) => {
    const expiresAt = new Date(invitation.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (invitation.status === 'expired') {
      return { text: 'Expired', color: 'text-error' };
    }
    if (invitation.status === 'accepted') {
      return { text: 'Accepted', color: 'text-secondary' };
    }
    if (daysUntilExpiry <= 2) {
      return { text: `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`, color: 'text-error' };
    }
    return { text: `Sent ${new Date(invitation.created_at).toLocaleDateString()}`, color: 'text-on-surface-variant opacity-60' };
  };

  const handleRevoke = async (invitationId: string) => {
    if (!confirm('Revoke this invitation?')) return;

    setRevokingId(invitationId);
    try {
      const { error } = await revokeInvitation(invitationId, getToken);
      if (error) throw error;
      onUpdate?.();
    } catch (err) {
      console.error('Error revoking invitation:', err);
      alert('Failed to revoke invitation');
    } finally {
      setRevokingId(null);
    }
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Invite Summary Card */}
      <div className="md:col-span-1 bg-surface-container p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-secondary" data-icon="mail">
              mail
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-2">Invitation Backlog</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
            Manage access requests and outbound invitations. Pending invitations expire after 7 days for security compliance.
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Pending
            </span>
            <span className="text-xs font-bold tabular-nums">{pendingInvitations.length}</span>
          </div>
        </div>
      </div>

      {/* Pending Table */}
      <div className="md:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-lg" data-icon="pending">
            pending
          </span>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-on-surface-variant">
            Pending Invitations ({pendingInvitations.length})
          </h3>
        </div>
        <div className="divide-y divide-outline-variant/10">
          {pendingInvitations.length > 0 ? (
            pendingInvitations.map((inv) => {
              const status = getStatusInfo(inv);
              return (
                <div key={inv.id} className="px-6 py-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline text-lg" data-icon="person_outline">
                        person_outline
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{inv.email}</p>
                      <p className={`text-[10px] font-bold ${status.color} uppercase tracking-tighter`}>
                        {status.text}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRevoke(inv.id)}
                      disabled={revokingId === inv.id}
                      className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-error transition-colors border border-transparent hover:border-outline-variant/30 rounded-lg disabled:opacity-50"
                    >
                      {revokingId === inv.id ? 'Revoking...' : 'Revoke'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center text-on-surface-variant">
              No pending invitations
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
