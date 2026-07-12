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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-label-md font-medium text-slate-500 uppercase mb-2">
          Total Income
        </p>
        <p className="text-headline-sm text-emerald-600">
          {formatCurrency(totalIncome, BASE_CURRENCY)}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-label-md font-medium text-slate-500 uppercase mb-2">
          Total Expenses
        </p>
        <p className="text-headline-sm text-rose-600">
          {formatCurrency(totalExpenses, BASE_CURRENCY)}
        </p>
      </div>
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-6 shadow-sm">
        <p className="text-label-md font-medium text-slate-300 uppercase mb-2">Balance</p>
        <p
          className={`text-headline-sm ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}
        >
          {formatCurrency(balance, BASE_CURRENCY)}
        </p>
      </div>
    </div>
  );
}

export default memo(Summary);
