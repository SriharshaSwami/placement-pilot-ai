import React from 'react';
import { MessageSquare, Cpu, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export default function QuestionFeedback({ questionAnalysis, questionText, candidateAnswer }) {
  if (!questionAnalysis) return null;

  const { communicationFeedback, technicalFeedback, suggestedBetterAnswer, learningResources } = questionAnalysis;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-4 space-y-6">
      
      {/* Communication Coaching */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Communication Coach
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <div className="text-xs text-slate-500">Clarity</div>
            <div className="font-bold text-indigo-400">{communicationFeedback.clarity}/10</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <div className="text-xs text-slate-500">Structure</div>
            <div className="font-bold text-indigo-400">{communicationFeedback.structure}/10</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <div className="text-xs text-slate-500">Pace</div>
            <div className="font-bold text-slate-300">{communicationFeedback.speakingPace}</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <div className="text-xs text-slate-500">Filler Density</div>
            <div className="font-bold text-amber-400">{communicationFeedback.fillerDensity}</div>
          </div>
        </div>
        
        {communicationFeedback.fillerWords && communicationFeedback.fillerWords.length > 0 && (
          <div className="text-sm text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4">
            <span className="font-semibold text-amber-500">Detected Fillers:</span> {communicationFeedback.fillerWords.join(', ')}
          </div>
        )}

        {communicationFeedback.starDetection && !communicationFeedback.starDetection.usedStar && (
          <div className="text-sm text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 mb-4 flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold block">Missed STAR Structure</span>
              Your behavioral answer missed: {communicationFeedback.starDetection.missingComponents.join(', ')}. Try using Situation, Task, Action, Result.
            </div>
          </div>
        )}
        
        <p className="text-sm text-slate-300 bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/20 leading-relaxed">
          {communicationFeedback.feedback}
        </p>
      </div>

      {/* Technical Coaching */}
      <div className="border-t border-slate-800 pt-6">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-emerald-400" />
          Technical Review
        </h4>
        <div className="flex gap-4 mb-4">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex-1">
            <div className="text-xs text-slate-500">Technical Depth</div>
            <div className="font-bold text-emerald-400">{technicalFeedback.technicalDepth}</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex-1">
            <div className="text-xs text-slate-500">Precision</div>
            <div className="font-bold text-emerald-400">{technicalFeedback.precision}/10</div>
          </div>
        </div>
        <p className="text-sm text-slate-300 bg-emerald-900/10 p-4 rounded-lg border border-emerald-500/20 leading-relaxed">
          {technicalFeedback.feedback}
        </p>
      </div>

      {/* Ideal Answer & Resources */}
      <div className="border-t border-slate-800 pt-6 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-primary-400" />
            Suggested Better Answer
          </h4>
          <p className="text-sm text-slate-400 italic bg-slate-950 p-4 rounded-lg border border-slate-800">
            &quot;{suggestedBetterAnswer}&quot;
          </p>
        </div>
        
        {learningResources && learningResources.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Recommended Study
            </h4>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
              {learningResources.map((res, i) => <li key={i}>{res}</li>)}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
