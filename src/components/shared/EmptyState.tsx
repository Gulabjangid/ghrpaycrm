import React from 'react';
import { Inbox } from 'lucide-react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        color: 'var(--color-text-tertiary)',
      }}
    >
      {icon || <Inbox size={28} />}
    </div>
    <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 8, fontSize: 16, fontWeight: 600 }}>{title}</h3>
    {description && (
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, maxWidth: 320, lineHeight: 1.5 }}>
        {description}
      </p>
    )}
    {action && <div style={{ marginTop: 20 }}>{action}</div>}
  </div>
);
