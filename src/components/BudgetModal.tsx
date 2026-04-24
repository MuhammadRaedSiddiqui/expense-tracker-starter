import { useState, useEffect } from 'react';
import { CATEGORIES, CURRENCIES } from '../constants';

interface BudgetModalProps {
  budget?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function BudgetModal({ budget, onClose, onSubmit }: BudgetModalProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    amount: budget?.amount || '',
    currency: budget?.currency || 'USD',
    period: budget?.period || 'monthly',
    startDate: budget?.start_date || new Date().toISOString().split('T')[0],
    endDate: budget?.end_date || '',
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
        currency: budget.currency,
        period: budget.period,
        startDate: budget.start_date,
        endDate: budget.end_date || '',
      });
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      endDate: formData.endDate || null,
    });
  };

  const allCategories = [
    ...CATEGORIES.income.map(cat => ({ value: cat, label: cat, type: 'income' })),
    ...CATEGORIES.expense.map(cat => ({ value: cat, label: cat, type: 'expense' }))
  ];

  return (
    <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-lg shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">
              {budget ? 'Edit Budget' : 'New Budget'}
            </h2>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined" data-icon="close">
                close
              </span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
            >
              <option value="">Select category</option>
              {allCategories.map((cat) => (
                <option key={`${cat.type}-${cat.value}`} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              Period
            </label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
              />
            </div>
          </div>

          <div className="bg-secondary-container/20 border border-secondary-container rounded-lg px-4 py-3">
            <p className="text-xs text-on-surface-variant">
              Budget tracks <strong>{formData.category || 'selected'}</strong> category spending.
              {formData.period === 'monthly' ? ' Resets monthly.' : ' Resets yearly.'}
              {formData.endDate ? ` Ends ${formData.endDate}.` : ' No end date.'}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-outline-variant text-on-surface font-semibold text-sm rounded hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-secondary text-on-secondary font-semibold text-sm rounded hover:bg-secondary-dim transition-colors"
            >
              {budget ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
