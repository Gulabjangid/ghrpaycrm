import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  selectedLeadId: string | null;
  leadSheetOpen: boolean;
  addLeadOpen: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  openLeadSheet: (id: string) => void;
  closeLeadSheet: () => void;
  setAddLeadOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: localStorage.getItem('sidebar-collapsed') === 'true',
  selectedLeadId: null,
  leadSheetOpen: false,
  addLeadOpen: false,
  commandPaletteOpen: false,
  toggleSidebar: () =>
    set((s) => {
      const next = !s.sidebarCollapsed;
      localStorage.setItem('sidebar-collapsed', String(next));
      return { sidebarCollapsed: next };
    }),
  openLeadSheet: (id) => set({ selectedLeadId: id, leadSheetOpen: true }),
  closeLeadSheet: () => set({ leadSheetOpen: false, selectedLeadId: null }),
  setAddLeadOpen: (open) => set({ addLeadOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
