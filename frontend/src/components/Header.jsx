import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/format';

export default function Header({ title, subtitle, onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-navy-950/95">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-navy-800"
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800 lg:hidden"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
              {getInitials(user?.name)}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 md:inline dark:text-slate-200">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
