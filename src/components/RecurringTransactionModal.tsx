import { useState, useEffect } from 'react';
import { CATEGORIES, CURRENCIES } from '../constants';

interface RecurringTransactionModalProps {
  recurringTransaction?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function RecurringTransactionModal({
  recurringTransaction,
  onClose,
  onSubmit,
}: RecurringTransactionModalProps) {
  const [formData, setFormData] = useState({
    description: recurringTransaction?.description || '',
    amount: recurringTransaction?.amount || '',
    currency: recurringTransaction?.currency || 'USD',
    type: recurringTransaction?.type || 'expense',
    category: recurringTransaction?.category || '',
    frequency: recurringTransaction?.frequency || 'monthly',
    startDate: recurringTransaction?.start_date || new Date().toISOString().split('T')[0],
    endDate: recurringTransaction?.end_date || '',
  });
  const [autoApproval, setAutoApproval] = useState(
    recurringTransaction?.auto_approval ?? true
  );

  useEffect(() => {
    if (recurringTransaction) {
      setFormData({
        description: recurringTransaction.description,
        amount: recurringTransaction.amount.toString(),
        currency: recurringTransaction.currency,
        type: recurringTransaction.type,
        category: recurringTransaction.category,
        frequency: recurringTransaction.frequency,
        startDate: recurringTransaction.start_date,
        endDate: recurringTransaction.end_date || '',
      });
      setAutoApproval(recurringTransaction.auto_approval ?? true);
    }
  }, [recurringTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      endDate: formData.endDate || null,
      auto_approval: autoApproval,
    });
  };

  const availableCategories =
    formData.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  const frequencyText: Record<string, string> = {
    daily: 'every day',
    weekly: 'every week',
    monthly: 'on the same day each month',
    yearly: 'on the same day each year',
  };

  return (
    <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/85 backdrop-blur-xl border border-white/30 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3e465b]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200/60">
            <h3 className="text-lg font-bold text-[#3e465b] tracking-tight">
              {recurringTransaction ? 'Edit Automation' : 'New Automation'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="p-6 space-y-6">
              {/* Field Group: Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    Automation Name
                  </label>
                  <input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    className="w-full h-10 px-3 bg-white/50 border border-slate-300 rounded focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all placeholder:text-slate-400 text-sm"
                    placeholder="e.g., AWS Monthly Infrastructure"
                    type="text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full h-10 px-3 pr-10 bg-white/50 border border-slate-300 rounded appearance-none focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all text-sm"
                    >
                      <option value="">Select category</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Field Group: Type & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value, category: '' })
                      }
                      className="w-full h-10 px-3 pr-10 bg-white/50 border border-slate-300 rounded appearance-none focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all text-sm"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full h-10 px-3 pr-10 bg-white/50 border border-slate-300 rounded appearance-none focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all text-sm"
                    >
                      {CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Field Group: Amount & Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                      className="w-full h-10 pl-7 pr-3 bg-white/50 border border-slate-300 rounded focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    Frequency
                  </label>
                  <div className="relative">
                    <select
                      value={formData.frequency}
                      onChange={(e) =>
                        setFormData({ ...formData, frequency: e.target.value })
                      }
                      className="w-full h-10 px-3 pr-10 bg-white/50 border border-slate-300 rounded appearance-none focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Annual</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Field Group: Start Date & End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                    className="w-full h-10 px-3 bg-white/50 border border-slate-300 rounded focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all text-sm text-slate-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    min={formData.startDate}
                    className="w-full h-10 px-3 bg-white/50 border border-slate-300 rounded focus:ring-1 focus:ring-[#4a41e1]/50 focus:border-[#4a41e1] outline-none transition-all text-sm text-slate-600"
                  />
                </div>
              </div>

              {/* Auto-approval Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.05em] font-semibold uppercase text-slate-500">
                  Auto-approval
                </span>
                <button
                  type="button"
                  onClick={() => setAutoApproval(!autoApproval)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoApproval ? 'bg-[#4a41e1]' : 'bg-slate-200'
                  }`}
                >
                  <span className="sr-only">Toggle auto-approval</span>
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      autoApproval ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Preview Area */}
              <div className="mt-4 p-4 rounded-lg bg-slate-100/40 border border-slate-200/50">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[#5B5BD6]/10 rounded shrink-0">
                    <span
                      className="material-symbols-outlined text-[#5B5BD6]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      info
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#3e465b]">
                      Automation Preview
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      This will create a recurring {formData.type} of{' '}
                      <span className="font-semibold text-slate-900">
                        ${formData.amount || '0.00'}
                      </span>{' '}
                      starting from{' '}
                      {formData.startDate === new Date().toISOString().split('T')[0]
                        ? 'today'
                        : formData.startDate}
                      . Payments will be scheduled automatically{' '}
                      {frequencyText[formData.frequency]}.
                      {formData.endDate && ` Ends on ${formData.endDate}.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-5 bg-slate-50/50 flex items-center justify-end space-x-4 border-t border-slate-200/60 mt-auto relative z-10">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5B5BD6] text-white text-sm font-semibold rounded shadow-md hover:bg-[#4a41e1] active:transform active:scale-[0.98] transition-all"
              >
                {recurringTransaction ? 'Update automation' : 'Save automation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
