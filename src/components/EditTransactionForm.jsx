import { useState } from 'react'

function EditTransactionForm({ transaction, onSave, onCancel, categories }) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(transaction.type);
  const [category, setCategory] = useState(transaction.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const updatedTransaction = {
      ...transaction,
      description,
      amount: parseFloat(amount),
      type,
      category,
    };

    onSave(updatedTransaction);
  };

  return (
    <tr>
      <td>{transaction.date}</td>
      <td>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </td>
      <td>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </td>
      <td>
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
}

export default EditTransactionForm;
