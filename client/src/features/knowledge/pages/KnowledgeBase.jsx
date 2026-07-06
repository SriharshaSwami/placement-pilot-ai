import { useQuery } from '@tanstack/react-query';
import { getKnowledgeBase } from '@/services/knowledge.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { KnowledgeCard } from '../components/KnowledgeCard.jsx';
import { EmptyState } from '@/components/feedback/EmptyState.jsx';
import { Database, ShieldCheck, Zap } from 'lucide-react';

export default function KnowledgeBase() {
  const { data: knowledgeRes, isLoading } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: () => getKnowledgeBase()
  });

  if (isLoading) return <LoadingSkeleton />;
  const documents = knowledgeRes?.data || [];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <PageHeader title="AI Knowledge Base" description="Your personal vector database powering the RAG pipeline." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Database className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Indexed Documents</p><p className="text-2xl font-bold">{documents.length}</p></div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Zap className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Vector Engine</p><p className="text-lg font-bold">Memory KNN</p></div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheck className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Data Privacy</p><p className="text-sm font-bold text-green-600">Isolated & Secure</p></div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Indexes</h3>
        {documents.length === 0 ? (
          <EmptyState
            icon={Database}
            title="Knowledge Base Empty"
            description="Upload a resume or complete an interview to start generating vector embeddings."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(doc => (
              <KnowledgeCard key={doc._id} metadata={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
