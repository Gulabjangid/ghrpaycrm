import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Kanban, Users, CalendarDays, Inbox, Building2,
  UsersRound, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useDataStore } from '@/lib/dataStore';
import { getInitials, getAvatarColor } from '@/lib/utils';

const mainNav = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { path: '/leads', icon: Users, label: 'Leads' },
  { path: '/schedule', icon: CalendarDays, label: 'Schedule' },
  { path: '/inbox', icon: Inbox, label: 'Inbox' },
  { path: '/properties', icon: Building2, label: 'Properties' },
];

const secondaryNav = [
  { path: '/agents', icon: UsersRound, label: 'Team', adminOnly: true },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const location = useLocation();
  const agent = useDataStore((s) => s.currentAgent);
  const followUps = useDataStore((s) => s.followUps);
  const overdueCount = followUps.filter((f) => !f.is_done && new Date(f.due_at) < new Date()).length;

  return (
    <aside
      style={{
        width: collapsed ? 60 : 240,
        minWidth: collapsed ? 60 : 240,
        height: '100vh',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms ease-out, min-width 200ms ease-out',
        position: 'relative',
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '20px 12px' : '20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid var(--color-border)',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/dashboard')}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #ec4899, #f472b6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 14,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          G
        </div>
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-text-primary)' }}>
            CRM
          </span>
        )}
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mainNav.map((item) => {
          const active = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          const showBadge = item.path === '/inbox' && overdueCount > 0;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px 14px' : '10px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(108,99,255,0.12)' : 'transparent',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-body)',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 150ms ease-out',
                borderLeft: active ? '3px solid var(--color-accent)' : '3px solid transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
              {showBadge && (
                <span
                  style={{
                    position: collapsed ? 'absolute' : 'relative',
                    top: collapsed ? 6 : undefined,
                    right: collapsed ? 6 : undefined,
                    marginLeft: collapsed ? 0 : 'auto',
                    background: 'var(--color-danger)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 100,
                    padding: '1px 6px',
                    minWidth: 18,
                    textAlign: 'center',
                  }}
                >
                  {overdueCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Secondary Nav */}
      <div style={{ padding: '8px 8px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {secondaryNav.map((item) => {
          const active = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px 14px' : '10px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(108,99,255,0.12)' : 'transparent',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                width: '100%',
                textAlign: 'left',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Agent profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px 8px' : '10px 16px',
            marginTop: 4,
            borderRadius: 8,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: agent ? getAvatarColor(agent.name) : '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {agent ? getInitials(agent.name) : '?'}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {agent ? agent.name : 'Unknown Agent'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'capitalize' }}>
                {agent ? agent.role : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        style={{
          position: 'absolute',
          top: 72,
          right: -12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          zIndex: 40,
          transition: 'all 150ms',
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};
