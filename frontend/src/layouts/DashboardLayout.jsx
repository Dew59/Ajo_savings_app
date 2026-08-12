import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your savings activity' },
  '/groups': { title: 'Groups', subtitle: 'Manage your ajo groups' },
  '/contributions': { title: 'Contributions', subtitle: 'Track your contributions' },
  '/cycles': { title: 'Cycles', subtitle: 'Active and past contribution cycles' },
  '/payout-order': { title: 'Payout Order', subtitle: 'View payout rotation across groups' },
  '/profile': { title: 'Profile', subtitle: 'Manage your account settings' },
};

function getPageMeta(pathname) {
  if (pathname.startsWith('/groups/') && pathname.includes('/cycles/')) {
    return { title: 'Cycle Details', subtitle: 'View cycle information and contributions' };
  }
  if (pathname.startsWith('/groups/') && pathname.endsWith('/cycles')) {
    return { title: 'Group Cycles', subtitle: 'Cycle history for this group' };
  }
  if (pathname.startsWith('/groups/')) {
    return { title: 'Group Details', subtitle: 'Members, settings and actions' };
  }
  return pageTitles[pathname] || { title: 'Ajo Savings', subtitle: '' };
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = getPageMeta(pathname);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-navy-950">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0">
          <Sidebar />
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/60"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="relative z-10 h-full w-64">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden px-4 py-6 pb-24 lg:px-6 lg:pb-6">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
