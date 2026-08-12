import Modal, { ModalActions } from './Modal';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  loading = false,
  danger = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <ModalActions
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmText={confirmText}
          loading={loading}
          danger={danger}
        />
      }
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </Modal>
  );
}
