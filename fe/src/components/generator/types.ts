// Type definitions for the barcode generator

export interface Supplier {
    id: string;
    name: string;
    color: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Variant {
    label: string;
    code: string;
}

export interface HistoryItem {
    code: string;
    desc: string;
    time: string;
    supplierId: string;
    categoryId: string;
    productId: string;
}

export type VariantPresets = Record<string, Variant[]>;
