import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { getInterviews } from '@/services/interview.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import {
  Mic,
  Video,
  Plus,
  Play,
  Award,
  Clock,
  History,
  Calendar,
  Sparkles,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function InterviewDashboard() {
  const navigate = useNavigate();

  const { data: sessionsRes, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: getInterviews,
  });

  if (isLoading) return <LoadingSkeleton />;

  const sessions = sessionsRes?.data || [];
  const inProgressSession = sessions.find(s => s.status === 'InProgress');
  const completedSessions = sessions.filter(s => s.status === 'Completed');

  // Statistics calculation
  const totalInterviews = completedSessions.length;
  const averageScore = totalInterviews > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.summary?.overallScore || 0), 0) / totalInterviews)
    : 0;

  const totalQuestions = completedSessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="AI Mock Interview Prep" 
          description="Practice realistic voice-based mock interviews with active AI coaching." 
        />
        <Link
          to="/interview/setup"
          className="inline-flex items-center gap-x-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5" />
          New Interview Setup
        </Link>
      </div>

      {/* Continue Active Session banner */}
      {inProgressSession && (
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Session In Progress
            </span>
            <h3 className="text-xl font-bold">You have an active interview session</h3>
            <p className="text-sm text-primary-100 mt-1">
              Resume your {inProgressSession.config?.type} ({inProgressSession.config?.difficulty}) interview now.
            </p>
          </div>
          <button
            onClick={() => navigate(`/interview/session/${inProgressSession._id}`)}
            className="flex items-center gap-2 bg-white text-primary-700 hover:bg-slate-55 px-5 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
          >
            <Play className="w-4 h-4 fill-primary-700" /> Resume Interview
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Interviews Completed</p>
            <p className="text-2xl font-bold mt-0.5">{totalInterviews}</p>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Average Performance</p>
            <p className="text-2xl font-bold mt-0.5">{totalInterviews > 0 ? `${averageScore}%` : 'N/A'}</p>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Questions Answered</p>
            <p className="text-2xl font-bold mt-0.5">{totalQuestions}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Previous Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            Previous Sessions
          </h3>

          {completedSessions.length === 0 ? (
            <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
              <Mic className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No completed interviews yet</h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                Start a voice mock interview to practice answering technical and behavioral questions under pressure.
              </p>
              <Link
                to="/interview/setup"
                className="inline-flex items-center gap-x-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
              >
                Configure Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {completedSessions.map(session => (
                <div 
                  key={session._id}
                  className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:border-slate-35 dark:hover:border-slate-700 transition-colors rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {session.config?.type} Interview
                      </span>
                      <span className="inline-flex items-center rounded-md bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400 capitalize">
                        {session.config?.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(session.updatedAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.config?.duration || 10} mins</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {session.summary && (
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Overall Score</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{session.summary.overallScore}%</span>
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/interview/results/${session._id}`)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-75 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Features */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-400" />
            Roadmap
          </h3>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900/40 dark:to-purple-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Upcoming Voice Improvements</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We are working on upgrading Phase 1 browser-based mock interviews to high-fidelity cloud streams.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                <span><strong>Gemini Live Voice Streams</strong>: Sub-second audio latency and interruption handling.</span>
              </li>
              <li className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                <Video className="w-4 h-4 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                <span><strong>AV Webcams & Avatars</strong>: Eye-tracking and expression analysis.</span>
              </li>
              <li className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                <Award className="w-4 h-4 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                <span><strong>Live Coding Interviews</strong>: Code in an integrated workspace.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
