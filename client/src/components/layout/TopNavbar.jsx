import { Menu, Bot } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext.jsx';
import { ThemeSwitcher } from '../ui/ThemeSwitcher.jsx';
import { NotificationButton } from '../ui/NotificationButton.jsx';
import { UserMenu } from '../ui/UserMenu.jsx';
import { useLocation } from 'react-router-dom';

export const TopNavbar = () => {
  const { toggleSidebar } = useLayout();
  const location = useLocation();

  // Simple breadcrumb placeholder based on path
  const pathName = location.pathname.split('/')[1] || 'Dashboard';
  const pageTitle = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-surface-light px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-surface-dark">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Toggle sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* PlacementPilot Logo */}
      <div className="flex items-center gap-2 ml-2">
        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">PlacementPilot</span>
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-4 hidden sm:block" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center text-lg font-semibold text-slate-900 dark:text-white">
          {pageTitle}
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeSwitcher />
          <NotificationButton />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
