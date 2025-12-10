import { ShoppingBag } from 'lucide-react';
import React from 'react';
import type { Category } from '@Jade/components/generator/types';

interface CategorySelectorProps {
    categories: Category[];
    selectedCategory: string;
    onSelect: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    categories,
    selectedCategory,
    onSelect
}) => {

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <ShoppingBag className="w-5 h-5 text-green-500" />
                2. Loại Hàng (4 số tiếp)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => onSelect(c.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${selectedCategory === c.id
                            ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                            : 'border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-gray-400 mt-1">Mã: {c.id}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};
