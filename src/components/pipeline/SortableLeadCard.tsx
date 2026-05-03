import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Lead } from '@/types/lead';
import { LeadCard } from '@/components/leads/LeadCard';

interface Props {
  lead: Lead;
}

export const SortableLeadCard: React.FC<Props> = ({ lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id, data: { type: 'Lead', lead } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    boxShadow: isDragging ? '0 0 0 2px var(--color-accent), 0 8px 30px rgba(0,0,0,0.5)' : undefined,
    zIndex: isDragging ? 100 : undefined,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} compact />
    </div>
  );
};
