import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatWithAgents, getExecutionHistory, clearExecutionHistory } from '@/services/agent.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { Send, Bot, Loader2, Workflow, Clock, Activity, AlertCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function AIWorkspace() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const queryClient = useQueryClient();

  const { data: historyRes } = useQuery({
    queryKey: ['agentHistory'],
    queryFn: () => getExecutionHistory()
  });

  const clearHistoryMutation = useMutation({
    mutationFn: () => clearExecutionHistory(),
    onSuccess: () => {
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ['agentHistory'] });
      toast.success('Chat history cleared.');
    },
    onError: () => {
      toast.error('Failed to clear chat history.');
    }
  });

  const chatMutation = useMutation({
    mutationFn: (q) => chatWithAgents(q),
    onSuccess: (data) => {
      const response = data.data;
      setMessages(prev => [...prev, {
        role: 'system',
        content: response.reply,
        metadata: response.metadata
      }]);
    },
    onError: (error) => {
      toast.error('Agent execution failed.');
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'I encountered an error processing your request. Please try again.',
        metadata: { error: true }
      }]);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    chatMutation.mutate(query);
    setQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col pb-6">
      <PageHeader title="AI Multi-Agent Workspace" description="Interact with the PlacementPilot Orchestrator and specialized Domain Agents." />
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden mt-6">
        
        {/* Main Chat Area */}
        <div className="lg:col-span-2 flex flex-col bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm relative">
          
          {/* Chat Header / Actions */}
          {messages.length > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => clearHistoryMutation.mutate()}
                disabled={clearHistoryMutation.isPending}
                className="flex items-center text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-full shadow-sm transition-colors disabled:opacity-50"
                title="Clear Chat"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                {clearHistoryMutation.isPending ? 'Clearing...' : 'New Chat'}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-16">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Workflow className="w-16 h-16 mb-4 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">The Orchestrator is ready.</h3>
                <p className="text-sm mt-2 text-center max-w-md">
                  Ask me anything. I will classify your intent, inject your RAG and Memory context, and orchestrate the right Domain Agents to assist you.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'system' && msg.metadata && !msg.metadata.error && (
                  <div className="flex flex-wrap gap-2 mb-2 ml-1">
                    <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-100 text-blue-700 border border-blue-200">Intent: {msg.metadata.intent}</span>
                    <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-purple-100 text-purple-700 border border-purple-200">Agents: {msg.metadata.agentsUsed?.join(' → ')}</span>
                    {msg.metadata.source && (
                      <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                        msg.metadata.source === 'Cached Response' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        msg.metadata.source === 'Gemini AI' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                        'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>
                        Source: {msg.metadata.source}
                      </span>
                    )}
                    <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center"><Clock className="w-3 h-3 mr-1"/> {msg.metadata.latencyMs || '< 100'}ms</span>
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : msg.metadata?.error 
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                }`}>
                  {msg.role === 'system' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-center space-x-2 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-sm font-medium animate-pulse">Orchestrating agents...</span>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your resume, jobs, or practice an interview..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-5 pr-14 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={chatMutation.isPending}
              />
              <button 
                type="submit" 
                disabled={!query.trim() || chatMutation.isPending}
                className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Observatory */}
        <div className="hidden lg:flex flex-col bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center">
            <Activity className="w-4 h-4 text-slate-500 mr-2" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Observability Metrics</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Live Agents</h4>
              <div className="flex flex-wrap gap-2">
                {['Resume', 'Career', 'Interview', 'Coding', 'Job', 'Analytics'].map(agent => (
                  <span key={agent} className="flex items-center text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                    <Bot className="w-3 h-3 text-blue-500 mr-1"/> {agent}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Execution History</h4>
              <div className="space-y-3">
                {historyRes?.data?.map((exec) => (
                  <div key={exec._id} className="text-xs border border-slate-100 dark:border-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">{exec.intent}</span>
                      {exec.status === 'Success' ? <span className="text-green-500">✔</span> : <AlertCircle className="w-3 h-3 text-red-500"/>}
                    </div>
                    <p className="text-slate-500 truncate mb-2">&quot;{exec.query}&quot;</p>
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center"><Workflow className="w-3 h-3 mr-1"/> {exec.agentsUsed.length} Agent(s)</span>
                      <span>{exec.latencyMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
