export type ActivityType = 'call' | 'whatsapp' | 'email' | 'visit' | 'note' | 'stage_change' | 'assignment';

export interface Activity {
  id: string;
  lead_id: string;
  agent_id?: string;
  type: ActivityType;
  content?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type FollowUpType = 'call' | 'whatsapp' | 'email' | 'visit';

export interface FollowUp {
  id: string;
  lead_id: string;
  agent_id?: string;
  due_at: string;
  type: FollowUpType;
  note?: string;
  is_done: boolean;
  done_at?: string;
  created_at: string;
  snooze_count?: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  locality?: string;
  total_units: number;
  vacant_units: number;
  rent_min?: number;
  rent_max?: number;
  property_type: 'coliving' | 'apartment' | 'villa';
  images: string[];
  amenities: string[];
  is_active: boolean;
  created_at: string;
}
