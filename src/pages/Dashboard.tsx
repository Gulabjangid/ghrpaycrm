import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useDataStore } from '@/lib/dataStore';
import { STAGE_CONFIG, STAGE_ORDER } from '@/types/lead';
import { LeadCard } from '@/components/leads/LeadCard';
import { getInitials, getAvatarColor, formatRelativeTime } from '@/lib/utils';

const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 800 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{display}</span>;
};

export const Dashboard: React.FC = () => {
  const leads = useDataStore((s) => s.leads);
  const visits = useDataStore((s) => s.visits);
  const followUps = useDataStore((s) => s.followUps);
  const activities = useDataStore((s) => s.activities);
  const agents = useDataStore((s) => s.agents);
  const properties = useDataStore((s) => s.properties);
  const navigate = useNavigate();

  const activeLeads = leads.filter((l) => !['booked', 'lost'].includes(l.stage));
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const todayVisits = visits.filter((v) => v.scheduled_at.slice(0, 10) === todayStr);
  const overdueFollowUps = followUps.filter((f) => !f.is_done && new Date(f.due_at) < now);
  const booked = leads.filter((l) => l.stage === 'booked').length;
  const lost = leads.filter((l) => l.stage === 'lost').length;
  const convRate = booked + lost > 0 ? Math.round((booked / (booked + lost)) * 100) : 0;
  const hotLeads = leads.filter((l) => l.temperature === 'hot' && !['booked', 'lost'].includes(l.stage)).sort((a, b) => b.score - a.score).slice(0, 5);

  const pipelineData = STAGE_ORDER.filter((s) => s !== 'lost').map((stage) => ({
    stage: STAGE_CONFIG[stage].label,
    count: leads.filter((l) => l.stage === stage).length,
    fill: STAGE_CONFIG[stage].color,
  }));

  const recentActivities = activities.slice(0, 12);

  const kpiCards = [
    { label: 'Active Leads', value: activeLeads.length, icon: <BarChart3 size={18} />, trend: '+8%', up: true, color: 'var(--color-accent)', onClick: () => navigate('/leads') },
    { label: 'Tours Today', value: todayVisits.length, icon: <Calendar size={18} />, trend: `${todayVisits.filter((v) => v.status === 'scheduled').length} pending`, up: true, color: 'var(--color-info)', onClick: () => navigate('/schedule') },
    { label: 'Overdue Follow-ups', value: overdueFollowUps.length, icon: <AlertTriangle size={18} />, trend: overdueFollowUps.length > 5 ? 'Critical' : overdueFollowUps.length > 0 ? 'Needs attention' : 'All clear', up: false, color: overdueFollowUps.length > 5 ? 'var(--color-danger)' : overdueFollowUps.length > 0 ? 'var(--color-warning)' : 'var(--color-success)', onClick: () => navigate('/inbox') },
    { label: 'Conversion Rate', value: convRate, icon: <TrendingUp size={18} />, trend: `${booked} booked`, up: true, color: 'var(--color-success)', onClick: () => navigate('/leads'), suffix: '%' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1>Dashboard</h1>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {kpiCards.map((card) => (
          <div
            key={card.label}
            onClick={card.onClick}
            className="card-hover"
            style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12,
              padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{card.label}</span>
              <div style={{ color: card.color, opacity: 0.7 }}>{card.icon}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--color-text-primary)' }}>
              <AnimatedNumber value={card.value} />{card.suffix || ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: card.up ? 'var(--color-success)' : 'var(--color-warning)' }}>
              {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline + Hot Leads */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        {/* Pipeline Funnel */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Pipeline Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pipelineData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="stage" width={110} tick={{ fontSize: 12, fill: '#9090a8' }} />
              <Tooltip
                contentStyle={{ background: '#1c1c2a', border: '1px solid #252535', borderRadius: 8, fontSize: 12, color: '#f0f0f8' }}
                cursor={{ fill: 'rgba(108,99,255,0.05)' }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                {pipelineData.map((entry, idx) => (
                  <rect key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hot Leads */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ marginBottom: 16 }}>🔥 Hot Leads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hotLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} compact />
            ))}
            {hotLeads.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 24 }}>No hot leads right now</div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed + Property Pressure */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Activity */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivities.map((act) => {
              const lead = leads.find((l) => l.id === act.lead_id);
              const agent = agents.find((a) => a.id === act.agent_id);
              return (
                <div key={act.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-background)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, color: 'var(--color-text-tertiary)' }}>
                    {act.type === 'call' ? '📞' : act.type === 'stage_change' ? '🔄' : act.type === 'visit' ? '🏠' : act.type === 'note' ? '📝' : act.type === 'assignment' ? '👤' : '💬'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.content}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {lead?.name} · {formatRelativeTime(act.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Property Pressure */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Property Inventory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {properties.map((p) => {
              const demand = p.total_units > 0 ? Math.round(((p.total_units - p.vacant_units) / p.total_units) * 100) : 0;
              const demandColor = demand > 75 ? 'var(--color-danger)' : demand > 50 ? 'var(--color-warning)' : 'var(--color-success)';
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{p.locality}</div>
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                    {p.vacant_units}/{p.total_units}
                  </span>
                  <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--color-border)', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ width: `${demand}%`, height: '100%', borderRadius: 3, background: demandColor, transition: 'width 0.6s ease-out' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
