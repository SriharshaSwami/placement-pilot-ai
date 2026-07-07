import React, { useState, useEffect } from 'react';

export default function AiDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v1/admin/ai-usage', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Access Denied or Failed to Load');
        return res.json();
      })
      .then(json => {
        setData(json.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading AI Usage Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Cost Monitor & Usage Dashboard</h1>
        <p className="text-slate-500 mt-2">Developer overview of Gemini API consumption, cache hits, and latencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 font-medium uppercase">Total Spend</p>
          <p className="text-3xl font-bold mt-2 text-green-600">${data.stats.totalEstimatedCost.toFixed(4)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 font-medium uppercase">Total Tokens</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{(data.stats.totalTokens / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 font-medium uppercase">Cache Hit Rate</p>
          <p className="text-3xl font-bold mt-2 text-indigo-600">
            {data.stats.totalRequests ? Math.round((data.stats.cacheHits / data.stats.totalRequests) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 font-medium uppercase">Avg Latency</p>
          <p className="text-3xl font-bold mt-2 text-amber-600">{(data.stats.averageLatency / 1000).toFixed(2)}s</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Usage by Feature</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Feature</th>
                <th className="px-4 py-3">Requests</th>
                <th className="px-4 py-3">Avg Latency</th>
                <th className="px-4 py-3 rounded-tr-lg">Cost (USD)</th>
              </tr>
            </thead>
            <tbody>
              {data.features.map(f => (
                <tr key={f._id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{f._id}</td>
                  <td className="px-4 py-3">{f.requests}</td>
                  <td className="px-4 py-3">{(f.avgLatency / 1000).toFixed(2)}s</td>
                  <td className="px-4 py-3">${f.cost.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Recent API Logs</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.recentLogs.map(log => (
            <div key={log._id} className="text-xs font-mono p-3 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-100 dark:border-slate-700 flex justify-between">
              <div>
                <span className="text-blue-500 font-bold">[{log.featureName}]</span> 
                <span className="ml-2 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="ml-2 text-slate-700 dark:text-slate-400">Tokens: {log.totalTokens}</span>
                <span className="ml-2 text-amber-600">{log.latencyMs}ms</span>
                {log.cacheHit && <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 rounded">CACHE</span>}
                {log.isRetry && <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">RETRY</span>}
                {!log.success && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 rounded">ERROR: {log.errorMessage}</span>}
              </div>
              <div className="text-green-600">${log.estimatedCostUSD.toFixed(5)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
