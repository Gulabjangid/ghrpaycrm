import { create } from 'zustand';
import type { LeadStage, LeadTemperature, LeadSource } from '@/types/lead';

interface FilterState {
  search: string;
  stage: LeadStage | 'all';
  temperature: LeadTemperature | 'all';
  source: LeadSource | 'all';
  assignedTo: string | 'all';
  setSearch: (s: string) => void;
  setStage: (s: LeadStage | 'all') => void;
  setTemperature: (t: LeadTemperature | 'all') => void;
  setSource: (s: LeadSource | 'all') => void;
  setAssignedTo: (a: string | 'all') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  stage: 'all',
  temperature: 'all',
  source: 'all',
  assignedTo: 'all',
  setSearch: (search) => set({ search }),
  setStage: (stage) => set({ stage }),
  setTemperature: (temperature) => set({ temperature }),
  setSource: (source) => set({ source }),
  setAssignedTo: (assignedTo) => set({ assignedTo }),
  resetFilters: () => set({ search: '', stage: 'all', temperature: 'all', source: 'all', assignedTo: 'all' }),
}));
