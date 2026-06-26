import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, ShieldCheck, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import QuestionFeedback from './QuestionFeedback.jsx';

export default function AnswerTimeline({ questions, coachingReport }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary-500" />
        Interview Timeline & Coaching
      </h3>
      
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const coachingData = coachingReport?.questionAnalysis?.find(qa => qa.sequenceNumber === q.sequenceNumber);
          return <TimelineItem key={idx} question={q} index={idx} coachingData={coachingData} />;
        })}
      </div>
    </div>
  );
}

function TimelineItem({ question: q, index, coachingData }) {
  const [expanded, setExpanded] = useState(false);
  const evalData = q.evaluation;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
      <div 
        className="p-5 flex items-start justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {index + 1}</span>
            {q.isFollowUp && <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase">Follow-up</span>}
          </div>
          <p className="text-sm font-medium text-slate-200">{q.questionText}</p>
        </div>
        <div className="flex items-center gap-4 mt-1">
          {evalData && (
            <div className="hidden sm:flex items-center gap-3 mr-4 text-xs font-semibold">
              <span className="text-emerald-400" title="Technical Accuracy">T: {evalData.technicalAccuracy}/10</span>
              <span className="text-blue-400" title="Communication">C: {evalData.communicationScore}/10</span>
            </div>
          )}
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </div>

      {expanded && (
        <div className="p-5 pt-0 border-t border-slate-800/60 bg-slate-900/80">
          <div className="mt-5 space-y-6">
            
            {/* Candidate Answer */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Answer</h4>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {q.candidateAnswer || <span className="text-slate-600 italic">No answer provided.</span>}
              </div>
            </div>

            {/* Evaluation Data */}
            {evalData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Feedback Column */}
                <div className="space-y-4">
                  {evalData.strengths?.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Strengths
                      </h4>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {evalData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {evalData.weaknesses?.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                        <AlertTriangle className="w-3.5 h-3.5" /> Areas to Improve
                      </h4>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {evalData.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}

                  {evalData.criticalMistakes?.length > 0 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                        <ShieldAlert className="w-3.5 h-3.5" /> Critical Mistakes
                      </h4>
                      <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                        {evalData.criticalMistakes.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Ideal Answer Column */}
                <div>
                  <div className="p-5 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-indigo-500/20 rounded-xl h-full">
                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
                      <Sparkles className="w-3.5 h-3.5" /> The Ideal 10/10 Answer
                    </h4>
                    <p className="text-sm text-indigo-100/80 leading-relaxed whitespace-pre-wrap">
                      {evalData.idealAnswer}
                    </p>
                    
                    {evalData.improvementSuggestions?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-indigo-500/20">
                        <h5 className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest mb-2">Pro Tips</h5>
                        <ul className="list-disc list-inside text-xs text-indigo-200/70 space-y-1">
                          {evalData.improvementSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">Evaluation not available for this question.</div>
            )}

            {/* Deep Coaching Feedback */}
            <QuestionFeedback 
              questionAnalysis={coachingData} 
              questionText={q.questionText} 
              candidateAnswer={q.candidateAnswer} 
            />

          </div>
        </div>
      )}
    </div>
  );
}
