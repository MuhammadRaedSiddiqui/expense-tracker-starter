import { useState } from 'react'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import { TRANSACTION_TYPES, CURRENCIES, BASE_CURRENCY } from '../constants'

function TransactionForm({ onAddTransaction, categories }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState(TRANSACTION_TYPES.EXPENSE);
  const [category, setCategory] = useState("food");
  const [currency, setCurrency] = useState(BASE_CURRENCY);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      currency,
      date: new Date().toISOString().split('T')[0],
    };

    onAddTransaction(newTransaction);
    setDescription("");
    setAmount("");
    setType(TRANSACTION_TYPES.EXPENSE);
    setCategory("food");
    setCurrency(BASE_CURRENCY);
  };

  const typeOptions = [
    { value: TRANSACTION_TYPES.INCOME, label: "Income" },
    { value: TRANSACTION_TYPES.EXPENSE, label: "Expense" }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat,
    label: cat
  }));

  const currencyOptions = CURRENCIES.map(curr => ({
    value: curr.code,
    label: `${curr.code} (${curr.symbol})`
  }));

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>
      {error && <div className="error-message" role="alert" aria-live="polite">{error}</div>}
      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Transaction description"
        />
        <FormInput
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-label="Transaction amount"
        />
        <FormSelect
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={currencyOptions}
          aria-label="Currency"
        />
        <FormSelect
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={typeOptions}
          aria-label="Transaction type"
        />
        <FormSelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          aria-label="Transaction category"
        />
        <button type="submit" aria-label="Add transaction">Add</button>
      </form>
    </div>
  );
}

export default TransactionForm;
