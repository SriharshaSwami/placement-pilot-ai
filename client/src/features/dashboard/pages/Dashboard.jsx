import { useQuery } from '@tanstack/react-query';
import { DashboardSkeleton } from '../../../components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '../../../components/feedback/ErrorState.jsx';
import { getDashboardData } from '../../../services/dashboard.service.js';

import { DashboardHeader } from '../components/DashboardHeader.jsx';
import { DashboardMetrics } from '../components/DashboardMetrics.jsx';
import { TodayFocusCard } from '../components/TodayFocusCard.jsx';
import { PlacementProgressCard } from '../components/PlacementProgressCard.jsx';
import { ResumeInsightsCard } from '../components/ResumeInsightsCard.jsx';
import { ApplicationOverviewCard } from '../components/ApplicationOverviewCard.jsx';
import { InterviewOverviewCard } from '../components/InterviewOverviewCard.jsx';
import { AICoachCard } from '../components/AICoachCard.jsx';
import { ActivityTimeline } from '../components/ActivityTimeline.jsx';
import { QuickActions } from '../components/QuickActions.jsx';

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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <DashboardHeader />
      <DashboardMetrics data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TodayFocusCard data={dashboardData} />
            <PlacementProgressCard data={dashboardData} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ApplicationOverviewCard data={dashboardData} />
            <InterviewOverviewCard data={dashboardData} />
          </div>
          
          <ActivityTimeline activities={dashboardData.recentActivity} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <AICoachCard data={dashboardData} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
