import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDataStore } from '@/lib/dataStore';
import { STAGE_ORDER } from '@/types/lead';
import type { Lead, LeadStage } from '@/types/lead';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from '@/components/leads/LeadCard';

export const KanbanBoard: React.FC = () => {
  const leads = useDataStore((s) => s.leads);
  const changeStage = useDataStore((s) => s.changeStage);
  
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getStageLeads = (stage: LeadStage) => {
    return leads.filter((l) => l.stage === stage).sort((a, b) => b.score - a.score);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find((l) => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const overId = over.id as string;
    
    // Check if dropped on a column
    if (STAGE_ORDER.includes(overId as LeadStage)) {
      changeStage(leadId, overId as LeadStage);
      return;
    }

    // Check if dropped on another card
    const overLead = leads.find((l) => l.id === overId);
    if (overLead && overLead.stage) {
      changeStage(leadId, overLead.stage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'flex',
          gap: 24,
          height: '100%',
          overflowX: 'auto',
          paddingBottom: 16,
        }}
      >
        {STAGE_ORDER.map((stage) => (
          <KanbanColumn key={stage} stage={stage} leads={getStageLeads(stage)} />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <div style={{ transform: 'scale(1.05)', opacity: 0.9 }}>
            <LeadCard lead={activeLead} compact />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
