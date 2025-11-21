import React from 'react';
import { Truck, ShoppingBag } from 'lucide-react';
import type { Supplier, Category } from './types';

interface ControlPanelProps {
    suppliers: Supplier[];
    categories: Category[];
    selectedSupplier: string;
    selectedCategory: string;
    onSupplierChange: (id: string) => void;
    onCategoryChange: (id: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    suppliers,
    categories,
    selectedSupplier,
    selectedCategory,
    onSupplierChange,
    onCategoryChange
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Nhà Phân Phối */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> 1. Nhà Phân Phối
                </h2>
                <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSupplier}
                    onChange={(e) => onSupplierChange(e.target.value)}
                >
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
                </select>
            </div>

            {/* Card 2: Loại Hàng */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> 2. Nhóm Hàng
                </h2>
                <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.id})</option>)}
                </select>
            </div>
        </div>
    );
};
