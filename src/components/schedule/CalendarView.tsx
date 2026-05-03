import React, { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import type { Visit } from '@/types/visit';
import { useDataStore } from '@/lib/dataStore';
import { getAvatarColor, getInitials } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  visits: Visit[];
}

export const CalendarView: React.FC<Props> = ({ visits }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const leads = useDataStore((s) => s.leads);
  
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  const hours = Array.from({ length: 12 }).map((_, i) => i + 8); // 8 AM to 7 PM

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{format(currentDate, 'MMMM yyyy')}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setCurrentDate(d => addDays(d, -7))} style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 6, padding: 6, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '4px 12px', color: 'var(--color-text-primary)', fontSize: 13, cursor: 'pointer' }}>
            Today
          </button>
          <button onClick={() => setCurrentDate(d => addDays(d, 7))} style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 6, padding: 6, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ width: 60, flexShrink: 0 }} />
        {weekDays.map(day => {
          const isToday = isSameDay(day, new Date());
          return (
            <div key={day.toISOString()} style={{ flex: 1, padding: '12px 0', textAlign: 'center', borderLeft: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{format(day, 'EEE')}</div>
              <div style={{ fontSize: 16, fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--color-accent)' : 'var(--color-text-primary)', marginTop: 4 }}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', position: 'relative' }}>
        <div style={{ width: 60, flexShrink: 0, borderRight: '1px solid var(--color-border)' }}>
          {hours.map(hour => (
            <div key={hour} style={{ height: 60, padding: '8px', fontSize: 11, color: 'var(--color-text-tertiary)', textAlign: 'right', borderBottom: '1px solid transparent' }}>
              {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
            </div>
          ))}
        </div>
        
        <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} style={{ flex: 1, borderRight: '1px solid var(--color-border)', position: 'relative' }}>
              {hours.map(hour => (
                <div key={hour} style={{ height: 60, borderBottom: '1px solid var(--color-border)', opacity: 0.2 }} />
              ))}
              
              {visits.filter(v => isSameDay(new Date(v.scheduled_at), day)).map(visit => {
                const vDate = new Date(visit.scheduled_at);
                const startHour = vDate.getHours();
                const startMin = vDate.getMinutes();
                if (startHour < 8 || startHour > 19) return null;
                
                const top = ((startHour - 8) * 60 + startMin);
                const height = visit.duration_min;
                const lead = leads.find(l => l.id === visit.lead_id);
                
                const isPast = vDate < new Date() && visit.status === 'scheduled';
                
                return (
                  <div
                    key={visit.id}
                    style={{
                      position: 'absolute',
                      top, height, left: 4, right: 4,
                      background: visit.status === 'completed' ? 'rgba(34,197,94,0.15)' : visit.status === 'cancelled' ? 'rgba(239,68,68,0.1)' : isPast ? 'rgba(245,158,11,0.15)' : 'rgba(108,99,255,0.15)',
                      border: `1px solid ${visit.status === 'completed' ? '#22c55e' : visit.status === 'cancelled' ? 'rgba(239,68,68,0.3)' : isPast ? '#f59e0b' : '#6c63ff'}`,
                      borderRadius: 4, padding: 4, overflow: 'hidden', cursor: 'pointer',
                      zIndex: 10
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-primary)' }}>{lead?.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--color-text-secondary)' }}>{format(vDate, 'h:mm a')}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
