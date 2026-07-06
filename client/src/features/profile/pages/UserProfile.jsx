import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { User, Mail, Briefcase, MapPin, Save, Camera } from 'lucide-react';

const UserProfile = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000); // Scaffold save delay
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <PageHeader 
        title="Your Profile" 
        description="Manage your personal details and professional identity." 
      />

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-fuchsia-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" defaultValue="John Doe" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="email" defaultValue="john.doe@example.com" disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Role / Target Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" defaultValue="Software Engineer" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" defaultValue="San Francisco, CA" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Professional Summary</label>
              <textarea 
                rows="4" 
                className="w-full p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                defaultValue="Passionate software engineer with 3+ years of experience building scalable web applications. Currently preparing for backend engineering roles."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
