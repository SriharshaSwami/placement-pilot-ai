import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Bell, Moon, Sun, Shield, Settings2, Trash2 } from 'lucide-react';
import { useModal } from '../../../contexts/ModalContext.jsx';
import toast from 'react-hot-toast';

const UserSettings = () => {
  const { confirm } = useModal();
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete Account',
      description: 'Are you sure you want to permanently delete your account and all associated data? This action is irreversible.',
      confirmLabel: 'Delete Permanently',
      cancelLabel: 'Cancel',
      isDestructive: true,
    });
    if (confirmed) {
      toast.error('Account deletion is disabled in the preview environment.');
    }
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and application settings." 
      />

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h3>
              <p className="text-sm text-slate-500">Customize how the application looks on your device.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <Sun className="w-6 h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="font-medium text-slate-900 dark:text-white">Light</span>
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <Moon className="w-6 h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="font-medium text-slate-900 dark:text-white">Dark</span>
            </button>
            <button 
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <Settings2 className="w-6 h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="font-medium text-slate-900 dark:text-white">System</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-slate-500">Control what alerts you receive and how.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive daily summaries and interview reminders via email.</p>
              </div>
              <button 
                onClick={() => toggleNotification('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-slate-500">Get notified in your browser for urgent alerts.</p>
              </div>
              <button 
                onClick={() => toggleNotification('push')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.push ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Product Updates</p>
                <p className="text-sm text-slate-500">Hear about new AI features and platform improvements.</p>
              </div>
              <button 
                onClick={() => toggleNotification('updates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.updates ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.updates ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Danger Zone</h3>
              <p className="text-sm text-slate-500">Irreversible account actions.</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Delete Account</p>
              <p className="text-sm text-slate-500">Permanently delete your account and all associated data.</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
