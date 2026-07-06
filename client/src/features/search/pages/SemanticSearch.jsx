import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { Search, Briefcase, FileText, Video, Zap } from 'lucide-react';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { EmptyState } from '@/components/feedback/EmptyState.jsx';

const performSearch = async (query) => {
  if (!query) return null;
  return api.get(`/search?q=${encodeURIComponent(query)}`);
};

export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const { data: searchRes, isLoading } = useQuery({
    queryKey: ['semanticSearch', activeQuery],
    queryFn: () => performSearch(activeQuery),
    enabled: !!activeQuery
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveQuery(query);
  };

  const results = searchRes?.data;

  const renderSimilarity = (score) => {
    if (!score) return null;
    return (
      <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded">
        <Zap className="w-3 h-3 mr-1" />
        {Math.round(score * 100)}% Match
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader 
        title="Semantic Search" 
        description="Search across your resumes, job descriptions, and interview feedback using natural language." 
      />

      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-20 py-4 border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-lg dark:text-white"
          placeholder="e.g., 'backend jobs using Node.js' or 'interviews where I struggled with system design'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-2 right-2 flex items-center">
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="space-y-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      )}

      {!isLoading && activeQuery && !results?.jobs?.length && !results?.resumes?.length && !results?.interviews?.length && (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`We couldn't find anything matching "${activeQuery}". Try a different phrase.`}
        />
      )}

      {!isLoading && results && (
        <div className="space-y-8 mt-8">
          
          {/* Jobs */}
          {results.jobs?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-slate-900 dark:text-white">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                Job Descriptions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.jobs.map(job => (
                  <div key={job._id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{job.role}</h4>
                      {renderSimilarity(job.similarityScore)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumes */}
          {results.resumes?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-slate-900 dark:text-white">
                <FileText className="w-5 h-5 mr-2 text-emerald-500" />
                Resumes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.resumes.map(resume => (
                  <div key={resume._id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{resume.title || 'Untitled Resume'}</h4>
                      {renderSimilarity(resume.similarityScore)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                      {resume.tailoredSummary || 'Original Base Resume'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interviews */}
          {results.interviews?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-slate-900 dark:text-white">
                <Video className="w-5 h-5 mr-2 text-purple-500" />
                Interview Sessions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.interviews.map(interview => (
                  <div key={interview._id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {interview.config?.config || 'Interview'} - {interview.config?.difficulty || 'Medium'}
                      </h4>
                      {renderSimilarity(interview.similarityScore)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Score: {interview.summary?.overallScore || 'N/A'}/100
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
