import React from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useDataStore } from '@/lib/dataStore';
import type { Lead, LeadSource, LeadTemperature, LeadStage } from '@/types/lead';
import { toast } from 'sonner';

export const LeadFormSheet: React.FC = () => {
  const open = useUIStore((s) => s.addLeadOpen);
  const setOpen = useUIStore((s) => s.setAddLeadOpen);
  const addLead = useDataStore((s) => s.addLead);
  const agents = useDataStore((s) => s.agents);
  const properties = useDataStore((s) => s.properties);

  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [source, setSource] = React.useState<LeadSource>('web');
  const [stage, setStage] = React.useState<LeadStage>('new');
  const [temperature, setTemperature] = React.useState<LeadTemperature>('warm');
  const [assignedTo, setAssignedTo] = React.useState('');
  const [propertyId, setPropertyId] = React.useState('');
  const [budgetMin, setBudgetMin] = React.useState('');
  const [budgetMax, setBudgetMax] = React.useState('');
  const [occupants, setOccupants] = React.useState('1');
  const [notes, setNotes] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^[6-9]\d{9}$/.test(phone)) e.phone = 'Enter valid 10-digit Indian mobile number';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addLead({
      name: name.trim(),
      phone,
      email: email || undefined,
      source,
      stage,
      temperature,
      score: temperature === 'hot' ? 75 : temperature === 'warm' ? 50 : 25,
      assigned_to: assignedTo || undefined,
      property_id: propertyId || undefined,
      budget_min: budgetMin ? Number(budgetMin) : undefined,
      budget_max: budgetMax ? Number(budgetMax) : undefined,
      occupants: Number(occupants) || 1,
      notes: notes || undefined,
      tags: [],
    });
    toast.success('Lead added successfully');
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setName(''); setPhone(''); setEmail(''); setSource('web'); setStage('new');
    setTemperature('warm'); setAssignedTo(''); setPropertyId(''); setBudgetMin('');
    setBudgetMax(''); setOccupants('1'); setNotes(''); setErrors({});
  };

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 6,
    border: '1px solid var(--color-border)', background: 'var(--color-background)',
    color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-body)',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block',
  };
  const errStyle: React.CSSProperties = { fontSize: 11, color: 'var(--color-danger)', marginTop: 4 };

  return (
    <>
      <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
      <div
        className="animate-slide-in-right"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, maxWidth: '100vw',
          background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)',
          zIndex: 51, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Add New Lead</h2>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Contact Info
          </div>

          <div>
            <label style={labelStyle}>Name *</label>
            <input style={{ ...inputStyle, borderColor: errors.name ? 'var(--color-danger)' : undefined }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Lead name" autoFocus />
            {errors.name && <div style={errStyle}>{errors.name}</div>}
          </div>

          <div>
            <label style={labelStyle}>Phone *</label>
            <input style={{ ...inputStyle, borderColor: errors.phone ? 'var(--color-danger)' : undefined }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
            {errors.phone && <div style={errStyle}>{errors.phone}</div>}
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input style={{ ...inputStyle, borderColor: errors.email ? 'var(--color-danger)' : undefined }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
            {errors.email && <div style={errStyle}>{errors.email}</div>}
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 8 }}>
            Lead Details
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Source</label>
              <select style={inputStyle} value={source} onChange={(e) => setSource(e.target.value as LeadSource)}>
                <option value="web">Web</option><option value="referral">Referral</option>
                <option value="walk_in">Walk-in</option><option value="social">Social</option>
                <option value="broker">Broker</option><option value="portal">Portal</option>
                <option value="cold_call">Cold Call</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Stage</label>
              <select style={inputStyle} value={stage} onChange={(e) => setStage(e.target.value as LeadStage)}>
                <option value="new">New</option><option value="contacted">Contacted</option>
                <option value="tour_scheduled">Tour Scheduled</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Temperature</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['hot', 'warm', 'cold'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemperature(t)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: 6, border: `1px solid ${temperature === t ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: temperature === t ? 'rgba(108,99,255,0.1)' : 'transparent',
                    color: temperature === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Interested Property</label>
            <select style={inputStyle} value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
              <option value="">Select property</option>
              {properties.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.locality}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Assign to Agent</label>
            <select style={inputStyle} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
              <option value="">Unassigned</option>
              {agents.filter((a) => a.role !== 'viewer').map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Budget Min (₹)</label>
              <input style={inputStyle} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} type="number" placeholder="10000" />
            </div>
            <div>
              <label style={labelStyle}>Budget Max (₹)</label>
              <input style={inputStyle} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} type="number" placeholder="25000" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes about this lead..." />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => { resetForm(); setOpen(false); }} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: 'var(--color-accent)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Add Lead
          </button>
        </div>
      </div>
    </>
  );
};
