import { useState, useEffect } from 'react';
import { CURRENCIES, BASE_CURRENCY, TRANSACTION_TYPES } from '../constants';

export default function EditTransactionModal({ transaction, isOpen, onClose, onSave, categories }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(TRANSACTION_TYPES.EXPENSE);
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState(BASE_CURRENCY);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction && isOpen) {
      setDescription(transaction.description);
      setAmount(Math.abs(transaction.amount));
      setType(transaction.type);
      setCategory(transaction.category);
      setCurrency(transaction.currency || BASE_CURRENCY);
      // Format date for input[type="date"] which expects YYYY-MM-DD
      const dateObj = new Date(transaction.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      setDate(formattedDate);
      setError('');
    }
  }, [transaction, isOpen]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-6">
      {/* Edit Transaction Modal */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-200/50">
          <div>
            <h2 className="text-xl font-bold text-primary tracking-tight">Edit Transaction</h2>
            <p className="text-xs text-slate-500 mt-0.5">Refine transaction details for precise bookkeeping.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-full transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Amount, Currency and Type Row */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="block text-[11px] font-bold tracking-widest text-slate-500 mb-1.5 uppercase">
                Amount
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  {CURRENCIES.find(c => c.code === currency)?.symbol || '$'}
                </span>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg text-primary font-semibold focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" 
                />
              </div>
            </div>
            <div className="col-span-4">
              <label className="block text-[11px] font-bold tracking-widest text-slate-500 mb-1.5 uppercase">
                Currency
              </label>
              <div className="relative">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white/50 border border-slate-200 rounded-lg text-primary font-medium focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none appearance-none cursor-pointer"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.code}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-[11px] font-bold tracking-widest text-slate-500 mb-1.5 uppercase">
                Type
              </label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white/50 border border-slate-200 rounded-lg text-primary font-medium focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value={TRANSACTION_TYPES.INCOME}>Income</option>
                  <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
            </div>
          </div>

          {/* Category Row */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-slate-500 mb-1.5 uppercase">
                Category
              </label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-white/50 border border-slate-200 rounded-lg text-primary font-medium focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">category</span>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-slate-500 mb-1.5 uppercase">
              Date
            </label>
            <div className="relative group">
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg text-primary font-medium focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" 
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">calendar_today</span>
            </div>
          </div>

          {/* Payee / Payer (Description) */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-slate-500 mb-1.5 uppercase">
              Description
            </label>
            <div className="relative group">
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg text-primary font-medium focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" 
                placeholder="Search or enter entity name..." 
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">business</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/50 rounded-lg transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-2.5 text-sm font-bold text-white bg-[#4a41e1] hover:bg-[#4a41e1]/90 shadow-lg shadow-indigo-500/20 rounded-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Save transaction</span>
            </button>
          </div>
        </form>

        {/* Metadata footer */}
        <div className="px-8 py-4 bg-slate-100/50 border-t border-slate-200/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Verified Transaction</span>
          </div>
          <div className="text-[10px] text-slate-400 uppercase">
            ID: {transaction.id ? transaction.id.substring(0, 8) : 'NEW'}
          </div>
        </div>
      </div>
    </div>
  );
}
