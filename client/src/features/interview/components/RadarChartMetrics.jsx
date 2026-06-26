import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function RadarChartMetrics({ summary }) {
  if (!summary) return null;

  const data = [
    { subject: 'Technical', A: summary.technicalKnowledge || 0, fullMark: 100 },
    { subject: 'Communication', A: summary.communicationScore || 0, fullMark: 100 },
    { subject: 'Problem Solving', A: summary.problemSolving || 0, fullMark: 100 },
    { subject: 'Confidence', A: summary.confidence || 0, fullMark: 100 },
    { subject: 'Behavioral', A: summary.behavioralSkills || 0, fullMark: 100 },
    { subject: 'Resume Match', A: summary.resumeAlignment || 0, fullMark: 100 },
  ];

  return (
    <div className="w-full border-t border-slate-200 dark:border-slate-800 pt-10">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 text-center">Performance Radar</h3>
      <div className="mx-auto h-[350px] max-w-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, dy: 4 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#6366f1"
              strokeWidth={2}
              fill="#6366f1"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }}
              itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
