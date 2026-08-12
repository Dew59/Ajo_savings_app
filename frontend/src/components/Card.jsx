export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-navy-900 ${padding ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        {title && (
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
