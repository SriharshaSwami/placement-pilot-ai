import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useModal } from '../../contexts/ModalContext.jsx';
import toast from 'react-hot-toast';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { confirm } = useModal();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Sign Out',
      description: 'Are you sure you want to sign out of PlacementPilot AI?',
      confirmLabel: 'Sign Out',
      cancelLabel: 'Cancel',
      isDestructive: false,
    });
    if (!confirmed) return;
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-3 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {getInitials(user?.name)}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:ring-slate-700">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-500 truncate dark:text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={() => { setIsOpen(false); navigate('/profile'); }}
            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => { setIsOpen(false); navigate('/settings'); }}
            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
