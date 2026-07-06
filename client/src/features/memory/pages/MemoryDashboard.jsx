import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemories, deleteMemory, resetMemories, exportMemories } from '@/services/memory.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { MemoryCard } from '../components/MemoryCard.jsx';
import { EmptyState } from '@/components/feedback/EmptyState.jsx';
import { BrainCircuit, Download, Trash2, ShieldCheck, DatabaseZap } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext.jsx';
import toast from 'react-hot-toast';

export default function MemoryDashboard() {
  const queryClient = useQueryClient();
  const { confirm } = useModal();
  
  const { data: memRes, isLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => getMemories()
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMemory(id),
    onSuccess: () => {
      toast.success('Memory erased permanently.');
      queryClient.invalidateQueries(['memories']);
    }
  });

  const resetMutation = useMutation({
    mutationFn: () => resetMemories(),
    onSuccess: () => {
      toast.success('All memories wiped.');
      queryClient.invalidateQueries(['memories']);
    }
  });

  const handleExport = async () => {
    try {
      await exportMemories();
      toast.success('Memory exported successfully.');
    } catch {
      toast.error('Failed to export memory.');
    }
  };

  const handleResetAll = async () => {
    const confirmed = await confirm({
      title: 'Wipe Memory',
      description: 'Are you sure you want to wipe all AI memory permanently? This cannot be undone.',
      confirmLabel: 'Reset All',
      cancelLabel: 'Cancel',
      isDestructive: true,
    });
    if (confirmed) {
      resetMutation.mutate();
    }
  };

  const handleDeleteMemory = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Memory Fact',
      description: 'Are you sure you want to delete this fact from your AI memory?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      isDestructive: true,
    });
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  const memories = memRes?.data || [];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <PageHeader title="Semantic Memory Engine" description="Long-term facts the AI has learned about you across all your interactions." />
        
        <div className="flex space-x-3">
          <button onClick={handleExport} className="flex items-center px-4 py-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </button>
          <button 
            onClick={handleResetAll}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Reset All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><BrainCircuit className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Extracted Facts</p><p className="text-2xl font-bold">{memories.length}</p></div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><DatabaseZap className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Retention Policy</p><p className="text-lg font-bold">Persistent</p></div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ShieldCheck className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Privacy Status</p><p className="text-sm font-bold text-blue-600">User Controlled</p></div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Semantic Profile</h3>
        
        {memories.length === 0 ? (
          <EmptyState
            icon={BrainCircuit}
            title="Blank Slate"
            description="The AI hasn't learned any long-term facts about you yet. Complete interviews or roadmaps to build memory."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memories.map(mem => (
              <MemoryCard key={mem._id} memory={mem} onDelete={handleDeleteMemory} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
