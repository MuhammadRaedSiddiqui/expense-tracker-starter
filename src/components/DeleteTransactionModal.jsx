import { formatCurrency, formatDate } from '../utils';
import { BASE_CURRENCY } from '../constants';

export default function DeleteTransactionModal({ transaction, isOpen, onClose, onConfirm }) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]">
      {/* Modal Card (Glassmorphic) */}
      <div className="relative w-full max-w-md mx-4 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-xl p-8 flex flex-col gap-6 overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined" data-icon="warning" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Delete Transaction</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 relative z-10">
          <p className="text-slate-600 leading-relaxed font-normal text-sm">
            Are you sure you want to delete this transaction? This action is permanent and cannot be undone.
          </p>

          {/* Context Card (Selected Transaction Preview) */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-700 truncate">{transaction.description}</div>
                <div className="text-xs text-slate-500 truncate">{transaction.category} • {formatDate(transaction.date)}</div>
              </div>
            </div>
            <div className={`text-sm font-bold ml-4 whitespace-nowrap ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(Math.abs(transaction.amount), transaction.currency || BASE_CURRENCY)}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
          <button 
            onClick={onClose}
            className="flex-1 order-2 sm:order-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all duration-200 active:opacity-70"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm(transaction.id);
              onClose();
            }}
            className="flex-1 order-1 sm:order-2 px-4 py-2.5 rounded-lg text-sm font-bold border-[1.5px] border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-200 active:scale-[0.98]"
          >
            Delete transaction
          </button>
        </div>
      </div>
    </div>
  );
}
