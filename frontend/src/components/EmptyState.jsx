export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-600 dark:bg-navy-900/50">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
