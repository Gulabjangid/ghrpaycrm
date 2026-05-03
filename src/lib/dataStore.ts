import { create } from 'zustand';
import type { Lead, LeadStage } from '@/types/lead';
import type { Visit } from '@/types/visit';
import type { Activity, FollowUp, Property } from '@/types/activity';
import type { Agent } from '@/types/agent';
import { supabase } from './supabase';

interface DataStore {
  leads: Lead[];
  agents: Agent[];
  properties: Property[];
  visits: Visit[];
  followUps: FollowUp[];
  activities: Activity[];
  currentAgent: Agent | null;
  isInitialized: boolean;

  init: () => Promise<void>;

  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  changeStage: (id: string, stage: LeadStage) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  addVisit: (visit: Omit<Visit, 'id' | 'created_at'>) => Promise<void>;
  updateVisit: (id: string, updates: Partial<Visit>) => Promise<void>;

  addFollowUp: (followUp: Omit<FollowUp, 'id' | 'created_at'>) => Promise<void>;
  completeFollowUp: (id: string) => Promise<void>;
  snoozeFollowUp: (id: string, newDueAt: string) => Promise<void>;

  addActivity: (activity: Omit<Activity, 'id' | 'created_at'>) => Promise<void>;
  addProperty: (property: Omit<Property, 'id' | 'created_at' | 'is_active'>) => Promise<void>;
}

import { toast } from 'sonner';

export const useDataStore = create<DataStore>((set, get) => ({
  leads: [],
  agents: [],
  properties: [],
  visits: [],
  followUps: [],
  activities: [],
  currentAgent: null,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData?.session?.user;

    const [
      { data: agents },
      { data: leads },
      { data: properties },
      { data: visits },
      { data: followUps },
      { data: activities }
    ] = await Promise.all([
      supabase.from('agents').select('*'),
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('properties').select('*'),
      supabase.from('visits').select('*'),
      supabase.from('follow_ups').select('*'),
      supabase.from('activities').select('*').order('created_at', { ascending: false })
    ]);

    let activeAgent = null;
    if (sessionUser && agents) {
      activeAgent = agents.find((a: any) => a.user_id === sessionUser.id) as unknown as Agent;
    }
    if (!activeAgent && agents && agents.length > 0) {
      activeAgent = agents[0] as unknown as Agent;
    }

    set({
      agents: (agents as unknown as Agent[]) || [],
      leads: (leads as unknown as Lead[]) || [],
      properties: (properties as unknown as Property[]) || [],
      visits: (visits as unknown as Visit[]) || [],
      followUps: (followUps as unknown as FollowUp[]) || [],
      activities: (activities as unknown as Activity[]) || [],
      currentAgent: activeAgent,
      isInitialized: true,
    });

    // Real-time subscriptions to trigger re-fetches
    supabase.channel('public:leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
         if (payload.eventType === 'INSERT') {
           toast.success(`New lead created!`);
         }
         // Naive re-fetch on change for simplicity
         supabase.from('leads').select('*').order('created_at', { ascending: false })
            .then(({ data }) => set({ leads: (data as unknown as Lead[]) || [] }));
      })
      .subscribe();
    
    supabase.channel('public:activities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, (payload) => {
         if (payload.eventType === 'INSERT') {
           toast.info(`New activity logged`);
         }
         supabase.from('activities').select('*').order('created_at', { ascending: false })
            .then(({ data }) => set({ activities: (data as unknown as Activity[]) || [] }));
      })
      .subscribe();
  },

  addLead: async (leadData) => {
    const { data, error } = await supabase.from('leads').insert(leadData).select().single();
    if (error) throw error;
    const newLead = data as unknown as Lead;
    set((s) => ({ leads: [newLead, ...s.leads] }));
    
    const currentAgent = get().currentAgent;
    if (currentAgent) {
      await get().addActivity({
        lead_id: newLead.id,
        agent_id: currentAgent.id,
        type: 'assignment',
        content: `Lead created and assigned`,
      });
    }
    return newLead;
  },

  updateLead: async (id, updates) => {
    const { error } = await supabase.from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l)),
    }));
  },

  changeStage: async (id, stage) => {
    const lead = get().leads.find((l) => l.id === id);
    if (!lead || lead.stage === stage) return;
    const oldStage = lead.stage;

    const { error } = await supabase.from('leads').update({ stage, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;

    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, stage, updated_at: new Date().toISOString() } : l)),
    }));

    const currentAgent = get().currentAgent;
    if (currentAgent) {
      await get().addActivity({
        lead_id: id,
        agent_id: currentAgent.id,
        type: 'stage_change',
        content: `Moved from ${oldStage} → ${stage}`,
      });
    }
  },

  deleteLead: async (id) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) }));
  },

  addVisit: async (visitData) => {
    const { data, error } = await supabase.from('visits').insert(visitData).select().single();
    if (error) throw error;
    set((s) => ({ visits: [...s.visits, data as unknown as Visit] }));
  },

  updateVisit: async (id, updates) => {
    const { error } = await supabase.from('visits').update(updates).eq('id', id);
    if (error) throw error;
    set((s) => ({
      visits: s.visits.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  },

  addFollowUp: async (data) => {
    const { data: newFU, error } = await supabase.from('follow_ups').insert(data as any).select().single();
    if (error) throw error;
    set((s) => ({ followUps: [...s.followUps, newFU as unknown as FollowUp] }));
  },

  completeFollowUp: async (id) => {
    const { error } = await supabase.from('follow_ups').update({ is_done: true, done_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    set((s) => ({
      followUps: s.followUps.map((f) => (f.id === id ? { ...f, is_done: true, done_at: new Date().toISOString() } : f)),
    }));
  },

  snoozeFollowUp: async (id, newDueAt) => {
    const f = get().followUps.find((fu) => fu.id === id);
    const newSnoozeCount = (f?.snooze_count || 0) + 1;
    const { error } = await supabase.from('follow_ups').update({ due_at: newDueAt, snooze_count: newSnoozeCount } as any).eq('id', id);
    if (error) throw error;
    set((s) => ({
      followUps: s.followUps.map((fu) => (fu.id === id ? { ...fu, due_at: newDueAt, snooze_count: newSnoozeCount } : fu)),
    }));
  },

  addActivity: async (data) => {
    const { data: newAct, error } = await supabase.from('activities').insert(data as any).select().single();
    if (error) throw error;
    set((s) => ({ activities: [newAct as unknown as Activity, ...s.activities] }));
  },

  addProperty: async (propertyData) => {
    const { data, error } = await supabase.from('properties').insert(propertyData).select().single();
    if (error) throw error;
    set((s) => ({ properties: [...s.properties, data as unknown as Property] }));
    toast.success('Property added successfully');
  },
}));
