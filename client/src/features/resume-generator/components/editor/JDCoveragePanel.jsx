import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, CheckCircle, XCircle, Search, Sparkles, Loader2 } from 'lucide-react';
import { getJob } from '@/services/job.service.js';
import { generateTargetedSuggestion, lookupSession } from '@/services/tailoring.service.js';
import { useEditorContext } from '../../contexts/EditorContext.jsx';
import toast from 'react-hot-toast';

export const JDCoveragePanel = ({ resume, editableData }) => {
  const queryClient = useQueryClient();
  const { setActivePath } = useEditorContext();
  const [generatingSkill, setGeneratingSkill] = useState(null);

  const jobId = resume?.jobId?._id || resume?.jobId;
  const resumeId = resume?._id;

  const { data: jobResponse, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });

  const { data: sessionResponse } = useQuery({
    queryKey: ['tailoringSession', jobId, resumeId],
    queryFn: () => lookupSession(jobId, resumeId),
    enabled: !!jobId && !!resumeId,
  });

  const job = jobResponse?.data;
  const sessionId = sessionResponse?.data?._id;

  const generateMutation = useMutation({
    mutationFn: (skill) => generateTargetedSuggestion(sessionId, skill),
    onSuccess: () => {
      toast.success('Targeted suggestion generated! Check the AI Suggestions panel.');
      queryClient.invalidateQueries(['tailoringSession', jobId, resumeId]);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to generate suggestion');
    },
    onSettled: () => {
      setGeneratingSkill(null);
    }
  });

  // Client-Side Scanner
  const coverage = useMemo(() => {
    if (!job || !editableData) return { matched: [], missing: [] };

    // Stringify editableData to deeply scan text
    const stringifiedData = JSON.stringify(editableData).toLowerCase();
    
    // Combine required skills and keywords from JD
    const targetKeywords = Array.from(new Set([
      ...(job.requiredSkills || []),
      ...(job.keywords || [])
    ])).filter(Boolean);

    const matched = [];
    const missing = [];

    targetKeywords.forEach(keyword => {
      const lowerKw = keyword.toLowerCase();
      // Look for exact word boundary or just plain substring match
      const regex = new RegExp(`\\b${lowerKw.replace(/[.*+?^$\{()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
      
      if (regex.test(stringifiedData)) {
        matched.push(keyword);
      } else if (stringifiedData.includes(lowerKw)) {
        // Fallback to substring match (partially matched)
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    return { matched, missing };
  }, [job, editableData]);

  const handleGenerate = (skill) => {
    if (!sessionId) {
      toast.error('Tailoring session not found. Please run the AI Coach first.');
      return;
    }
    setGeneratingSkill(skill);
    generateMutation.mutate(skill);
  };

  const findAndHighlightSkill = (skill) => {
    // Quick heuristic to find the skill in editableData and set activePath
    if (!editableData) return;
    const searchTarget = skill.toLowerCase();
    
    const searchRecursive = (obj, currentPath) => {
      if (!obj) return null;
      if (typeof obj === 'string' && obj.toLowerCase().includes(searchTarget)) {
        return currentPath;
      }
      if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
          const result = searchRecursive(value, currentPath ? `${currentPath}.${key}` : key);
          if (result) return result;
        }
      }
      return null;
    };

    const path = searchRecursive(editableData, '');
    if (path) {
      // Clean path (e.g. remove trailing .value)
      const cleanPath = path.replace(/\.value$/, '');
      setActivePath(cleanPath);
      toast.success(`Highlighted "${skill}" in editor`, { icon: <Search className="w-4 h-4" /> });
    } else {
      toast.error(`Could not locate "${skill}" exactly in editor`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-500" />
        <p>Analyzing Job Description...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-4 text-center text-slate-500 mt-10">
        No Job Description found for this resume.
      </div>
    );
  }

  const matchPercent = coverage.matched.length === 0 && coverage.missing.length === 0 ? 0 : 
    Math.round((coverage.matched.length / (coverage.matched.length + coverage.missing.length)) * 100);

  return (
    <div className="h-full overflow-y-auto pr-2 pb-20 custom-scrollbar p-4 space-y-6">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white">JD Coverage</h3>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-primary-600">{matchPercent}%</span>
          <span className="text-sm text-slate-500 mb-1">Keywords Matched</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${matchPercent}%` }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Covered Skills ({coverage.matched.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {coverage.matched.map((skill, i) => (
            <button
              key={i}
              onClick={() => findAndHighlightSkill(skill)}
              className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 rounded-md hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            >
              {skill}
            </button>
          ))}
          {coverage.matched.length === 0 && (
            <span className="text-xs text-slate-500">No matching skills found yet.</span>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-500" />
          Missing Skills ({coverage.missing.length})
        </h4>
        <div className="space-y-2">
          {coverage.missing.map((skill, i) => {
            const isGenerating = generatingSkill === skill;
            return (
              <div key={i} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {skill}
                </span>
                <button
                  onClick={() => handleGenerate(skill)}
                  disabled={isGenerating || !sessionId}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 text-xs font-medium rounded transition-colors disabled:opacity-50"
                  title="Generate a targeted AI suggestion to include this skill"
                >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Inject
                </button>
              </div>
            );
          })}
          {coverage.missing.length === 0 && (
            <span className="text-xs text-slate-500">Great job! No missing skills detected.</span>
          )}
        </div>
      </div>
    </div>
  );
};
