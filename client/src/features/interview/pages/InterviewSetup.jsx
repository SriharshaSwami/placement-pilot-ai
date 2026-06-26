import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { setupInterview } from '@/services/interview.service.js';
import { getResumes } from '@/services/resume.service.js';
import { getJobs } from '@/services/job.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { Play } from 'lucide-react';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({ type: 'Mixed', difficulty: 'Medium', duration: 10, persona: 'Senior Software Engineer' });
  const [resumeId, setResumeId] = useState('');
  const [jobId, setJobId] = useState('');

  const { data: resumesRes } = useQuery({ queryKey: ['resumes'], queryFn: getResumes });
  const { data: jobsRes } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });

  const setupMutation = useMutation({
    mutationFn: (data) => setupInterview(data),
    onSuccess: (res) => {
      navigate(`/interview/session/${res.data._id}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setupMutation.mutate({ 
      resumeId, 
      jobId: jobId || null, 
      config: {
        ...config,
        duration: parseInt(config.duration)
      } 
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <PageHeader title="Setup Mock Interview" description="Configure your AI interviewer based on your target role." backTo="/interview" />
      
      <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Resume</label>
          <select
            required
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="w-full rounded-md border-slate-35 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="">-- Choose a parsed resume --</option>
            {resumesRes?.data?.map(r => (
              <option key={r._id} value={r._id}>{r.title} {r.isPrimary && '(Primary)'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Job (Optional)</label>
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full rounded-md border-slate-35 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="">-- General Interview (No specific job) --</option>
            {jobsRes?.data?.map(j => (
              <option key={j._id} value={j._id}>{j.role} at {j.company}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interview Type</label>
            <select
              value={config.type}
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
              className="w-full rounded-md border-slate-35 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="Mixed">Mixed</option>
              <option value="HR">HR Screen</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="DSA">Data Structures & Algo (DSA)</option>
              <option value="System Design">System Design</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
            <select
              value={config.difficulty}
              onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
              className="w-full rounded-md border-slate-35 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration</label>
            <select
              value={config.duration}
              onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
              className="w-full rounded-md border-slate-35 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="10">10 mins</option>
              <option value="20">20 mins</option>
              <option value="30">30 mins</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interviewer Persona</label>
            <select
              value={config.persona}
              onChange={(e) => setConfig({ ...config, persona: e.target.value })}
              className="w-full rounded-md border-slate-35 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="Friendly Campus Recruiter">Friendly Campus Recruiter</option>
              <option value="Senior Software Engineer">Senior Software Engineer</option>
              <option value="Google L3 Interviewer">Google L3 Interviewer</option>
              <option value="Amazon Bar Raiser">Amazon Bar Raiser</option>
              <option value="Startup CTO">Startup CTO</option>
              <option value="HR Recruiter">HR Recruiter</option>
              <option value="Engineering Manager">Engineering Manager</option>
              <option value="System Design Interviewer">System Design Interviewer</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            type="submit"
            disabled={setupMutation.isPending || !resumeId}
            className="inline-flex items-center gap-x-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 transition-all hover:scale-[1.02]"
          >
            {setupMutation.isPending ? 'Preparing Interviewer...' : 'Start Interview'}
            <Play className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
