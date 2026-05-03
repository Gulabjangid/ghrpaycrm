import React from 'react';
import { Calendar, Clock, MapPin, Check, X, RefreshCw } from 'lucide-react';
import type { Visit } from '@/types/visit';
import { useDataStore } from '@/lib/dataStore';
import { getInitials, getAvatarColor, formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  visit: Visit;
}

export const VisitCard: React.FC<Props> = ({ visit }) => {
  const leads = useDataStore((s) => s.leads);
  const properties = useDataStore((s) => s.properties);
  const agents = useDataStore((s) => s.agents);
  const updateVisit = useDataStore((s) => s.updateVisit);
  
  const lead = leads.find((l) => l.id === visit.lead_id);
  const property = properties.find((p) => p.id === visit.property_id);
  const agent = agents.find((a) => a.id === visit.agent_id);

  if (!lead || !property) return null;

  const statusColors = {
    scheduled: { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8', label: 'Scheduled' },
    completed: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', label: 'Done' },
    cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', label: 'Cancelled' },
    no_show: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', label: 'No Show' },
  };

  const statusConf = statusColors[visit.status];
  const date = new Date(visit.scheduled_at);

  const handleStatus = (status: Visit['status']) => {
    updateVisit(visit.id, { status });
    toast.success(`Visit marked as ${status.replace('_', ' ')}`);
  };

  return (
    <div className="card-hover" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: getAvatarColor(lead.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff' }}>
            {getInitials(lead.name)}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{lead.name}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{lead.phone}</div>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: statusConf.bg, color: statusConf.text }}>
          {statusConf.label}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <Calendar size={14} /> <span>{date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <Clock size={14} style={{ marginLeft: 8 }} /> <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({visit.duration_min}m)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-primary)' }}>
          <MapPin size={14} style={{ color: 'var(--color-text-secondary)' }} />
          <span>{property.name} <span style={{ color: 'var(--color-text-tertiary)' }}>· {property.locality}</span></span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {agent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: getAvatarColor(agent.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: '#fff' }}>
              {getInitials(agent.name)}
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{agent.name.split(' ')[0]}</span>
          </div>
        )}
        
        {visit.status === 'scheduled' && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-hover" onClick={() => handleStatus('completed')} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Mark Done">
              <Check size={14} />
            </button>
            <button className="btn-hover" onClick={() => handleStatus('no_show')} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="No Show">
              <RefreshCw size={14} />
            </button>
            <button className="btn-hover" onClick={() => handleStatus('cancelled')} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Cancel">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
