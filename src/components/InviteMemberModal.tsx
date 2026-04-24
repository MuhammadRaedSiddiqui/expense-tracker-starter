import { useState } from 'react';

interface InviteMemberModalProps {
  onClose: () => void;
  onSubmit: (data: { email: string; role: 'admin' | 'member' | 'viewer' }) => void;
}

export default function InviteMemberModal({ onClose, onSubmit }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member' | 'viewer'>('member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, role });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2f3038]/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden border border-white/20">

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-extrabold text-[#3e465b] tracking-tight">Invite Member</h2>
            <p className="text-sm text-slate-600 mt-1">Grant access to your organization ledger.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-[#3e465b] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-8">

            {/* Email Input Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#3e465b] uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4a41e1] transition-colors">mail</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@company.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 bg-[#fbf8ff] focus:border-[#4a41e1] focus:ring-1 focus:ring-[#4a41e1] transition-all outline-none text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Role Selection Section */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-[#3e465b] uppercase tracking-wider">Role Selection</label>
              <div className="grid grid-cols-1 gap-3">

                {/* Role: Admin */}
                <label className={`relative flex items-start gap-4 p-4 border-2 cursor-pointer transition-all ${role === 'admin' ? 'border-[#4a41e1] bg-[#e2dfff]/30' : 'border-slate-200 hover:border-slate-400'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'member' | 'viewer')}
                    className="mt-1 text-[#4a41e1] focus:ring-[#4a41e1]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3e465b]">Admin</span>
                      <span className={`material-symbols-outlined text-sm ${role === 'admin' ? 'text-[#4a41e1]' : 'text-slate-400'}`}>verified_user</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">Full access to all transactions and members. Can manage settings and billing.</p>
                  </div>
                </label>

                {/* Role: Member */}
                <label className={`relative flex items-start gap-4 p-4 border-2 cursor-pointer transition-all ${role === 'member' ? 'border-[#4a41e1] bg-[#e2dfff]/30' : 'border-slate-200 hover:border-slate-400'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="member"
                    checked={role === 'member'}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'member' | 'viewer')}
                    className="mt-1 text-[#4a41e1] focus:ring-[#4a41e1]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3e465b]">Member</span>
                      <span className={`material-symbols-outlined text-sm ${role === 'member' ? 'text-[#4a41e1]' : 'text-slate-400'}`}>monitoring</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">Access to transactions and reports. Can manage own transactions.</p>
                  </div>
                </label>

                {/* Role: Viewer */}
                <label className={`relative flex items-start gap-4 p-4 border-2 cursor-pointer transition-all ${role === 'viewer' ? 'border-[#4a41e1] bg-[#e2dfff]/30' : 'border-slate-200 hover:border-slate-400'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="viewer"
                    checked={role === 'viewer'}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'member' | 'viewer')}
                    className="mt-1 text-[#4a41e1] focus:ring-[#4a41e1]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3e465b]">Viewer</span>
                      <span className={`material-symbols-outlined text-sm ${role === 'viewer' ? 'text-[#4a41e1]' : 'text-slate-400'}`}>visibility</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">Read-only access to specific reports and dashboard components.</p>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-slate-50 flex items-center justify-end gap-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#3e465b] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 text-sm font-bold bg-[#4a41e1] text-white hover:shadow-lg hover:shadow-[#4a41e1]/20 transition-all flex items-center gap-2"
            >
              Send invitation
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
