import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import Button from './Button';

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-navy-900`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModalActions({ onCancel, onConfirm, confirmText = 'Confirm', loading, danger }) {
  return (
    <>
      <Button variant="outline" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </>
  );
}
