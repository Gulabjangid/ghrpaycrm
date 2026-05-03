import React from 'react';
import { Phone, MessageCircle, Mail, Clock, Check } from 'lucide-react';
import type { FollowUp } from '@/types/activity';
import { useDataStore } from '@/lib/dataStore';
import { formatRelativeTime, getAvatarColor, getInitials } from '@/lib/utils';
import { TemperatureDot } from '@/components/shared/TemperatureDot';
import { STAGE_CONFIG } from '@/types/lead';
import { toast } from 'sonner';

interface Props {
  task: FollowUp;
}

export const TaskCard: React.FC<Props> = ({ task }) => {
  const leads = useDataStore((s) => s.leads);
  const agents = useDataStore((s) => s.agents);
  const completeFollowUp = useDataStore((s) => s.completeFollowUp);
  
  const lead = leads.find((l) => l.id === task.lead_id);
  const agent = agents.find((a) => a.id === task.agent_id);

  if (!lead) return null;

  const isOverdue = new Date(task.due_at) < new Date();
  const stageConf = STAGE_CONFIG[lead.stage];

  const iconMap: Record<string, React.ReactNode> = {
    call: <Phone size={14} />,
    whatsapp: <MessageCircle size={14} />,
    email: <Mail size={14} />,
    visit: <Clock size={14} />
  };

  const handleComplete = () => {
    completeFollowUp(task.id);
    toast.success('Task marked as complete');
  };

  return (
    <div style={{ background: 'var(--color-surface)', border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}`, borderRadius: 8, padding: 16, display: 'flex', gap: 16 }}>
      {/* priority ring simulated with simple color block */}
      <div style={{ width: 4, borderRadius: 4, background: isOverdue ? 'var(--color-danger)' : 'var(--color-accent)' }} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{lead.name}</span>
              <TemperatureDot temperature={lead.temperature} size={8} pulse={false} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-primary)', marginTop: 4 }}>
              {task.note}
            </div>
          </div>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 100, background: isOverdue ? 'rgba(239,68,68,0.1)' : 'var(--color-background)', color: isOverdue ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}>
            {formatRelativeTime(task.due_at)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100, background: stageConf.bg, color: stageConf.color }}>
            {stageConf.label}
          </span>
          {agent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: getAvatarColor(agent.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: '#fff' }}>
                {getInitials(agent.name)}
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{agent.name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', borderLeft: '1px solid var(--color-border)', paddingLeft: 16 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-primary)', fontSize: 12, cursor: 'pointer' }}>
          {iconMap[task.type]} {task.type === 'call' ? 'Log Call' : task.type === 'whatsapp' ? 'Send WA' : task.type === 'email' ? 'Send Email' : 'Action'}
        </button>
        <button onClick={handleComplete} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: 'none', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          <Check size={14} /> Mark Done
        </button>
      </div>
    </div>
  );
};
