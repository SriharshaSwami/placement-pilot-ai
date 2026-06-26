import { FileText, Briefcase, CheckSquare, Bot } from 'lucide-react';
import { DashboardCard } from './DashboardCard.jsx';

export const StatsGrid = ({ data }) => {
  const stats = [
    {
      title: 'Resume Score',
      value: `${data.resumeScore || 0}%`,
      icon: FileText,
      trend: 'up',
      trendValue: '5%',
      trendLabel: 'Since last update',
    },
    {
      title: 'Active Applications',
      value: data.applications || 0,
      icon: Briefcase,
      trend: 'up',
      trendValue: '2',
      trendLabel: 'In the last 7 days',
    },
    {
      title: 'Upcoming Interviews',
      value: data.interviews || 0,
      icon: CheckSquare,
      trendLabel: 'View calendar',
    },
    {
      title: 'AI Usage',
      value: data.aiUsage || 0,
      icon: Bot,
      trendLabel: 'Credits remaining',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <DashboardCard key={item.title} {...item} />
      ))}
    </div>
  );
};
