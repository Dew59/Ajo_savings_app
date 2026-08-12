import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function AuthLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/login" className="flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 font-bold">
            A
          </div>
          <span className="font-semibold">Ajo Savings Tracker</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-300 hover:bg-navy-800"
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
