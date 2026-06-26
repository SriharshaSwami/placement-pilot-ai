import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function FunnelChart({ data }) {
  const chartData = [
    { name: 'Saved', value: data.saved },
    { name: 'Applied', value: data.applied },
    { name: 'Interviews', value: data.interviews },
    { name: 'Offers', value: data.offers }
  ];

  const colors = ['#cbd5e1', '#94a3b8', '#3b82f6', '#22c55e'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
