import { useMemo, memo } from 'react';
import { TRANSACTION_TYPES, BASE_CURRENCY } from '../constants';
import { formatCurrency, convertToBaseCurrency } from '../utils';

function Summary({ transactions, exchangeRates }) {
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => {
        const amountInBase = convertToBaseCurrency(
          parseFloat(t.amount) || 0,
          t.currency || BASE_CURRENCY,
          exchangeRates
        );
        return sum + amountInBase;
      }, 0);
  }, [transactions, exchangeRates]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => {
        const amountInBase = convertToBaseCurrency(
          parseFloat(t.amount) || 0,
          t.currency || BASE_CURRENCY,
          exchangeRates
        );
        return sum + amountInBase;
      }, 0);
  }, [transactions, exchangeRates]);

  const balance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
          Total Income
        </p>
        <p className="text-2xl font-semibold text-emerald-600">
          {formatCurrency(totalIncome, BASE_CURRENCY)}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
          Total Expenses
        </p>
        <p className="text-2xl font-semibold text-rose-600">
          {formatCurrency(totalExpenses, BASE_CURRENCY)}
        </p>
      </div>
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-8 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02]">
        <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Balance</p>
        <p
          className={`text-5xl font-bold ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}
        >
          {formatCurrency(balance, BASE_CURRENCY)}
        </p>
      </div>
    </div>
  );
}

export default memo(Summary);
