import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createRecurringTransaction, updateRecurringTransaction } from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import { CATEGORIES, CURRENCIES } from '../constants';
import Modal from './Modal';

function RecurringTransactionModal({ isOpen, onClose, onSuccess, organizationId, editingTransaction }) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    type: 'expense',
    category: '',
    frequency: 'monthly',
    interval: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        currency: editingTransaction.currency,
        type: editingTransaction.type,
        category: editingTransaction.category,
        frequency: editingTransaction.frequency,
        interval: editingTransaction.interval.toString(),
        startDate: editingTransaction.start_date,
        endDate: editingTransaction.end_date || '',
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        currency: 'USD',
        type: 'expense',
        category: '',
        frequency: 'monthly',
        interval: '1',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
    }
    setError(null);
  }, [editingTransaction, isOpen]);

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
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        type: formData.type,
        category: formData.category,
        frequency: formData.frequency,
        interval: parseInt(formData.interval),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
      };

      let result;
      if (editingTransaction) {
        result = await updateRecurringTransaction(editingTransaction.id, data, getToken);
      } else {
        result = await createRecurringTransaction(organizationId, data, getToken);
      }

      if (result.error) throw result.error;

      onSuccess();
    } catch (err) {
      console.error('Error saving recurring transaction:', err);
      captureException(err, { context: 'saveRecurringTransaction' });
      setError(err.message || 'Failed to save recurring transaction');
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = formData.type === 'income'
    ? CATEGORIES.income
    : CATEGORIES.expense;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Monthly Rent, Salary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Amount
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

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
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-slate-700 mb-1">
              Frequency
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-slate-700 mb-1">
              Every
            </label>
            <input
              id="interval"
              name="interval"
              type="number"
              min="1"
              value={formData.interval}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            This transaction will be automatically created {formData.frequency === 'daily' ? 'every day' : formData.frequency === 'weekly' ? 'every week' : formData.frequency === 'monthly' ? 'every month' : 'every year'}
            {formData.interval > 1 ? ` (every ${formData.interval} ${formData.frequency})` : ''}.
            {formData.endDate ? ` It will stop after ${formData.endDate}.` : ' It will continue indefinitely.'}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : editingTransaction ? 'Update' : 'Create'}
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

export default RecurringTransactionModal;
