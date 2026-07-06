import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout.jsx';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';
import { LoadingSkeleton } from '../components/feedback/LoadingSkeleton.jsx';

const Landing = React.lazy(() => import('../app/Landing.jsx'));
const NotFound = React.lazy(() => import('../app/NotFound.jsx'));
const Login = React.lazy(() => import('../features/auth/pages/Login.jsx'));
const Register = React.lazy(() => import('../features/auth/pages/Register.jsx'));
const UserProfile = React.lazy(() => import('../features/profile/pages/UserProfile.jsx'));
const UserSettings = React.lazy(() => import('../features/settings/pages/UserSettings.jsx'));
const Dashboard = React.lazy(() => import('../features/dashboard/pages/Dashboard.jsx'));
const ResumeBuilder = React.lazy(() => import('../features/resume/pages/ResumeBuilder.jsx'));
const ResumeDetails = React.lazy(() => import('../features/resume/pages/ResumeDetails.jsx'));
const ResumeAnalysisDashboard = React.lazy(() => import('../features/ai/pages/ResumeAnalysisDashboard.jsx'));
const ResumePreview = React.lazy(() => import('../features/resume-generator/pages/ResumePreview.jsx'));
const ResumeRenderShell = React.lazy(() => import('../features/resume-generator/pages/ResumeRenderShell.jsx'));
const JobBoard = React.lazy(() => import('../features/jobs/pages/JobBoard.jsx'));
const TailoringDashboard = React.lazy(() => import('../features/tailoring/pages/TailoringDashboard.jsx'));
const InterviewDashboard = React.lazy(() => import('../features/interview/pages/InterviewDashboard.jsx'));
const InterviewSetup = React.lazy(() => import('../features/interview/pages/InterviewSetup.jsx'));
const InterviewSession = React.lazy(() => import('../features/interview/pages/InterviewSession.jsx'));
const InterviewResults = React.lazy(() => import('../features/interview/pages/InterviewResults.jsx'));
const ApplicationTracker = React.lazy(() => import('../features/applications/pages/ApplicationTracker.jsx'));
const ApplicationDetails = React.lazy(() => import('../features/applications/pages/ApplicationDetails.jsx'));
const CodingHome = React.lazy(() => import('../features/coding/pages/CodingHome.jsx'));
const CodingWorkspace = React.lazy(() => import('../features/coding/pages/CodingWorkspace.jsx'));
const CodingReport = React.lazy(() => import('../features/coding/pages/CodingReport.jsx'));
const CareerDashboard = React.lazy(() => import('../features/career/pages/CareerDashboard.jsx'));
const RoadmapDetails = React.lazy(() => import('../features/career/pages/RoadmapDetails.jsx'));
const AnalyticsDashboard = React.lazy(() => import('../features/analytics/pages/AnalyticsDashboard.jsx'));
const KnowledgeBase = React.lazy(() => import('../features/knowledge/pages/KnowledgeBase.jsx'));
const MemoryDashboard = React.lazy(() => import('../features/memory/pages/MemoryDashboard.jsx'));
const AIWorkspace = React.lazy(() => import('../features/agents/pages/AIWorkspace.jsx'));
const SemanticSearch = React.lazy(() => import('../features/search/pages/SemanticSearch.jsx'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSkeleton />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <SuspenseWrapper><Landing /></SuspenseWrapper>,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <SuspenseWrapper><Login /></SuspenseWrapper> },
          { path: '/register', element: <SuspenseWrapper><Register /></SuspenseWrapper> },
        ],
      },
      { path: '/resume/render-shell', element: <SuspenseWrapper><ResumeRenderShell /></SuspenseWrapper> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
          { path: '/profile', element: <SuspenseWrapper><UserProfile /></SuspenseWrapper> },
          { path: '/settings', element: <SuspenseWrapper><UserSettings /></SuspenseWrapper> },
          { path: '/resume', element: <SuspenseWrapper><ResumeBuilder /></SuspenseWrapper> },
          { path: '/resume/:id', element: <SuspenseWrapper><ResumeDetails /></SuspenseWrapper> },
          { path: '/resume/:id/analysis', element: <SuspenseWrapper><ResumeAnalysisDashboard /></SuspenseWrapper> },
          { path: '/resume/:id/preview', element: <SuspenseWrapper><ResumePreview /></SuspenseWrapper> },
          { path: '/jobs', element: <SuspenseWrapper><JobBoard /></SuspenseWrapper> },
          { path: '/tailoring/job/:jobId', element: <SuspenseWrapper><TailoringDashboard /></SuspenseWrapper> },
          { path: '/interview', element: <SuspenseWrapper><InterviewDashboard /></SuspenseWrapper> },
          { path: '/interview/setup', element: <SuspenseWrapper><InterviewSetup /></SuspenseWrapper> },
          { path: '/interview/session/:id', element: <SuspenseWrapper><InterviewSession /></SuspenseWrapper> },
          { path: '/interview/results/:id', element: <SuspenseWrapper><InterviewResults /></SuspenseWrapper> },
          { path: '/applications', element: <SuspenseWrapper><ApplicationTracker /></SuspenseWrapper> },
          { path: '/applications/:id', element: <SuspenseWrapper><ApplicationDetails /></SuspenseWrapper> },
          { path: '/coding', element: <SuspenseWrapper><CodingHome /></SuspenseWrapper> },
          { path: '/coding/workspace/:id', element: <SuspenseWrapper><CodingWorkspace /></SuspenseWrapper> },
          { path: '/coding/report/:id', element: <SuspenseWrapper><CodingReport /></SuspenseWrapper> },
          { path: '/career', element: <SuspenseWrapper><CareerDashboard /></SuspenseWrapper> },
          { path: '/career/roadmap', element: <SuspenseWrapper><RoadmapDetails /></SuspenseWrapper> },
          { path: '/analytics', element: <SuspenseWrapper><AnalyticsDashboard /></SuspenseWrapper> },
          { path: '/knowledge', element: <SuspenseWrapper><KnowledgeBase /></SuspenseWrapper> },
          { path: '/memory', element: <SuspenseWrapper><MemoryDashboard /></SuspenseWrapper> },
          { path: '/workspace', element: <SuspenseWrapper><AIWorkspace /></SuspenseWrapper> },
          { path: '/ai', element: <SuspenseWrapper><AIWorkspace /></SuspenseWrapper> },
          { path: '/search', element: <SuspenseWrapper><SemanticSearch /></SuspenseWrapper> },      
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
