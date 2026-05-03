import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import { STAGE_CONFIG, SOURCE_LABELS, TEMPERATURE_CONFIG } from '@/types/lead';
import type { Lead } from '@/types/lead';
import { TemperatureDot } from '@/components/shared/TemperatureDot';
import { getInitials, getAvatarColor, formatRelativeTime } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { EmptyState } from '@/components/shared/EmptyState';

interface Props {
  leads: Lead[];
}

export const LeadTable: React.FC<Props> = ({ leads }) => {
  const openLeadSheet = useUIStore((s) => s.openLeadSheet);
  const agents = useDataStore((s) => s.agents);

  if (leads.length === 0) {
    return <EmptyState title="No leads found" description="Try adjusting your filters or search query." />;
  }

  const thStyle: React.CSSProperties = {
    textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600,
    color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)',
    textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--color-surface)',
    position: 'sticky', top: 0, zIndex: 10,
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px', borderBottom: '1px solid var(--color-border)', fontSize: 13,
    color: 'var(--color-text-primary)',
  };

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Lead</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Stage & Source</th>
              <th style={thStyle}>Assigned To</th>
              <th style={thStyle}>Score</th>
              <th style={thStyle}>Added</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const agent = agents.find((a) => a.id === lead.assigned_to);
              const stageConf = STAGE_CONFIG[lead.stage];
              
              return (
                <tr
                  key={lead.id}
                  onClick={() => openLeadSheet(lead.id)}
                  style={{ cursor: 'pointer', transition: 'background 150ms' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: getAvatarColor(lead.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                          {lead.name}
                          <TemperatureDot temperature={lead.temperature} size={6} pulse={false} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontFamily: 'var(--font-mono)' }}>{lead.phone}</div>
                    {lead.email && <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{lead.email}</div>}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100, background: stageConf.bg, color: stageConf.color }}>
                        {stageConf.label}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{SOURCE_LABELS[lead.source]}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    {agent ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: getAvatarColor(agent.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: '#fff' }}>
                          {getInitials(agent.name)}
                        </div>
                        <span>{agent.name.split(' ')[0]}</span>
                      </div>
                    ) : <span style={{ color: 'var(--color-text-tertiary)' }}>Unassigned</span>}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: lead.score >= 70 ? 'var(--color-success)' : lead.score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                      {lead.score}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: 'var(--color-text-secondary)' }}>{formatRelativeTime(lead.created_at)}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
