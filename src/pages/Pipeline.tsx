import React from 'react';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';

export const Pipeline: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Pipeline</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Drag and drop leads to update their stage.</p>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <KanbanBoard />
      </div>
    </div>
  );
};
