import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiRefreshCw,
  FiAward,
  FiUser,
  FiLogOut,
  FiMoon,
  FiSun,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/format';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/groups', label: 'Groups', icon: FiUsers },
  { to: '/contributions', label: 'Contributions', icon: FiDollarSign },
  { to: '/cycles', label: 'Cycles', icon: FiRefreshCw },
  { to: '/payout-order', label: 'Payout Order', icon: FiAward },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-emerald-600 text-white'
            : 'text-slate-300 hover:bg-navy-800 hover:text-white'
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-navy-900 text-white">
      <div className="border-b border-navy-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 font-bold">
            A
          </div>
          <div>
            <p className="font-semibold">Ajo Savings</p>
            <p className="text-xs text-slate-400">Tracker</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-navy-800 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-navy-800 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-800 px-3 py-2 text-sm text-slate-300 hover:bg-navy-700"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-800 px-3 py-2 text-sm text-slate-300 hover:bg-red-900/50 hover:text-red-300"
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export { navItems };
