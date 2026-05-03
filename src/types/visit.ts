export type VisitStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Visit {
  id: string;
  lead_id: string;
  property_id: string;
  agent_id?: string;
  scheduled_at: string;
  duration_min: number;
  status: VisitStatus;
  notes?: string;
  feedback?: string;
  post_tour_form_filled: boolean;
  created_at: string;
}
