# Frontend Scaffolding Script

$componentsUi = @("Button", "Input", "Card", "Modal", "Badge", "Avatar", "Spinner", "Skeleton")
foreach ($comp in $componentsUi) {
    $content = @"
import React from 'react';

export const $comp = ({ children, className, ...props }) => {
  return (
    <div className={`$comp ` + (className || '')} {...props}>
      {children || '$comp Component'}
    </div>
  );
};
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\components\ui\$comp.jsx" -Value $content -Encoding UTF8
}

$componentsFeedback = @("EmptyState", "ErrorState", "Toast")
foreach ($comp in $componentsFeedback) {
    $content = @"
import React from 'react';

export const $comp = ({ message }) => {
  return (
    <div className="p-4 border rounded-md">
      {message || '$comp Component'}
    </div>
  );
};
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\components\feedback\$comp.jsx" -Value $content -Encoding UTF8
}

$componentsLayout = @("Sidebar", "TopNavbar", "MainLayout", "AuthLayout", "PageContainer")
foreach ($comp in $componentsLayout) {
    $content = @"
import React from 'react';
import { Outlet } from 'react-router-dom';

export const $comp = ({ children }) => {
  return (
    <div className="$comp-layout">
      {children ? children : <Outlet />}
    </div>
  );
};
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\components\layout\$comp.jsx" -Value $content -Encoding UTF8
}

$routesFiles = @("ProtectedRoute", "PublicRoute")
foreach ($comp in $routesFiles) {
    $content = @"
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const $comp = () => {
  // Scaffold: Assuming user is authenticated for ProtectedRoute, and not for PublicRoute just for basic routing test.
  // In real app, this will check auth state.
  return <Outlet />;
};
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\routes\$comp.jsx" -Value $content -Encoding UTF8
}

# Create feature pages
$features = @("dashboard", "resume", "jobs", "applications", "interview", "ai", "profile", "settings", "auth")
foreach ($feat in $features) {
    # Ensure dir exists
    $dirPath = "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\features\$feat\pages"
    if (!(Test-Path $dirPath)) {
        New-Item -ItemType Directory -Force -Path $dirPath | Out-Null
    }
}

$pages = @(
  @{feat="auth"; name="Login"},
  @{feat="auth"; name="Register"},
  @{feat="dashboard"; name="Dashboard"},
  @{feat="resume"; name="ResumeBuilder"},
  @{feat="jobs"; name="JobBoard"},
  @{feat="applications"; name="ApplicationTracker"},
  @{feat="interview"; name="InterviewPrep"},
  @{feat="ai"; name="AIAssistant"},
  @{feat="profile"; name="UserProfile"},
  @{feat="settings"; name="UserSettings"}
)

foreach ($page in $pages) {
    $feat = $page.feat
    $name = $page.name
    $content = @"
import React from 'react';

const $name = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">$name Page</h1>
      <p className="mt-2 text-slate-600">This is a scaffolded page.</p>
    </div>
  );
};

export default $name;
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\features\$feat\pages\$name.jsx" -Value $content -Encoding UTF8
}

# Landing and NotFound in app directly
$appPages = @("Landing", "NotFound")
foreach ($page in $appPages) {
    $content = @"
import React from 'react';

const $page = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">$page</h1>
    </div>
  );
};

export default $page;
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\app\$page.jsx" -Value $content -Encoding UTF8
}

# Main Router Index
$routerIndexContent = @"
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout.jsx';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';

import Landing from '../app/Landing.jsx';
import NotFound from '../app/NotFound.jsx';
import Login from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register.jsx';
import Dashboard from '../features/dashboard/pages/Dashboard.jsx';
import ResumeBuilder from '../features/resume/pages/ResumeBuilder.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/resume', element: <ResumeBuilder /> },
          // Add other routes here...
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
"@
Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\routes\index.jsx" -Value $routerIndexContent -Encoding UTF8

# Main entry
$mainContent = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routes/index.jsx';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </React.StrictMode>
);
"@
Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\client\src\main.jsx" -Value $mainContent -Encoding UTF8
