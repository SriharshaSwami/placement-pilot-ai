import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AnalysisSection } from '@/features/ai/components/AnalysisSection.jsx';
import { Target, TrendingUp, Zap, Sparkles } from 'lucide-react';

export default function CoachingDashboard({ coachingReport }) {
  if (!coachingReport) {
    return (
      <div className="bg-primary-900/10 border border-primary-500/20 rounded-xl p-8 text-center mt-8">
        <Sparkles className="w-8 h-8 text-primary-400 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-100">Generating Deep Coaching Analysis...</h3>
        <p className="text-slate-400 mt-2 text-sm">Our AI is analyzing your communication style, filler words, and technical depth. This may take a few moments. Refresh the page shortly.</p>
      </div>
    );
  }

  const { overallCommunication, visualAnalytics, learningPlan } = coachingReport;

  const commData = Object.keys(visualAnalytics.communicationRadar).map(key => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    A: visualAnalytics.communicationRadar[key],
    fullMark: 100,
  }));

  const techData = Object.keys(visualAnalytics.technicalRadar).map(key => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    A: visualAnalytics.technicalRadar[key],
    fullMark: 100,
  }));

  const confidenceData = visualAnalytics.confidenceTrend.map((val, idx) => ({
    question: `Q${idx + 1}`,
    confidence: val
  }));

  return (
    <div className="space-y-8 mt-12 border-t border-slate-800 pt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
          <Target className="w-6 h-6 text-indigo-400" />
          AI Interview Coach Analysis
        </h2>
        <p className="text-slate-400 mt-2">Deep behavioral and communication feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <div className="text-4xl font-black text-indigo-400 mb-2">{overallCommunication.communicationScore}</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Communication</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <div className="text-4xl font-black text-emerald-400 mb-2">{overallCommunication.professionalismScore}</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Professionalism</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <div className="text-4xl font-black text-amber-400 mb-2">{overallCommunication.confidenceScore}</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Confidence</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-md font-bold text-white mb-6 text-center">Communication Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={commData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar name="Candidate" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-md font-bold text-white mb-6 text-center">Technical Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={techData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar name="Candidate" dataKey="A" stroke="#34d399" fill="#34d399" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-md font-bold text-white mb-6">Confidence Trend over Interview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="question" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnalysisSection title="Communication Strengths" icon={Zap} items={overallCommunication.strengths} />
        <AnalysisSection title="Positive Habits" icon={TrendingUp} items={overallCommunication.positiveHabits} />
        <AnalysisSection title="Areas to Improve" icon={Target} items={overallCommunication.areasToImprove} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Personalized 4-Week Learning Plan</h3>
        <div className="space-y-6">
          {learningPlan.map((week) => (
            <div key={week.week} className="flex flex-col md:flex-row gap-4 border-b border-slate-800 pb-6 last:border-0 last:pb-0">
              <div className="md:w-32 flex-shrink-0">
                <span className="inline-block bg-primary-900/50 text-primary-400 font-bold px-3 py-1 rounded-lg text-sm border border-primary-500/20">
                  Week {week.week}
                </span>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">{week.focus}</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                  {week.tasks.map((task, idx) => (
                    <li key={idx}>{task}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
