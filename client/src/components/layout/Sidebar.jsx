import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  CheckSquare, 
  Video, 
  Bot, 
  UserCircle, 
  Settings,
  Menu,
  X,
  Search
} from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext.jsx';
import { classNames } from '../../utils/formatters.js';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume Builder', href: '/resume', icon: FileText },
  { name: 'Job Board', href: '/jobs', icon: Briefcase },
  { name: 'Applications', href: '/applications', icon: CheckSquare },
  { name: 'Interview Prep', href: '/interview', icon: Video },
  { name: 'Semantic Search', href: '/search', icon: Search },
  { name: 'AI Assistant', href: '/ai', icon: Bot },
];

const secondaryNavigation = [
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useLayout();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Component */}
      <div className={classNames(
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">PlacementPilot</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Area */}
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50',
                    'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors'
                  )
                }
                onClick={() => window.innerWidth < 1024 && closeSidebar()}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account
            </h3>
            <div className="mt-2 space-y-1">
              {secondaryNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50',
                      'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors'
                    )
                  }
                  onClick={() => window.innerWidth < 1024 && closeSidebar()}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
