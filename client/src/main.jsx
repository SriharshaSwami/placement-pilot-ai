import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import './styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './routes/index.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { LayoutProvider } from './contexts/LayoutContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ModalProvider } from './contexts/ModalContext.jsx';

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
      <ThemeProvider>
        <AuthProvider>
          <LayoutProvider>
            <ModalProvider>
              <AppRouter />
              <Toaster position="top-right" />
            </ModalProvider>
          </LayoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
