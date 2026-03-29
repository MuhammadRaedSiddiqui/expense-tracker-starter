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
      <div className="empty-state">
        <p>No transactions yet. Add your first transaction above!</p>
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Actions</th>
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
                <button onClick={() => setEditingId(t.id)}>Edit</button>
                <button onClick={() => onDeleteTransaction(t.id)}>Delete</button>
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
