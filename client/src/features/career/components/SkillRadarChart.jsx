import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function SkillRadarChart({ metrics }) {
  const data = [
    { subject: 'Data Structures', A: metrics.dataStructures || 0, fullMark: 100 },
    { subject: 'System Design', A: metrics.systemDesign || 0, fullMark: 100 },
    { subject: 'Frameworks', A: metrics.frameworks || 0, fullMark: 100 },
    { subject: 'Communication', A: metrics.communication || 0, fullMark: 100 },
    { subject: 'Problem Solving', A: metrics.problemSolving || 0, fullMark: 100 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
          />
          <Radar name="Candidate" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
