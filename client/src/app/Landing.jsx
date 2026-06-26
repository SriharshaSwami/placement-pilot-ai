import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BrainCircuit, Target, Briefcase } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 overflow-hidden relative font-sans">
      
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PlacementPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
          <Link to="/register" className="text-sm font-medium bg-white text-slate-900 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>The Next-Generation Career Intelligence Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
          Supercharge your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">Placement Journey</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          An autonomous AI orchestrator that analyzes your resume, conducts mock interviews, tracks applications, and actively strategizes your career roadmap.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/register" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-medium transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
            Launch Platform
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-medium transition-colors border border-slate-700">
            Sign In to Dashboard
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 text-left w-full">
          {[
            { icon: BrainCircuit, title: "Multi-Agent AI Engine", desc: "A swarm of specialized agents working together to tailor your resume and prep you for interviews.", color: "text-indigo-400", bg: "bg-indigo-400/10" },
            { icon: Target, title: "Smart Skill Gap Analysis", desc: "Instantly identifies missing skills for your target roles and generates a personalized learning roadmap.", color: "text-fuchsia-400", bg: "bg-fuchsia-400/10" },
            { icon: Briefcase, title: "Intelligent CRM", desc: "Track every job application with AI-generated strategic insights and momentum health scores.", color: "text-rose-400", bg: "bg-rose-400/10" },
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-6`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
