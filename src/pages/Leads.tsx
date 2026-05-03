import React, { useMemo } from 'react';
import { Download, SlidersHorizontal } from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';
import { useFilterStore } from '@/store/filterStore';
import { LeadTable } from '@/components/leads/LeadTable';
import { STAGE_CONFIG, SOURCE_LABELS, TEMPERATURE_CONFIG } from '@/types/lead';

export const Leads: React.FC = () => {
  const leads = useDataStore((s) => s.leads);
  const agents = useDataStore((s) => s.agents);
  
  const search = useFilterStore((s) => s.search);
  const stageFilter = useFilterStore((s) => s.stage);
  const tempFilter = useFilterStore((s) => s.temperature);
  const sourceFilter = useFilterStore((s) => s.source);
  const assignedToFilter = useFilterStore((s) => s.assignedTo);
  
  const setStage = useFilterStore((s) => s.setStage);
  const setTemperature = useFilterStore((s) => s.setTemperature);
  const setSource = useFilterStore((s) => s.setSource);
  const setAssignedTo = useFilterStore((s) => s.setAssignedTo);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (search && !lead.name.toLowerCase().includes(search.toLowerCase()) && !lead.phone.includes(search)) {
        return false;
      }
      if (stageFilter !== 'all' && lead.stage !== stageFilter) return false;
      if (tempFilter !== 'all' && lead.temperature !== tempFilter) return false;
      if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
      if (assignedToFilter !== 'all' && lead.assigned_to !== assignedToFilter) return false;
      return true;
    }).sort((a, b) => b.score - a.score);
  }, [leads, search, stageFilter, tempFilter, sourceFilter, assignedToFilter]);

  const activeFiltersCount = [stageFilter, tempFilter, sourceFilter, assignedToFilter].filter(f => f !== 'all').length;

  const selectStyle: React.CSSProperties = {
    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
    borderRadius: 6, padding: '6px 12px', fontSize: 12, color: 'var(--color-text-primary)',
    outline: 'none', cursor: 'pointer',
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Leads</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage and track all your contacts.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13, marginRight: 8 }}>
          <SlidersHorizontal size={16} /> Filters {activeFiltersCount > 0 && <span style={{ background: 'var(--color-accent)', color: '#fff', borderRadius: 100, padding: '0 6px', fontSize: 10 }}>{activeFiltersCount}</span>}
        </div>
        
        <select style={selectStyle} value={stageFilter} onChange={(e) => setStage(e.target.value as any)}>
          <option value="all">All Stages</option>
          {Object.entries(STAGE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        
        <select style={selectStyle} value={tempFilter} onChange={(e) => setTemperature(e.target.value as any)}>
          <option value="all">All Temperatures</option>
          {Object.entries(TEMPERATURE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>

        <select style={selectStyle} value={sourceFilter} onChange={(e) => setSource(e.target.value as any)}>
          <option value="all">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select style={selectStyle} value={assignedToFilter} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="all">All Agents</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        {activeFiltersCount > 0 && (
          <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: 12, cursor: 'pointer', padding: '6px 12px' }}>
            Clear all
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <LeadTable leads={filteredLeads} />
      </div>
    </div>
  );
};
