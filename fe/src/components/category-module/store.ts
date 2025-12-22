import { create } from "zustand";

export type CreateCategoryModalData = {
  mode: "create" | "edit";
    categoryEditId: string | null;
    categoryCreateParentId: string | null;
    categoryCreateLayer: string | null;
    categoryCreateName: string | null;
};

const initialCreateCategoryModalData: CreateCategoryModalData = {
  mode: "create",
  categoryEditId: null,
  categoryCreateParentId: null,
  categoryCreateLayer: null,
  categoryCreateName: null,
};

export interface CategoryModuleStore {
    categories: {
        createCategoryModalData: CreateCategoryModalData;
    mainCategoryViewMode: "grid" | "list";
    activeMenuId: string | null;
  };
  setMainCategoryViewMode: (mode: "grid" | "list") => void;
  setActiveMenuId: (menuId: string | null) => void;
  setCreateCategoryModalData: (data: CreateCategoryModalData) => void;
  resetCreateCategoryModalData: () => void;
}

export const useCategoryModuleStore = create<CategoryModuleStore>((set) => ({
  categories: {
    createCategoryModalData: initialCreateCategoryModalData,
    mainCategoryViewMode: "grid",
    activeMenuId: null,
  },
  setMainCategoryViewMode: (mode) =>
    set((state) => ({
      categories: { ...state.categories, mainCategoryViewMode: mode },
    })),
  setActiveMenuId: (menuId) =>
    set((state) => ({
      categories: { ...state.categories, activeMenuId: menuId },
    })),
  setCreateCategoryModalData: (data) =>
    set((state) => ({
      categories: { ...state.categories, createCategoryModalData: data },
    })),
  resetCreateCategoryModalData: () =>
    set((state) => ({
      categories: {
        ...state.categories,
        createCategoryModalData: initialCreateCategoryModalData,
      },
    })),
}));
