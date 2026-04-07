import { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { TRANSACTION_TYPES, CURRENCIES, BASE_CURRENCY } from '../constants';

function TransactionForm({ onAddTransaction, categories, onClose }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(TRANSACTION_TYPES.EXPENSE);
  const [category, setCategory] = useState('food');
  const [currency, setCurrency] = useState(BASE_CURRENCY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateDescription = (value) => {
    if (!value.trim()) {
      return 'Description is required';
    }
    if (value.trim().length < 3) {
      return 'Description must be at least 3 characters';
    }
    return '';
  };

  const validateAmount = (value) => {
    if (!value) {
      return 'Amount is required';
    }
    if (isNaN(value)) {
      return 'Amount must be a number';
    }
    if (parseFloat(value) <= 0) {
      return 'Amount must be greater than 0';
    }
    return '';
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (touched.description) {
      const error = validateDescription(value);
      setErrors(prev => ({ ...prev, description: error }));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (touched.amount) {
      const error = validateAmount(value);
      setErrors(prev => ({ ...prev, amount: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'description') {
      const error = validateDescription(description);
      setErrors(prev => ({ ...prev, description: error }));
    } else if (field === 'amount') {
      const error = validateAmount(amount);
      setErrors(prev => ({ ...prev, amount: error }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Validate all fields
    const descError = validateDescription(description);
    const amountError = validateAmount(amount);

    if (descError || amountError) {
      setErrors({
        description: descError,
        amount: amountError,
      });
      setTouched({
        description: true,
        amount: true,
      });
      return;
    }

    const newTransaction = {
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      currency,
      date: new Date().toISOString().split('T')[0],
    };

    onAddTransaction(newTransaction);
    setDescription('');
    setAmount('');
    setType(TRANSACTION_TYPES.EXPENSE);
    setCategory('food');
    setCurrency(BASE_CURRENCY);
    setErrors({});
    setTouched({});
    if (onClose) onClose();
  };

  const typeOptions = [
    { value: TRANSACTION_TYPES.INCOME, label: 'Income' },
    { value: TRANSACTION_TYPES.EXPENSE, label: 'Expense' },
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat,
    label: cat,
  }));

  const currencyOptions = CURRENCIES.map(curr => ({
    value: curr.code,
    label: `${curr.code} (${curr.symbol})`,
  }));

  const getInputClassName = (field) => {
    const baseClass = "w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all";
    if (touched[field] && errors[field]) {
      return `${baseClass} border-rose-500 focus:ring-rose-500 focus:border-rose-500`;
    }
    if (touched[field] && !errors[field]) {
      return `${baseClass} border-green-500 focus:ring-green-500 focus:border-green-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-transparent`;
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <div className="relative">
            <input
              id="description"
              type="text"
              placeholder="e.g., Grocery shopping"
              value={description}
              onChange={handleDescriptionChange}
              onBlur={() => handleBlur('description')}
              className={getInputClassName('description')}
              aria-label="Transaction description"
              aria-invalid={touched.description && errors.description ? 'true' : 'false'}
            />
            {touched.description && !errors.description && description && (
              <span className="absolute right-3 top-2.5 text-green-500">✓</span>
            )}
          </div>
          {touched.description && errors.description && (
            <p className="mt-1 text-xs text-rose-600 animate-shake">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                onBlur={() => handleBlur('amount')}
                step="0.01"
                className={getInputClassName('amount')}
                aria-label="Transaction amount"
                aria-invalid={touched.amount && errors.amount ? 'true' : 'false'}
              />
              {touched.amount && !errors.amount && amount && (
                <span className="absolute right-3 top-2.5 text-green-500">✓</span>
              )}
            </div>
            {touched.amount && errors.amount && (
              <p className="mt-1 text-xs text-rose-600 animate-shake">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Currency"
            >
              {currencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Transaction type"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Transaction category"
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add transaction"
          >
            Add Transaction
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
