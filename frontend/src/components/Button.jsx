const variants = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600',
  secondary:
    'bg-navy-800 text-white hover:bg-navy-900 focus-visible:ring-navy-500 dark:bg-navy-700 dark:hover:bg-navy-600',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-slate-600 dark:bg-navy-900 dark:text-slate-200 dark:hover:bg-navy-800',
  ghost:
    'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 dark:text-slate-200 dark:hover:bg-navy-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-navy-950 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
