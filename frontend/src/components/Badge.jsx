const colors = {
  emerald:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  amber:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  slate:
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export default function Badge({ children, color = 'slate', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color] || colors.slate} ${className}`}
    >
      {children}
    </span>
  );
}
