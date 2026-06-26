import React from 'react';
import { Volume2, Mic, Sparkles, MessageSquareDot } from 'lucide-react';

export default function QuestionCard({ 
  questionText, 
  isFollowUp, 
  isSpeaking, 
  isListening, 
  isProcessing,
  questionNumber
}) {
  return (
    <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header / Status Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI Interviewer</span>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Question {questionNumber || 1}
              {isFollowUp && (
                <span className="inline-flex items-center rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-400 border border-violet-500/20">
                  Follow-up
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Dynamic status badge */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              Speaking...
            </span>
          )}
          {isListening && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 animate-pulse">
              <Mic className="w-3.5 h-3.5" />
              Listening...
            </span>
          )}
          {isProcessing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
              <MessageSquareDot className="w-3.5 h-3.5 animate-spin" />
              Processing...
            </span>
          )}
        </div>
      </div>

      {/* Main Question Text */}
      <div className="min-h-[120px] flex items-center mb-8">
        <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed whitespace-pre-wrap">
          {questionText || "Preparing your first question..."}
        </p>
      </div>

      {/* Visualizer Waveform Animation */}
      <div className="h-10 flex items-center justify-center gap-1 bg-slate-950/40 rounded-2xl border border-slate-900/60 px-4">
        {isSpeaking && (
          <div className="flex items-end justify-center gap-1 h-6">
            {[1.2, 1.8, 1.1, 1.6, 2.1, 1.4, 1.7, 2.3, 1.2, 1.9, 1.5, 1.8, 1.1, 1.6, 1.4, 2.0, 1.5].map((speed, i) => (
              <span 
                key={i} 
                className="w-1 bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  height: '100%',
                  animationName: 'wave',
                  animationDuration: `${speed}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out'
                }} 
              />
            ))}
          </div>
        )}
        
        {isListening && (
          <div className="flex items-end justify-center gap-1 h-6">
            {[1.5, 0.9, 1.3, 1.7, 1.0, 1.4, 0.8, 1.2, 1.6, 1.1, 1.5, 0.9].map((speed, i) => (
              <span 
                key={i} 
                className="w-1 bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  height: '100%',
                  animationName: 'wave',
                  animationDuration: `${speed}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out'
                }} 
              />
            ))}
          </div>
        )}

        {!isSpeaking && !isListening && (
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse" />
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave {
          0%, 100% { height: 15%; }
          50% { height: 85%; }
        }
      `}} />
    </div>
  );
}
