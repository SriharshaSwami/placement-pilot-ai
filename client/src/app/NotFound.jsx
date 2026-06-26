import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
      
      <div className="z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-24 h-24 mb-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center animate-[bounce_3s_infinite]">
          <Compass className="w-12 h-12 text-indigo-400" />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-4">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Lost in hyperspace
        </h2>
        
        <p className="text-lg text-slate-400 mb-12 max-w-md mx-auto leading-relaxed">
          The career coordinate you are looking for does not exist in our database. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/dashboard" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-medium py-3 px-8 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)]">
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="group flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 px-8 rounded-full transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
