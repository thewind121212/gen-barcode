import React from 'react';
import { Truck } from 'lucide-react';
import type { Supplier } from './types';

interface SupplierSelectorProps {
    suppliers: Supplier[];
    selectedSupplier: string;
    onSelect: (supplierId: string) => void;
}

export const SupplierSelector: React.FC<SupplierSelectorProps> = ({
    suppliers,
    selectedSupplier,
    onSelect
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <Truck className="w-5 h-5 text-blue-500" />
                1. Nhà Phân Phối (3 số đầu)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {suppliers.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => onSelect(s.id)}
                        className={`p-3 rounded-lg border text-left flex flex-col justify-center items-center transition-all ${selectedSupplier === s.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <span className="font-medium">{s.name}</span>
                        <span className={`text-xs px-2 py-1 mt-1 rounded font-bold ${s.color}`}>{s.id}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
