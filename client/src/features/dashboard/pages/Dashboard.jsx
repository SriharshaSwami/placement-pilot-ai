import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { DashboardSkeleton } from '../../../components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '../../../components/feedback/ErrorState.jsx';
import { StatsGrid } from '../components/StatsGrid.jsx';
import { QuickActions } from '../components/QuickActions.jsx';
import { ActivityCard } from '../components/ActivityCard.jsx';
import { getDashboardData } from '../../../services/dashboard.service.js';

const Dashboard = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: getDashboardData,
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return <ErrorState message={error?.message || 'Failed to load dashboard data'} onRetry={refetch} />;
  }

  const dashboardData = data?.data || {};

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Welcome back!" 
        description="Here is what's happening with your job search today." 
      />
      
      <StatsGrid data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions />
        <ActivityCard activities={dashboardData.recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;
