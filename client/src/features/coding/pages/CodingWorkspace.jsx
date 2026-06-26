import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCodingSession, requestHint, submitCode } from '@/services/coding.service.js';
import { MonacoEditorWrapper } from '../components/MonacoEditorWrapper.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { Play, FileWarning, Lightbulb } from 'lucide-react';

export default function CodingWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');

  const { data: sessionRes, isLoading } = useQuery({
    queryKey: ['coding', id],
    queryFn: () => getCodingSession(id)
  });

  const session = sessionRes?.data;

  // Set default stub based on language
  useEffect(() => {
    if (session && !code && !session.submittedCode) {
      if (session.config.language === 'python') setCode('def solve():\n    pass\n');
      if (session.config.language === 'javascript') setCode('function solve() {\n  \n}\n');
      if (session.config.language === 'java') setCode('class Solution {\n  public void solve() {\n    \n  }\n}\n');
    }
  }, [session]);

  const hintMutation = useMutation({
    mutationFn: () => requestHint(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coding', id] })
  });

  const submitMutation = useMutation({
    mutationFn: () => submitCode(id, code),
    onSuccess: () => navigate(`/coding/report/${id}`)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!session) return <ErrorState message="Session not found" />;

  const { question, config } = session;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Left Panel: Problem Statement */}
      <div className="w-full md:w-1/3 flex flex-col bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              config.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              config.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {config.difficulty}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-full">
              {config.topic}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{question.title}</h2>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{question.problemStatement}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Examples</h3>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-xs font-mono text-slate-800 dark:text-slate-200 space-y-2 border border-slate-200 dark:border-slate-700">
              <div><strong className="text-slate-500 select-none">Input: </strong>{question.sampleInput}</div>
              <div><strong className="text-slate-500 select-none">Output: </strong>{question.sampleOutput}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Constraints</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
              {question.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          {/* Hint Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" /> Hints
              </h3>
              <span className="text-xs text-slate-500">{session.hintsUsed} / {question.hints.length} used</span>
            </div>
            {question.hints.slice(0, session.hintsUsed).map((hint, i) => (
              <div key={i} className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-yellow-700 dark:text-yellow-500">Hint {i + 1}: </span>{hint}
              </div>
            ))}
            {session.hintsUsed < question.hints.length && (
              <button
                onClick={() => hintMutation.mutate()}
                disabled={hintMutation.isPending}
                className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Reveal Hint {session.hintsUsed + 1}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Editor */}
      <div className="w-full md:w-2/3 flex flex-col space-y-4">
        <div className="flex-1">
          <MonacoEditorWrapper language={config.language} code={code} onChange={setCode} />
        </div>
        <div className="flex justify-between items-center bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 flex items-center">
            <FileWarning className="w-4 h-4 mr-1" />
            Code execution is securely stubbed. Submitting will trigger static AI evaluation.
          </div>
          <button
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || !code.trim()}
            className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
          >
            {submitMutation.isPending ? 'Evaluating...' : 'Submit Code'}
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
