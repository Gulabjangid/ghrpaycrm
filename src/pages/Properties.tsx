import React, { useState } from 'react';
import { Building2, MapPin, Users, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export const Properties: React.FC = () => {
  const properties = useDataStore((s) => s.properties);
  const leads = useDataStore((s) => s.leads);
  const addProperty = useDataStore((s) => s.addProperty);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProp, setNewProp] = useState({
    name: '',
    address: '',
    city: 'Bengaluru',
    locality: '',
    total_units: 10,
    vacant_units: 10,
    rent_min: 15000,
    rent_max: 25000,
    property_type: 'coliving' as const,
    images: [''],
    amenities: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProperty({
        ...newProp,
        images: newProp.images.filter(i => i.trim() !== '')
      });
      setShowAddModal(false);
      setNewProp({
        name: '', address: '', city: 'Bengaluru', locality: '',
        total_units: 10, vacant_units: 10, rent_min: 15000, rent_max: 25000,
        property_type: 'coliving', images: [''], amenities: []
      });
    } catch (error) {
      toast.error('Failed to add property');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Properties</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Inventory and demand pressure overview.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-hover"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--color-accent)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <Plus size={16} /> Add Property
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: 28, 
        flex: 1, 
        overflowY: 'auto', 
        paddingRight: 8, 
        paddingBottom: 40 
      }}>
        {properties.map((property) => {
          const propertyLeads = leads.filter(l => l.property_id === property.id && !['booked', 'lost'].includes(l.stage));
          const demandScore = property.total_units > 0 ? ((property.total_units - property.vacant_units) / property.total_units) * 100 : 0;
          const demandColor = demandScore > 75 ? 'var(--color-danger)' : demandScore > 50 ? 'var(--color-warning)' : 'var(--color-success)';
          const imageUrl = property.images && property.images.length > 0 ? property.images[0] : null;

          return (
            <div key={property.id} className="card-hover" style={{ 
              background: 'var(--color-surface)', 
              border: '1px solid var(--color-border)', 
              borderRadius: 20, 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              height: 'fit-content'
            }}>
              {/* Image Header */}
              <div style={{ width: '100%', height: 200, background: 'var(--color-surface-raised)', position: 'relative' }}>
                {imageUrl ? (
                  <img src={imageUrl} alt={property.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', gap: 8 }}>
                    <Building2 size={40} opacity={0.3} />
                    <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.5 }}>No Image Available</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-accent)', backdropFilter: 'blur(4px)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  {property.property_type}
                </div>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>{property.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    <MapPin size={14} style={{ color: 'var(--color-accent)' }} /> {property.locality}, {property.city}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '20px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Monthly Rent</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-accent)' }}>
                      {property.rent_min ? formatCurrency(property.rent_min) : '—'} - {property.rent_max ? formatCurrency(property.rent_max) : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Occupancy</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{Math.round(demandScore)}% Full</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>Availability</span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{property.vacant_units} / {property.total_units} units vacant</span>
                  </div>
                  <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'var(--color-surface-raised)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <div style={{ width: `${demandScore}%`, height: '100%', background: demandColor, borderRadius: 4, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
                    <Users size={16} /> {propertyLeads.length} active leads
                  </div>
                  {demandScore > 80 && (
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: 'rgba(236,72,153,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(236,72,153,0.2)', letterSpacing: '0.02em' }}>
                      🔥 HOT
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="animate-fade-in" style={{ background: 'var(--color-surface)', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Add New Property</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Property Name</label>
                <input required value={newProp.name} onChange={e => setNewProp({...newProp, name: e.target.value})} type="text" placeholder="e.g. Lumina Heights" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Type</label>
                  <select value={newProp.property_type} onChange={e => setNewProp({...newProp, property_type: e.target.value as any})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}>
                    <option value="coliving">Coliving</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>City</label>
                  <input required value={newProp.city} onChange={e => setNewProp({...newProp, city: e.target.value})} type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Locality</label>
                <input required value={newProp.locality} onChange={e => setNewProp({...newProp, locality: e.target.value})} type="text" placeholder="e.g. Koramangala" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Min Rent</label>
                  <input required value={newProp.rent_min} onChange={e => setNewProp({...newProp, rent_min: parseInt(e.target.value)})} type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Max Rent</label>
                  <input required value={newProp.rent_max} onChange={e => setNewProp({...newProp, rent_max: parseInt(e.target.value)})} type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Total Units</label>
                  <input required value={newProp.total_units} onChange={e => setNewProp({...newProp, total_units: parseInt(e.target.value)})} type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Vacant Units</label>
                  <input required value={newProp.vacant_units} onChange={e => setNewProp({...newProp, vacant_units: parseInt(e.target.value)})} type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Image URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newProp.images[0]} onChange={e => setNewProp({...newProp, images: [e.target.value]})} type="url" placeholder="https://unsplash.com/..." style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
                  <button type="button" onClick={() => setNewProp({...newProp, images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000']})} className="btn-hover" style={{ padding: '0 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-background)', cursor: 'pointer' }} title="Use random placeholder">
                    <ImageIcon size={16} />
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-hover" style={{ marginTop: 8, width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Create Property
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
