import { create } from "zustand";

type StorageViewMode = "grid" | "list";

interface StorageModuleState {
  viewMode: StorageViewMode;
  activeMenuId: string | null;
  
  // Actions
  setViewMode: (mode: StorageViewMode) => void;
  setActiveMenuId: (id: string | null) => void;
}

export const useStorageModuleStore = create<StorageModuleState>((set) => ({
  viewMode: "grid",
  activeMenuId: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveMenuId: (id) => set({ activeMenuId: id }),
}));