import { useState } from 'react'
import EditTransactionForm from './EditTransactionForm'

function TransactionTable({ transactions, onDeleteTransaction, onEditTransaction, categories }) {
  const [editingId, setEditingId] = useState(null);

  const handleSave = (updatedTransaction) => {
    onEditTransaction(updatedTransaction);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

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
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td className={t.type === "income" ? "income-amount" : "expense-amount"}>
                {t.type === "income" ? "+" : "-"}${t.amount}
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
