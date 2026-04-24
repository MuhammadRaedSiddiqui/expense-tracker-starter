import { useState, FormEvent } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useToast } from '@/components/ToastContainer';
import { createTransaction } from '@/integration/api/apiClient';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { CATEGORIES, CURRENCIES } from '@/constants';

interface CommandModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CommandModal({ onClose, onSuccess }: CommandModalProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const toast = useToast();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!organization || !user) {
      toast.error('Organization or user not found');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await createTransaction(
        organization.id,
        user.id,
        {
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          type: formData.type,
          category: formData.category,
          description: formData.description,
          date: formData.date,
        },
        getToken
      );

      if (error) throw error;

      toast.success('Transaction created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error creating transaction:', err);
      toast.error('Failed to create transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = formData.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-inverse-surface/10 backdrop-blur-[2px]">
      <div
        className="w-full max-w-2xl bg-surface/90 shadow-[0_24px_48px_-12px_rgba(86,94,116,0.12)] border border-outline-variant/15 flex flex-col relative"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div className="p-6 flex justify-between items-start border-b border-outline-variant/10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-on-surface">Add Transaction</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high transition-colors rounded-lg"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-10">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm ${
                  formData.type === 'expense'
                    ? 'bg-error text-on-error'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm ${
                  formData.type === 'income'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                Income
              </button>
            </div>

            <div className="relative">
              <label className="text-[0.6875rem] font-bold tracking-[0.15em] text-on-surface-variant uppercase block mb-4">
                Amount
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-on-surface-variant">$</span>
                <input
                  className="w-full text-5xl font-bold tracking-tighter bg-transparent border-none p-0 focus:ring-0 text-on-surface tabular-nums"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="h-0.5 w-full bg-outline-variant/20 mt-2 relative">
                <div className="absolute left-0 top-0 h-full w-24 bg-secondary"></div>
              </div>
              {errors.amount && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="material-symbols-outlined text-[14px] text-error">report</span>
                  <span className="text-[0.6875rem] font-medium text-error">{errors.amount}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-1">
                <label className="text-[0.6875rem] font-bold tracking-[0.15em] text-on-surface-variant uppercase block">
                  Currency
                </label>
                <div className="relative group">
                  <select
                    className="w-full bg-surface-container-low border-none border-b-2 border-outline hover:border-secondary focus:border-secondary focus:ring-0 py-3 px-0 text-sm font-medium appearance-none cursor-pointer"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} — {curr.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-3 text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.6875rem] font-bold tracking-[0.15em] text-on-surface-variant uppercase block">
                  Date
                </label>
                <input
                  className="w-full bg-surface-container-low border-none border-b-2 border-outline hover:border-secondary focus:border-secondary focus:ring-0 py-3 px-0 text-sm font-medium"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-[0.6875rem] font-bold tracking-[0.15em] text-on-surface-variant uppercase block">
                  Category
                </label>
                <div className="relative group">
                  <select
                    className={`w-full bg-surface-container-low border-none border-b-2 ${
                      errors.category ? 'border-error' : 'border-outline'
                    } focus:border-secondary focus:ring-0 py-3 px-0 text-sm font-medium appearance-none cursor-pointer`}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-3 pointer-events-none text-on-surface-variant">
                    expand_more
                  </span>
                </div>
                {errors.category && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="material-symbols-outlined text-[14px] text-error">report</span>
                    <span className="text-[0.6875rem] font-medium text-error">{errors.category}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-[0.6875rem] font-bold tracking-[0.15em] text-on-surface-variant uppercase block">
                  Description
                </label>
                <input
                  className="w-full bg-surface-container-low border-none border-b-2 border-outline hover:border-secondary focus:border-secondary focus:ring-0 py-3 px-0 text-sm font-medium"
                  placeholder="e.g. AWS Cloud Services"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                {errors.description && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="material-symbols-outlined text-[14px] text-error">report</span>
                    <span className="text-[0.6875rem] font-medium text-error">{errors.description}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-container-low/50 border-t border-outline-variant/10 flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-widest disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-secondary text-on-secondary text-sm font-bold shadow-lg hover:opacity-90 uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save transaction'}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="absolute -top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-secondary/20 pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-24 h-24 border-b-2 border-r-2 border-secondary/20 pointer-events-none"></div>
      </div>
    </div>
  );
}
