import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { removeMember, updateMemberRole } from '@/integration/api/apiClient';
import type { OrganizationMember } from '@/types';

interface MemberTableProps {
  members: OrganizationMember[];
  onUpdate?: () => void;
}

export default function MemberTable({ members, onUpdate }: MemberTableProps) {
  const { getToken } = useAuth();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      owner: 'px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase rounded border border-secondary/20',
      admin: 'px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase rounded',
      member: 'px-2 py-1 bg-primary-container text-on-primary-container text-[10px] font-extrabold uppercase rounded',
      viewer: 'px-2 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-extrabold uppercase rounded',
    };
    return badges[role] || badges.viewer;
  };

  const getPermissionLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Full access',
      admin: 'Full access',
      member: 'Read + edit',
      viewer: 'Read only',
    };
    return labels[role] || 'Read only';
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Remove this member from the organization?')) return;

    setRemovingId(memberId);
    try {
      const { error } = await removeMember(memberId, getToken);
      if (error) throw error;
      onUpdate?.();
    } catch (err) {
      console.error('Error removing member:', err);
      alert('Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="px-6 py-4 bg-surface-container-high flex justify-between items-center">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-on-surface-variant">
          Active Personnel ({members.length})
        </h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 border-b border-outline-variant/10">
            <th className="px-6 py-3">Member</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Joined</th>
            <th className="px-6 py-3">Permissions</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {members.length > 0 ? (
            members.map((m) => (
              <tr key={m.id} className="group hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center font-bold text-on-primary-container">
                      {m.user_id.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{m.user_id}</p>
                      <p className="text-xs text-on-surface-variant">Member ID: {m.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={getRoleBadge(m.role)}>{m.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-on-surface tabular-nums">
                    {new Date(m.joined_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-surface-container px-2 py-1 rounded border border-outline-variant/20">
                    {getPermissionLabel(m.role)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {m.role !== 'owner' && (
                    <button
                      onClick={() => handleRemove(m.id)}
                      disabled={removingId === m.id}
                      className="text-xs font-bold bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:border-error hover:text-error transition-all disabled:opacity-50"
                    >
                      {removingId === m.id ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                No members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
