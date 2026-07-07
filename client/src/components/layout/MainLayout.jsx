import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopNavbar } from './TopNavbar.jsx';
import { PageContainer } from './PageContainer.jsx';

export const MainLayout = () => {
  return (
    <div className="h-screen bg-muted-light dark:bg-slate-900 flex flex-col overflow-hidden">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </div>
      </div>
    </div>
  );
};
