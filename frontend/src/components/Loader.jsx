export default function Loader({ size = 'md', className = '', label = 'Loading...' }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={label}
    >
      <div
        className={`animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 dark:border-emerald-900 dark:border-t-emerald-400 ${sizes[size]}`}
      />
      {label && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader />
    </div>
  );
}
