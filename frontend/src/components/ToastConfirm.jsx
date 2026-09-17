import { toast } from 'react-toastify';

const ToastConfirm = ({ message, confirmLabel, cancelLabel, onConfirm, closeToast }) => {
  const confirm = async () => {
    closeToast();
    await onConfirm();
  };

  return (
    <div>
      <p className="font-semibold">{message}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={confirm} className="rounded bg-white px-3 py-1 text-sm font-semibold text-emerald-800">
          {confirmLabel}
        </button>
        <button type="button" onClick={closeToast} className="rounded border border-white/70 px-3 py-1 text-sm font-semibold text-white">
          {cancelLabel}
        </button>
      </div>
    </div>
  );
};

export const showToastConfirm = ({ message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm }) => {
  toast(({ closeToast }) => (
    <ToastConfirm
      message={message}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onConfirm={onConfirm}
      closeToast={closeToast}
    />
  ), { autoClose: false, closeOnClick: false, closeButton: false });
};
