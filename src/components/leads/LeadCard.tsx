import React from 'react';
import type { Lead } from '@/types/lead';
import { STAGE_CONFIG, SOURCE_LABELS } from '@/types/lead';
import { ScoreRing } from './ScoreRing';
import { TemperatureDot } from '@/components/shared/TemperatureDot';
import { getInitials, getAvatarColor, formatRelativeTime } from '@/lib/utils';
import { useDataStore } from '@/lib/dataStore';
import { useUIStore } from '@/store/uiStore';
import { Phone, Calendar, Eye } from 'lucide-react';

interface Props {
  lead: Lead;
  compact?: boolean;
}

export const LeadCard: React.FC<Props> = ({ lead, compact }) => {
  const agents = useDataStore((s) => s.agents);
  const properties = useDataStore((s) => s.properties);
  const openLeadSheet = useUIStore((s) => s.openLeadSheet);
  const agent = agents.find((a) => a.id === lead.assigned_to);
  const property = properties.find((p) => p.id === lead.property_id);
  const stageConf = STAGE_CONFIG[lead.stage];
  const isOverdue = lead.next_follow_up && new Date(lead.next_follow_up) < new Date();

  return (
    <div
      onClick={() => openLeadSheet(lead.id)}
      className="card-hover"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: compact ? 12 : 16,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 8 : 10,
      }}
    >
      {/* Row 1: Avatar + Name + Temperature */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: getAvatarColor(lead.name),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {getInitials(lead.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lead.name}
            </span>
            <TemperatureDot temperature={lead.temperature} />
          </div>
        </div>
        <ScoreRing score={lead.score} size={34} strokeWidth={2.5} />
      </div>

      {/* Row 2: Stage badge + Source */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            padding: '2px 10px',
            borderRadius: 100,
            background: stageConf.bg,
            color: stageConf.color,
          }}
        >
          {stageConf.label}
        </span>
        <span
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 100,
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {SOURCE_LABELS[lead.source]}
        </span>
      </div>

      {/* Row 3: Phone + Property */}
      {!compact && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <Phone size={12} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>{lead.phone}</span>
          </div>
          {property && (
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {property.name} · {property.locality}
            </div>
          )}
        </>
      )}

      {/* Row 4: Agent + Follow-up */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        {agent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: getAvatarColor(agent.name),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8,
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {getInitials(agent.name)}
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{agent.name.split(' ')[0]}</span>
          </div>
        )}
        {lead.next_follow_up && (
          <span
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: 4,
              background: isOverdue ? 'rgba(239,68,68,0.15)' : 'rgba(56,189,248,0.1)',
              color: isOverdue ? 'var(--color-danger)' : 'var(--color-info)',
            }}
          >
            {formatRelativeTime(lead.next_follow_up)}
          </span>
        )}
      </div>
    </div>
  );
};
