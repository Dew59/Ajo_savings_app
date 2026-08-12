import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const variants = {
  error: {
    icon: FiAlertCircle,
    className:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300',
  },
  success: {
    icon: FiCheckCircle,
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300',
  },
  info: {
    icon: FiInfo,
    className:
      'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300',
  },
};

export default function Alert({ variant = 'error', message, onDismiss }) {
  if (!message) return null;

  const { icon: Icon, className } = variants[variant];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${className}`}
      role="alert"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-sm underline"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
