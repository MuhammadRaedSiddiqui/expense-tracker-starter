import { TRANSACTION_TYPES, BASE_CURRENCY } from '../constants'
import { formatCurrency, convertToBaseCurrency } from '../utils'

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => {
      const amountInBase = convertToBaseCurrency(parseFloat(t.amount), t.currency || BASE_CURRENCY);
      return sum + amountInBase;
    }, 0);

  const totalExpenses = transactions
    .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => {
      const amountInBase = convertToBaseCurrency(parseFloat(t.amount), t.currency || BASE_CURRENCY);
      return sum + amountInBase;
    }, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="summary">
      <div className="summary-card">
        <h3>Income</h3>
        <p className="income-amount">{formatCurrency(totalIncome, BASE_CURRENCY)}</p>
      </div>
      <div className="summary-card">
        <h3>Expenses</h3>
        <p className="expense-amount">{formatCurrency(totalExpenses, BASE_CURRENCY)}</p>
      </div>
      <div className="summary-card">
        <h3>Balance</h3>
        <p className="balance-amount">{formatCurrency(balance, BASE_CURRENCY)}</p>
      </div>
    </div>
  );
}

export default Summary;
