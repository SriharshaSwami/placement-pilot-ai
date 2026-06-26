import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopNavbar } from './TopNavbar.jsx';
import { PageContainer } from './PageContainer.jsx';

export const MainLayout = () => {
  return (
    <div className="h-screen bg-muted-light dark:bg-slate-900 flex overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <div className="flex-1 overflow-y-auto">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </div>
      </div>
    </div>
  );
};
