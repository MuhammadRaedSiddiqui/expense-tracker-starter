import { useState } from 'react'
import EditTransactionForm from './EditTransactionForm'
import { formatCurrency, formatDate } from '../utils'

function TransactionTable({ transactions, onDeleteTransaction, onEditTransaction, categories }) {
  const [editingId, setEditingId] = useState(null);

  const handleSave = (updatedTransaction) => {
    onEditTransaction(updatedTransaction);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <p>No transactions yet. Add your first transaction above!</p>
      </div>
    );
  }

  return (
    <table role="table" aria-label="Transactions list">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Description</th>
          <th scope="col">Category</th>
          <th scope="col">Amount</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(t => (
          editingId === t.id ? (
            <EditTransactionForm
              key={t.id}
              transaction={t}
              onSave={handleSave}
              onCancel={handleCancel}
              categories={categories}
            />
          ) : (
            <tr key={t.id}>
              <td>{formatDate(t.date)}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td className={t.type === "income" ? "income-amount" : "expense-amount"}>
                {t.type === "income" ? "+" : "-"}{formatCurrency(Math.abs(t.amount))}
              </td>
              <td>
                <button onClick={() => setEditingId(t.id)} aria-label={`Edit ${t.description} transaction`}>Edit</button>
                <button onClick={() => onDeleteTransaction(t.id)} aria-label={`Delete ${t.description} transaction`}>Delete</button>
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
