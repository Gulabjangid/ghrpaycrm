export type AgentRole = 'admin' | 'agent' | 'viewer';

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: AgentRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
