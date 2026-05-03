import React, { useState } from 'react';
import { X, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useDataStore } from '@/lib/dataStore';
import { STAGE_CONFIG, SOURCE_LABELS, TEMPERATURE_CONFIG } from '@/types/lead';
import { ScoreRing } from './ScoreRing';
import { TemperatureDot } from '@/components/shared/TemperatureDot';
import { getInitials, getAvatarColor, formatRelativeTime, formatCurrency } from '@/lib/utils';

type Tab = 'overview' | 'activity' | 'visits' | 'followups';

export const LeadDetailSheet: React.FC = () => {
  const open = useUIStore((s) => s.leadSheetOpen);
  const selectedId = useUIStore((s) => s.selectedLeadId);
  const close = useUIStore((s) => s.closeLeadSheet);
  const leads = useDataStore((s) => s.leads);
  const agents = useDataStore((s) => s.agents);
  const properties = useDataStore((s) => s.properties);
  const activities = useDataStore((s) => s.activities);
  const visits = useDataStore((s) => s.visits);
  const followUps = useDataStore((s) => s.followUps);
  const [tab, setTab] = useState<Tab>('overview');

  if (!open || !selectedId) return null;

  const lead = leads.find((l) => l.id === selectedId);
  if (!lead) return null;

  const agent = agents.find((a) => a.id === lead.assigned_to);
  const property = properties.find((p) => p.id === lead.property_id);
  const leadActivities = activities.filter((a) => a.lead_id === lead.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const leadVisits = visits.filter((v) => v.lead_id === lead.id);
  const leadFollowUps = followUps.filter((f) => f.lead_id === lead.id);
  const stageConf = STAGE_CONFIG[lead.stage];

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '8px 16px', fontSize: 12, fontWeight: tab === t ? 600 : 400, border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--color-accent)' : 'transparent'}`,
    background: 'transparent', color: tab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)',
  });

  const iconMap: Record<string, React.ReactNode> = {
    call: <Phone size={14} />, whatsapp: <MessageCircle size={14} />, email: <Mail size={14} />,
    visit: <Clock size={14} />, note: <span style={{ fontSize: 14 }}>📝</span>,
    stage_change: <span style={{ fontSize: 14 }}>🔄</span>, assignment: <span style={{ fontSize: 14 }}>👤</span>,
  };

  return (
    <>
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
      <div
        className="animate-slide-in-right"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 600, maxWidth: '100vw',
          background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)',
          zIndex: 51, display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: getAvatarColor(lead.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                {getInitials(lead.name)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>{lead.name}</h2>
                  <TemperatureDot temperature={lead.temperature} size={10} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 100, background: stageConf.bg, color: stageConf.color }}>{stageConf.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{SOURCE_LABELS[lead.source]}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ScoreRing score={lead.score} size={48} strokeWidth={3} />
              <button onClick={close} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ icon: <Phone size={14} />, label: 'Call' }, { icon: <MessageCircle size={14} />, label: 'WhatsApp' }, { icon: <Mail size={14} />, label: 'Email' }].map((a) => (
              <button key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
          <button style={tabStyle('overview')} onClick={() => setTab('overview')}>Overview</button>
          <button style={tabStyle('activity')} onClick={() => setTab('activity')}>Activity ({leadActivities.length})</button>
          <button style={tabStyle('visits')} onClick={() => setTab('visits')}>Visits ({leadVisits.length})</button>
          <button style={tabStyle('followups')} onClick={() => setTab('followups')}>Follow-ups ({leadFollowUps.length})</button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Contact */}
              <div style={{ background: 'var(--color-background)', borderRadius: 8, padding: 16, border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-accent)', marginBottom: 12 }}>Contact</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Phone</div><div style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>{lead.phone}</div></div>
                  <div><div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Email</div><div style={{ fontSize: 13 }}>{lead.email || '—'}</div></div>
                </div>
              </div>

              {/* Property interest */}
              {property && (
                <div style={{ background: 'var(--color-background)', borderRadius: 8, padding: 16, border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-accent)', marginBottom: 12 }}>Property Interest</h3>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{property.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{property.locality} · {property.property_type}</div>
                  {(lead.budget_min || lead.budget_max) && (
                    <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
                      Budget: {lead.budget_min ? formatCurrency(lead.budget_min) : '—'} – {lead.budget_max ? formatCurrency(lead.budget_max) : '—'}
                    </div>
                  )}
                </div>
              )}

              {/* Assignment */}
              {agent && (
                <div style={{ background: 'var(--color-background)', borderRadius: 8, padding: 16, border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-accent)', marginBottom: 12 }}>Assigned Agent</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: getAvatarColor(agent.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff' }}>
                      {getInitials(agent.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{agent.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{agent.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {lead.notes && (
                <div style={{ background: 'var(--color-background)', borderRadius: 8, padding: 16, border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-accent)', marginBottom: 8 }}>Notes</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{lead.notes}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {leadActivities.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 32 }}>No activity logged yet</div>
              ) : (
                leadActivities.map((act) => {
                  const actAgent = agents.find((a) => a.id === act.agent_id);
                  return (
                    <div key={act.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-background)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-text-secondary)' }}>
                        {iconMap[act.type] || '•'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{act.content}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                          {actAgent?.name} · {formatRelativeTime(act.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === 'visits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leadVisits.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 32 }}>No visits scheduled</div>
              ) : (
                leadVisits.map((v) => {
                  const vProp = properties.find((p) => p.id === v.property_id);
                  return (
                    <div key={v.id} style={{ background: 'var(--color-background)', borderRadius: 8, padding: 14, border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{vProp?.name || 'Property'}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {new Date(v.scheduled_at).toLocaleDateString()} · {new Date(v.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: v.status === 'completed' ? 'rgba(34,197,94,0.15)' : v.status === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(56,189,248,0.15)', color: v.status === 'completed' ? '#22c55e' : v.status === 'cancelled' ? '#ef4444' : '#38bdf8' }}>
                          {v.status}
                        </span>
                      </div>
                      {v.feedback && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>{v.feedback}</p>}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === 'followups' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leadFollowUps.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 32 }}>No follow-ups</div>
              ) : (
                leadFollowUps.map((f) => {
                  const overdue = !f.is_done && new Date(f.due_at) < new Date();
                  return (
                    <div key={f.id} style={{ background: 'var(--color-background)', borderRadius: 8, padding: 14, border: `1px solid ${overdue ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'capitalize', color: 'var(--color-text-secondary)' }}>{f.type}</span>
                          {f.is_done && <span style={{ fontSize: 10, color: '#22c55e' }}>✓ Done</span>}
                          {overdue && <span style={{ fontSize: 10, color: 'var(--color-danger)' }}>Overdue</span>}
                        </div>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: overdue ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>
                          {formatRelativeTime(f.due_at)}
                        </span>
                      </div>
                      {f.note && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>{f.note}</p>}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
