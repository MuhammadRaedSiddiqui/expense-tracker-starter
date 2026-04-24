import { useState } from 'react';
import { CATEGORIES } from '../../constants';

interface TransactionModalProps {
  transaction?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function TransactionModal({ transaction, onClose, onSubmit }: TransactionModalProps) {
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    currency: transaction?.currency || 'USD',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categories = formData.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-lg shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">
              {transaction ? 'Edit Transaction' : 'New Transaction'}
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
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
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
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
              className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

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
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full bg-surface-container-high border-none border-b-2 border-outline/30 focus:border-secondary focus:ring-0 px-3 py-2 text-sm text-on-surface rounded"
            />
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
              {transaction ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
