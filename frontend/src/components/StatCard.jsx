export default function StatCard({ label, value, icon: Icon, trend, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-navy-900 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 truncate text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
