import { NavLink } from 'react-router-dom';
import { navItems } from './Sidebar';

export default function MobileNav() {
  // return (
  //   <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white lg:hidden dark:border-slate-700 dark:bg-navy-900">
  //     <div className="flex justify-around px-1 py-2">
  //       {navItems.slice(0, 5).map(({ to, label, icon: Icon }) => (
  //         <NavLink
  //           key={to}
  //           to={to}
  //           className={({ isActive }) =>
  //             `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-medium ${
  //               isActive
  //                 ? 'text-emerald-600 dark:text-emerald-400'
  //                 : 'text-slate-500 dark:text-slate-400'
  //             }`
  //           }
  //         >
  //           <Icon className="h-5 w-5" />
  //           <span className="truncate">{label.split(' ')[0]}</span>
  //         </NavLink>
  //       ))}
  //     </div>
  //   </nav>
  // );
}
