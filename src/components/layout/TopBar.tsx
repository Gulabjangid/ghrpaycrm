import React from 'react';
import { Search, Bell, Plus, Command } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useFilterStore } from '@/store/filterStore';
import { useDataStore } from '@/lib/dataStore';

export const TopBar: React.FC = () => {
  const setAddLeadOpen = useUIStore((s) => s.setAddLeadOpen);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const search = useFilterStore((s) => s.search);
  const setSearch = useFilterStore((s) => s.setSearch);
  const followUps = useDataStore((s) => s.followUps);
  const overdueCount = followUps.filter((f) => !f.is_done && new Date(f.due_at) < new Date()).length;

  return (
    <header
      style={{
        height: 56,
        minHeight: 56,
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        zIndex: 20,
      }}
    >
      {/* Search */}
      <div
        style={{
          flex: 1,
          maxWidth: 420,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--color-background)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: '6px 12px',
        }}
      >
        <Search size={16} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search leads, properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-primary)',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
        <kbd
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            padding: '1px 6px',
            fontSize: 10,
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          ⌘K
        </kbd>
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <button
        onClick={() => setAddLeadOpen(true)}
        className="btn-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          borderRadius: 8,
          border: 'none',
          background: 'var(--color-accent)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
        }}
      >
        <Plus size={16} />
        Add Lead
      </button>

      {/* Notifications bell */}
      <button
        onClick={() => import('sonner').then(m => m.toast.info('No new notifications'))}
        className="btn-hover"
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Bell size={18} />
        {overdueCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: 'var(--color-danger)',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 100,
              width: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {overdueCount > 9 ? '9+' : overdueCount}
          </span>
        )}
      </button>
    </header>
  );
};
