import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Lead, LeadStage } from '@/types/lead';
import { STAGE_CONFIG } from '@/types/lead';
import { SortableLeadCard } from './SortableLeadCard';
import { useUIStore } from '@/store/uiStore';

interface Props {
  stage: LeadStage;
  leads: Lead[];
}

export const KanbanColumn: React.FC<Props> = ({ stage, leads }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: 'Column', stage },
  });
  
  const setAddLeadOpen = useUIStore((s) => s.setAddLeadOpen);
  const config = STAGE_CONFIG[stage];

  return (
    <div
      style={{
        width: 280,
        minWidth: 280,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: isOver ? 'rgba(108,99,255,0.05)' : 'transparent',
        borderRadius: 8,
        border: isOver ? '1px dashed var(--color-accent)' : '1px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid',
          borderBottomColor: config.color,
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {config.label}
          </h3>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 100,
              background: config.bg,
              color: config.color,
            }}
          >
            {leads.length}
          </span>
        </div>
        <button
          onClick={() => setAddLeadOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* List */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <SortableLeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '20px 0',
              color: 'var(--color-text-tertiary)',
              fontSize: 12,
              fontStyle: 'italic',
              border: '1px dashed var(--color-border)',
              borderRadius: 8,
              marginTop: 4,
            }}
          >
            No leads here
          </div>
        )}
      </div>
    </div>
  );
};
