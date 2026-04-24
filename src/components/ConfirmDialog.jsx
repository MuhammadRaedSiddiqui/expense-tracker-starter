import Modal from './Modal';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmStyle = 'danger' }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmButtonClasses = confirmStyle === 'danger'
    ? 'px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all shadow-lg transform hover:scale-105'
    : 'px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all shadow-lg transform hover:scale-105';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{message}</p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={confirmButtonClasses}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
