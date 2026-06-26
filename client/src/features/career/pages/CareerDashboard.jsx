import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoadmap, updateTaskStatus } from '@/services/career.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { SkillRadarChart } from '../components/SkillRadarChart.jsx';
import { RefreshCw, Target, Activity, CheckCircle, Code, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CareerDashboard() {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: roadmapRes, isLoading } = useQuery({
    queryKey: ['careerRoadmap'],
    queryFn: () => getRoadmap()
  });

  const refreshMutation = useMutation({
    mutationFn: () => getRoadmap(true),
    onMutate: () => setIsGenerating(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerRoadmap'] });
      setIsGenerating(false);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['careerRoadmap'] })
  });

  const handleTaskToggle = (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    updateTaskMutation.mutate({ taskId: task._id, status: newStatus });
  };

  if (isLoading) return <LoadingSkeleton />;
  const roadmap = roadmapRes?.data;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <PageHeader title="Career Intelligence" description="Your AI-powered placement roadmap." />
        <button
          onClick={() => refreshMutation.mutate()}
          disabled={isGenerating}
          className="inline-flex items-center gap-x-2 rounded-md bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          Force Sync AI
        </button>
      </div>

      {!roadmap ? (
        <div className="text-center py-20 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl">
          <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Roadmap Found</h2>
          <p className="text-slate-500 mb-6">We need to generate your personalized career plan.</p>
          <button onClick={() => refreshMutation.mutate()} disabled={isGenerating} className="bg-primary-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-500">
            {isGenerating ? 'Analyzing data...' : 'Generate AI Roadmap'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center"><Target className="w-4 h-4 mr-2" /> Skill Readiness</h3>
              <SkillRadarChart metrics={roadmap.skillGap.radarMetrics} />
              <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">AI Confidence Level</span>
                <span className={`text-xs px-2 py-1 rounded-md font-semibold ${roadmap.skillGap.confidence === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {roadmap.skillGap.confidence}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
               <h3 className="text-lg font-semibold mb-3 flex items-center"><BookOpen className="w-5 h-5 mr-2"/> Weekly Focus</h3>
               <ul className="space-y-2 text-sm text-indigo-50">
                 {roadmap.weeklyGoals.map((goal, i) => (
                   <li key={i} className="flex items-start">
                     <span className="mr-2">•</span> <span>{goal}</span>
                   </li>
                 ))}
               </ul>
               <Link to="/career/roadmap" className="mt-6 inline-block w-full text-center bg-white/20 hover:bg-white/30 font-medium py-2 rounded-lg transition-colors text-sm">
                 View Full Roadmap Analysis
               </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm h-full">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Active Action Plan</h3>
              
              <div className="space-y-4">
                {roadmap.tasks.map(task => (
                  <div key={task._id} className={`flex items-start p-4 rounded-lg border transition-colors ${task.status === 'Completed' ? 'bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-900/50 dark:border-slate-800' : 'bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 hover:border-primary-500'}`}>
                    <button 
                      onClick={() => handleTaskToggle(task)}
                      className={`mt-0.5 mr-4 flex-shrink-0 ${task.status === 'Completed' ? 'text-green-500' : 'text-slate-300 hover:text-primary-500'}`}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-semibold text-sm ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>{task.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{task.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
                        <span className="flex items-center"><Code className="w-3 h-3 mr-1" /> {task.type}</span>
                        <span>{task.estimatedHours} Hours</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
