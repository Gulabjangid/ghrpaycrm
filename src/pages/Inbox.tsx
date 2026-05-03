import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import { TaskCard } from '@/components/inbox/TaskCard';

type Tab = 'overdue' | 'today' | 'upcoming' | 'done';

export const Inbox: React.FC = () => {
  const followUps = useDataStore((s) => s.followUps);
  const leads = useDataStore((s) => s.leads);
  const [tab, setTab] = useState<Tab>('overdue');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const calculateScore = (task: any) => {
    const lead = leads.find(l => l.id === task.lead_id);
    if (!lead) return 0;
    const hoursOverdue = (now.getTime() - new Date(task.due_at).getTime()) / 3600000;
    const urgency = hoursOverdue > 0 ? Math.min(100, hoursOverdue * 3) : 0;
    const tempScore = lead.temperature === 'hot' ? 25 : lead.temperature === 'warm' ? 15 : 5;
    return urgency + tempScore; // Simplified
  };

  const categorized = followUps.reduce((acc, f) => {
    const isToday = f.due_at.slice(0, 10) === todayStr;
    const isPast = new Date(f.due_at) < now;

    if (f.is_done) acc.done.push(f);
    else if (isPast && !isToday) acc.overdue.push(f);
    else if (isToday) acc.today.push(f);
    else acc.upcoming.push(f);
    return acc;
  }, { overdue: [] as any[], today: [] as any[], upcoming: [] as any[], done: [] as any[] });

  // Sort by priority logic (simplified)
  categorized.overdue.sort((a, b) => calculateScore(b) - calculateScore(a));
  categorized.today.sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());
  categorized.upcoming.sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());
  categorized.done.sort((a, b) => new Date(b.done_at || 0).getTime() - new Date(a.done_at || 0).getTime());

  const activeList = categorized[tab];

  const tabStyle = (t: Tab, count: number): React.CSSProperties => ({
    padding: '10px 16px', fontSize: 13, fontWeight: tab === t ? 600 : 500,
    background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--color-accent)' : 'transparent'}`,
    color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 150ms'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 4 }}>Inbox</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Your priority-ranked action queue.</p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 24 }}>
        <button style={tabStyle('overdue', categorized.overdue.length)} onClick={() => setTab('overdue')}>
          Overdue <span style={{ background: categorized.overdue.length > 0 ? 'var(--color-danger)' : 'var(--color-surface-raised)', color: categorized.overdue.length > 0 ? '#fff' : 'var(--color-text-secondary)', padding: '2px 8px', borderRadius: 100, fontSize: 11 }}>{categorized.overdue.length}</span>
        </button>
        <button style={tabStyle('today', categorized.today.length)} onClick={() => setTab('today')}>
          Due Today <span style={{ background: 'var(--color-surface-raised)', color: 'var(--color-text-primary)', padding: '2px 8px', borderRadius: 100, fontSize: 11 }}>{categorized.today.length}</span>
        </button>
        <button style={tabStyle('upcoming', categorized.upcoming.length)} onClick={() => setTab('upcoming')}>
          Upcoming <span style={{ background: 'var(--color-surface-raised)', color: 'var(--color-text-primary)', padding: '2px 8px', borderRadius: 100, fontSize: 11 }}>{categorized.upcoming.length}</span>
        </button>
        <button style={tabStyle('done', categorized.done.length)} onClick={() => setTab('done')}>
          Done
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
        {activeList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-tertiary)', background: 'var(--color-surface)', borderRadius: 12, border: '1px dashed var(--color-border)' }}>
            No tasks in this list
          </div>
        ) : (
          activeList.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};
