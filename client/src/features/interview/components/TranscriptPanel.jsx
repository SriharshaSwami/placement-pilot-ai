import React from 'react';
import { MessageSquare, ArrowRight, User } from 'lucide-react';

export default function TranscriptPanel({ questions }) {
  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/30 border border-slate-800/80 rounded-2xl min-h-[200px]">
        <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
        <p className="text-sm font-semibold text-slate-500">No history yet</p>
        <p className="text-xs text-slate-600 mt-1">Start answering questions to build history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-primary-400" />
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interview Dialogue Log</h3>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {questions.map((q, idx) => (
          <div key={idx} className="space-y-3 p-4 bg-slate-900/20 border border-slate-900 rounded-2xl">
            {/* Interviewer Question */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs flex-shrink-0">
                AI
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interviewer Q{q.sequenceNumber}</span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{q.questionText}</p>
              </div>
            </div>

            {/* Candidate Answer */}
            {q.candidateAnswer ? (
              <div className="flex gap-3 border-t border-slate-900/60 pt-3">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-xs flex-shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-semibold">Your Answer</span>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{q.candidateAnswer}</p>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-amber-500/70 italic pl-10">
                Awaiting response...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
