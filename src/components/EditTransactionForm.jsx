import { useState } from 'react';
import { CURRENCIES, BASE_CURRENCY, TRANSACTION_TYPES } from '../constants';

function EditTransactionForm({ transaction, onSave, onCancel, categories }) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [currency, setCurrency] = useState(transaction.currency || BASE_CURRENCY);
  const [date, setDate] = useState(transaction.date);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    const updatedTransaction = {
      ...transaction,
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      currency,
      date,
    };

    onSave(updatedTransaction);
  };

  return (
    <tr className="bg-gray-50">
      <td colSpan="5" className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Amount"
                step="0.01"
              />
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={TRANSACTION_TYPES.INCOME}>Income</option>
                <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </td>
    </tr>
  );
}

export default EditTransactionForm;
