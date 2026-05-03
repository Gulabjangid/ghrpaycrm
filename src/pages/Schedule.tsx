import React, { useMemo, useState } from 'react';
import { Plus, X, Calendar as CalendarIcon, Clock as ClockIcon, User, Building2 } from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';
import { VisitCard } from '@/components/schedule/VisitCard';
import { CalendarView } from '@/components/schedule/CalendarView';
import { isSameDay } from 'date-fns';
import { toast } from 'sonner';

export const Schedule: React.FC = () => {
  const visits = useDataStore((s) => s.visits);
  const leads = useDataStore((s) => s.leads);
  const properties = useDataStore((s) => s.properties);
  const currentAgent = useDataStore((s) => s.currentAgent);
  const addVisit = useDataStore((s) => s.addVisit);
  const addActivity = useDataStore((s) => s.addActivity);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    lead_id: '',
    property_id: '',
    scheduled_at: new Date().toISOString().slice(0, 16),
    duration_min: 60,
    notes: ''
  });

  const todayVisits = useMemo(() => {
    const today = new Date();
    return visits
      .filter((v) => isSameDay(new Date(v.scheduled_at), today))
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  }, [visits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lead_id || !formData.property_id) {
      toast.error('Please select both a lead and a property');
      return;
    }

    try {
      await addVisit({
        ...formData,
        agent_id: currentAgent?.id,
        status: 'scheduled'
      });

      if (currentAgent) {
        await addActivity({
          lead_id: formData.lead_id,
          agent_id: currentAgent.id,
          type: 'visit',
          content: `Tour scheduled for ${new Date(formData.scheduled_at).toLocaleString()}`
        });
      }

      setShowModal(false);
      setFormData({
        lead_id: '',
        property_id: '',
        scheduled_at: new Date().toISOString().slice(0, 16),
        duration_min: 60,
        notes: ''
      });
      toast.success('Visit scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule visit');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Schedule</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage your property tours and meetings.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-hover"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--color-accent)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <Plus size={16} /> Book Visit
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
        {/* Left Panel: Today's visits */}
        <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Today's Tours</h3>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
            {todayVisits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-tertiary)', background: 'var(--color-surface)', borderRadius: 8, border: '1px dashed var(--color-border)' }}>
                No visits scheduled for today
              </div>
            ) : (
              todayVisits.map((visit) => <VisitCard key={visit.id} visit={visit} />)
            )}
          </div>
        </div>

        {/* Right Panel: Calendar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <CalendarView visits={visits} />
        </div>
      </div>

      {/* Book Visit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="animate-fade-in" style={{ background: 'var(--color-surface)', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Schedule a New Visit</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                  <User size={14} /> Select Lead
                </label>
                <select 
                  required
                  value={formData.lead_id} 
                  onChange={e => {
                    const leadId = e.target.value;
                    const lead = leads.find(l => l.id === leadId);
                    setFormData({ ...formData, lead_id: leadId, property_id: lead?.property_id || formData.property_id });
                  }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
                >
                  <option value="">-- Select a Lead --</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                  <Building2 size={14} /> Select Property
                </label>
                <select 
                  required
                  value={formData.property_id} 
                  onChange={e => setFormData({ ...formData, property_id: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
                >
                  <option value="">-- Select a Property --</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>{prop.name} - {prop.locality}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    <CalendarIcon size={14} /> Date & Time
                  </label>
                  <input 
                    required
                    type="datetime-local" 
                    value={formData.scheduled_at}
                    onChange={e => setFormData({ ...formData, scheduled_at: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    <ClockIcon size={14} /> Duration (min)
                  </label>
                  <input 
                    required
                    type="number" 
                    value={formData.duration_min}
                    onChange={e => setFormData({ ...formData, duration_min: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific requirements for the tour..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14, minHeight: 80, resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-hover" style={{ marginTop: 8, width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Schedule Visit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
