import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { setupCodingSession } from '@/services/coding.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { Terminal } from 'lucide-react';

export default function CodingHome() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    topic: 'Arrays',
    difficulty: 'Medium',
    language: 'python'
  });

  const setupMutation = useMutation({
    mutationFn: (data) => setupCodingSession(data),
    onSuccess: (res) => {
      navigate(`/coding/workspace/${res.data._id}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setupMutation.mutate(config);
  };

  const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Binary Search', 'Backtracking', 'Hashing', 'Sliding Window'];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <PageHeader title="AI Coding Interview" description="Practice your data structures and algorithms with an AI interviewer." />
      
      <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic</label>
            <select
              value={config.topic}
              onChange={(e) => setConfig({ ...config, topic: e.target.value })}
              className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
            <select
              value={config.difficulty}
              onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
              className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Programming Language</label>
          <div className="flex gap-4">
            {['python', 'javascript', 'java'].map(lang => (
              <label key={lang} className={`flex-1 cursor-pointer rounded-lg border p-4 text-center ${config.language === lang ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <input
                  type="radio"
                  name="language"
                  value={lang}
                  checked={config.language === lang}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="sr-only"
                />
                <span className="capitalize font-semibold">{lang}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            type="submit"
            disabled={setupMutation.isPending}
            className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
          >
            {setupMutation.isPending ? 'Generating Question...' : 'Start Coding'}
            <Terminal className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
