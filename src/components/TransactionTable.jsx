import { useState } from 'react';
import EditTransactionModal from './EditTransactionModal';
import DeleteTransactionModal from './DeleteTransactionModal';
import { formatCurrency, formatDate } from '../utils';
import { BASE_CURRENCY, CATEGORY_COLORS } from '../constants';

function TransactionTable({ transactions, onDeleteTransaction, onEditTransaction, categories }) {
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleSave = updatedTransaction => {
    onEditTransaction(updatedTransaction);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  const handleConfirmDelete = (id) => {
    onDeleteTransaction(id);
    setDeletingId(null);
  };

  const getCategoryColors = (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500" role="status" aria-live="polite">
        <p>No transactions yet. Add your first transaction!</p>
      </div>
    );
  }

  const transactionToEdit = transactions.find(t => t.id === editingId);
  const transactionToDelete = transactions.find(t => t.id === deletingId);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Transactions list">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                scope="col"
                className="text-left py-4 px-6 text-label-md font-medium text-slate-500 uppercase"
              >
                Date
              </th>
              <th
                scope="col"
                className="text-left py-4 px-6 text-label-md font-medium text-slate-500 uppercase"
              >
                Description
              </th>
              <th
                scope="col"
                className="text-left py-4 px-6 text-label-md font-medium text-slate-500 uppercase"
              >
                Category
              </th>
              <th
                scope="col"
                className="text-right py-4 px-6 text-label-md font-medium text-slate-500 uppercase"
              >
                Amount
              </th>
              <th
                scope="col"
                className="text-right py-4 px-6 text-label-md font-medium text-slate-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-100 transition-colors">
                  <td className="py-4 px-6 text-body-md text-slate-600">{formatDate(t.date)}</td>
                  <td className="py-4 px-6 text-body-md font-medium text-slate-900">{t.description}</td>
                  <td className="py-4 px-6 text-body-md">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium border ${getCategoryColors(t.category).bg} ${getCategoryColors(t.category).text} ${getCategoryColors(t.category).border}`}>
                      {t.category}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-6 text-body-md font-semibold text-right tabular-nums ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(t.amount), t.currency || BASE_CURRENCY)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingId(t.id)}
                        className="p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-200 rounded-lg transition-colors"
                        aria-label={`Edit ${t.description} transaction`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingId(t.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        aria-label={`Delete ${t.description} transaction`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditTransactionModal
        transaction={transactionToEdit}
        isOpen={editingId !== null}
        onClose={handleCancelEdit}
        onSave={handleSave}
        categories={categories}
      />
      <DeleteTransactionModal
        transaction={transactionToDelete}
        isOpen={deletingId !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default TransactionTable;

