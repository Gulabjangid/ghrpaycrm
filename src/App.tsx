import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Pipeline = lazy(() => import('@/pages/Pipeline').then(m => ({ default: m.Pipeline })));
const Leads = lazy(() => import('@/pages/Leads').then(m => ({ default: m.Leads })));
const Schedule = lazy(() => import('@/pages/Schedule').then(m => ({ default: m.Schedule })));
const Inbox = lazy(() => import('@/pages/Inbox').then(m => ({ default: m.Inbox })));
const Properties = lazy(() => import('@/pages/Properties').then(m => ({ default: m.Properties })));
const Auth = lazy(() => import('@/pages/Auth').then(m => ({ default: m.Auth })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

const FallbackLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <div style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="bottom-right" theme="dark" richColors />
        <Routes>
          <Route path="/auth" element={
            <Suspense fallback={<FallbackLoader />}>
              <Auth />
            </Suspense>
          } />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={
              <Suspense fallback={<FallbackLoader />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="pipeline" element={
              <Suspense fallback={<FallbackLoader />}>
                <Pipeline />
              </Suspense>
            } />
            <Route path="leads" element={
              <Suspense fallback={<FallbackLoader />}>
                <Leads />
              </Suspense>
            } />
            <Route path="schedule" element={
              <Suspense fallback={<FallbackLoader />}>
                <Schedule />
              </Suspense>
            } />
            <Route path="inbox" element={
              <Suspense fallback={<FallbackLoader />}>
                <Inbox />
              </Suspense>
            } />
            <Route path="properties" element={
              <Suspense fallback={<FallbackLoader />}>
                <Properties />
              </Suspense>
            } />
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
