import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDataStore } from '@/lib/dataStore';
import { supabase } from '@/lib/supabase';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { LeadFormSheet } from '@/components/leads/LeadForm';
import { LeadDetailSheet } from '@/components/leads/LeadDetail';

export const AppLayout: React.FC = () => {
  const init = useDataStore(state => state.init);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        init();
      }
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [init, navigate]);

  if (checking) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 24,
            background: 'var(--color-background)',
          }}
        >
          <Outlet />
        </main>
      </div>
      <LeadFormSheet />
      <LeadDetailSheet />
    </div>
  );
};
