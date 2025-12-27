import { create } from "zustand";
import type { StorageResponseOverview } from "@Jade/types/storage.d";

type StorageViewMode = "grid" | "list";

interface StorageModuleState {
  viewMode: StorageViewMode;
  activeMenuId: string | null;
  editingStorage: StorageResponseOverview | null;
  storageToDelete: string | null;
  
  // Actions
  setViewMode: (mode: StorageViewMode) => void;
  setActiveMenuId: (id: string | null) => void;
  setEditingStorage: (storage: StorageResponseOverview | null) => void;
  setStorageToDelete: (storageId: string | null) => void;
}

export const useStorageModuleStore = create<StorageModuleState>((set) => ({
  viewMode: "grid",
  activeMenuId: null,
  editingStorage: null,
  storageToDelete: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveMenuId: (id) => set({ activeMenuId: id }),
  setEditingStorage: (storage) => set({ editingStorage: storage }),
  setStorageToDelete: (storageId) => set({ storageToDelete: storageId }),
}));