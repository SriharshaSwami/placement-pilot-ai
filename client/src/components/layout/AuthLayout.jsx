import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
      
      {/* Left side: Branding / Decor */}
      <div className="relative hidden md:flex flex-col flex-1 items-center justify-center overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[80%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
        
        <div className="z-10 text-center px-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              PlacementPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">AI</span>
            </span>
          </Link>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
            Supercharge your placement journey with an autonomous AI orchestrator acting as your personal career strategist.
          </p>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-slate-950 relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="w-full max-w-md z-10 relative">
          <div className="p-8 sm:p-10 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            
            {children ? children : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};
