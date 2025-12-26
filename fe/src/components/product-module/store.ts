import { create } from "zustand";

export type CreateProductModalData = {
  mode: "CREATE" | "EDIT";
  productEditId: string | null;
};

export type PackFormData = {
  id: number;
  name: string;
  multiplier: number;
  price: string;
  barcode: string;
};

export type ContainerConfig = {
  name: string;
  multiplier: number;
  barcode: string;
};

const initialCreateProductModalData: CreateProductModalData = {
  mode: "CREATE",
  productEditId: null,
};

const initialContainerConfig: ContainerConfig = {
  name: "Pallet",
  multiplier: 100,
  barcode: "",
};

export interface ProductModuleStore {
  // UI State
  viewMode: "grid" | "list";
  activeMenuId: string | null;
  createProductModalData: CreateProductModalData;
  
  // Form State (for create/edit dialog)
  productName: string;
  category: string;
  baseUnit: string;
  sellPrice: string;
  storageId: string;
  isExportPriceEnabled: boolean;
  exportPrice: string;
  barcodes: string[];
  barcodeInput: string;
  imagePreview: string | null;
  
  // Advanced settings
  showAdvanced: boolean;
  advancedTab: "packs" | "inventory";
  packs: PackFormData[];
  inventoryType: "TOTAL_ONLY" | "LOT_CONTAINER";
  containerConfig: ContainerConfig;
  
  // Actions - UI
  setViewMode: (mode: "grid" | "list") => void;
  setActiveMenuId: (menuId: string | null) => void;
  setCreateProductModalData: (data: CreateProductModalData) => void;
  resetCreateProductModalData: () => void;
  
  // Actions - Form
  setProductName: (name: string) => void;
  setCategory: (category: string) => void;
  setBaseUnit: (unit: string) => void;
  setSellPrice: (price: string) => void;
  setStorageId: (id: string) => void;
  setIsExportPriceEnabled: (enabled: boolean) => void;
  setExportPrice: (price: string) => void;
  setBarcodeInput: (input: string) => void;
  addBarcode: (barcode: string) => void;
  removeBarcode: (index: number) => void;
  setImagePreview: (preview: string | null) => void;
  
  // Actions - Advanced
  setShowAdvanced: (show: boolean) => void;
  setAdvancedTab: (tab: "packs" | "inventory") => void;
  addPack: () => void;
  removePack: (id: number) => void;
  updatePack: (id: number, field: keyof PackFormData, value: string | number) => void;
  setInventoryType: (type: "TOTAL_ONLY" | "LOT_CONTAINER") => void;
  setContainerConfig: (config: Partial<ContainerConfig>) => void;
  
  // Reset form
  resetForm: () => void;
}

const initialFormState = {
  productName: "",
  category: "",
  baseUnit: "each",
  sellPrice: "",
  storageId: "",
  isExportPriceEnabled: false,
  exportPrice: "",
  barcodes: [] as string[],
  barcodeInput: "",
  imagePreview: null as string | null,
  showAdvanced: false,
  advancedTab: "packs" as const,
  packs: [] as PackFormData[],
  inventoryType: "TOTAL_ONLY" as const,
  containerConfig: initialContainerConfig,
};

export const useProductModuleStore = create<ProductModuleStore>((set) => ({
  // Initial UI State
  viewMode: "grid",
  activeMenuId: null,
  createProductModalData: initialCreateProductModalData,
  
  // Initial Form State
  ...initialFormState,
  
  // UI Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveMenuId: (menuId) => set({ activeMenuId: menuId }),
  setCreateProductModalData: (data) => set({ createProductModalData: data }),
  resetCreateProductModalData: () => set({ createProductModalData: initialCreateProductModalData }),
  
  // Form Actions
  setProductName: (name) => set({ productName: name }),
  setCategory: (category) => set({ category }),
  setBaseUnit: (unit) => set({ baseUnit: unit }),
  setSellPrice: (price) => set({ sellPrice: price }),
  setStorageId: (id) => set({ storageId: id }),
  setIsExportPriceEnabled: (enabled) => set({ isExportPriceEnabled: enabled }),
  setExportPrice: (price) => set({ exportPrice: price }),
  setBarcodeInput: (input) => set({ barcodeInput: input }),
  addBarcode: (barcode) => set((state) => ({ 
    barcodes: [...state.barcodes, barcode],
    barcodeInput: ""
  })),
  removeBarcode: (index) => set((state) => ({
    barcodes: state.barcodes.filter((_, i) => i !== index)
  })),
  setImagePreview: (preview) => set({ imagePreview: preview }),
  
  // Advanced Actions
  setShowAdvanced: (show) => set({ showAdvanced: show }),
  setAdvancedTab: (tab) => set({ advancedTab: tab }),
  addPack: () => set((state) => {
    const newId = state.packs.length > 0 ? Math.max(...state.packs.map(p => p.id)) + 1 : 1;
    return { packs: [...state.packs, { id: newId, name: "", multiplier: 1, price: "", barcode: "" }] };
  }),
  removePack: (id) => set((state) => ({
    packs: state.packs.filter(p => p.id !== id)
  })),
  updatePack: (id, field, value) => set((state) => ({
    packs: state.packs.map(p => p.id === id ? { ...p, [field]: value } : p)
  })),
  setInventoryType: (type) => set({ inventoryType: type }),
  setContainerConfig: (config) => set((state) => ({
    containerConfig: { ...state.containerConfig, ...config }
  })),
  
  // Reset
  resetForm: () => set(initialFormState),
}));

