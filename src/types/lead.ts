export type LeadSource = 'web' | 'referral' | 'walk_in' | 'social' | 'broker' | 'portal' | 'cold_call';
export type LeadStage = 'new' | 'contacted' | 'tour_scheduled' | 'tour_done' | 'negotiation' | 'booked' | 'lost';
export type LeadTemperature = 'hot' | 'warm' | 'cold';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  source: LeadSource;
  stage: LeadStage;
  temperature: LeadTemperature;
  score: number;
  assigned_to?: string;
  property_id?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_move?: string;
  occupants: number;
  notes?: string;
  tags: string[];
  last_contacted?: string;
  next_follow_up?: string;
  lost_reason?: string;
  created_at: string;
  updated_at: string;
}

export const STAGE_ORDER: LeadStage[] = [
  'new', 'contacted', 'tour_scheduled', 'tour_done', 'negotiation', 'booked', 'lost'
];

export const STAGE_CONFIG: Record<LeadStage, { label: string; color: string; bg: string }> = {
  new:             { label: 'New',            color: '#9090a8', bg: 'rgba(144,144,168,0.15)' },
  contacted:       { label: 'Contacted',      color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  tour_scheduled:  { label: 'Tour Scheduled', color: '#6c63ff', bg: 'rgba(108,99,255,0.15)' },
  tour_done:       { label: 'Tour Done',      color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  negotiation:     { label: 'Negotiation',    color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  booked:          { label: 'Booked',         color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  lost:            { label: 'Lost',           color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  web: 'Web',
  referral: 'Referral',
  walk_in: 'Walk-in',
  social: 'Social',
  broker: 'Broker',
  portal: 'Portal',
  cold_call: 'Cold Call',
};

export const TEMPERATURE_CONFIG: Record<LeadTemperature, { label: string; color: string }> = {
  hot:  { label: 'Hot',  color: '#22c55e' },
  warm: { label: 'Warm', color: '#f59e0b' },
  cold: { label: 'Cold', color: '#ef4444' },
};
