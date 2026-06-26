import { Database, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function KnowledgeCard({ metadata }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{metadata.documentType}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {metadata.documentId.substring(0, 8)}...</p>
          </div>
        </div>
        
        {metadata.status === 'Indexed' && <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md"><CheckCircle className="w-3 h-3 mr-1"/> Ready</span>}
        {metadata.status === 'Indexing' && <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md"><Clock className="w-3 h-3 mr-1 animate-spin"/> Processing</span>}
        {metadata.status === 'Pending' && <span className="flex items-center text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md"><Clock className="w-3 h-3 mr-1"/> Queued</span>}
        {metadata.status === 'Failed' && <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md"><AlertCircle className="w-3 h-3 mr-1"/> Failed</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span className="block text-xs text-slate-500 mb-1">Vector Chunks</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{metadata.chunkCount}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-500 mb-1">Version</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">v{metadata.version}</span>
        </div>
      </div>
    </div>
  );
}
