import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createBudget, updateBudget } from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import { CATEGORIES, CURRENCIES } from '../constants';
import Modal from './Modal';

function BudgetModal({ isOpen, onClose, onSuccess, organizationId, editingBudget }) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    currency: 'USD',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all categories (income + expense)
  const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        amount: editingBudget.amount.toString(),
        currency: editingBudget.currency,
        period: editingBudget.period,
        startDate: editingBudget.start_date,
        endDate: editingBudget.end_date || '',
      });
    } else {
      setFormData({
        category: '',
        amount: '',
        currency: 'USD',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
    }
    setError(null);
  }, [editingBudget, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
      };

      let result;
      if (editingBudget) {
        result = await updateBudget(editingBudget.id, data, getToken);
      } else {
        result = await createBudget(organizationId, data, getToken);
      }

      if (result.error) throw result.error;

      onSuccess();
    } catch (err) {
      console.error('Error saving budget:', err);
      captureException(err, { context: 'saveBudget' });
      setError(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBudget ? 'Edit Budget' : 'Create Budget'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Budget Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">
            Budget Period
          </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
              End Date (Optional)
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
          <p className="text-xs text-blue-900">
            This budget will track spending in the <strong>{formData.category || 'selected'}</strong> category.
            {formData.period === 'monthly' ? ' The budget resets every month.' : ' The budget resets every year.'}
            {formData.endDate ? ` It will end on ${formData.endDate}.` : ' It will continue indefinitely.'}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
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

export default BudgetModal;
