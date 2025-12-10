import React from 'react';
import { Tag, Settings, Plus } from 'lucide-react';
import type { Variant } from '@Jade/components/generator/types';

interface VariantSelectorProps {
    variants: Variant[];
    selectedVariant: string;
    onSelectVariant: (code: string) => void;
    onManualInput: (value: string) => void;
    onRandomGenerate: () => void;
    onOpenModal: () => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
    variants,
    selectedVariant,
    onSelectVariant,
    onOpenModal
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <Settings className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                    <Tag className="w-5 h-5 text-orange-500" />
                    3. Chọn Biến Thể (5 số tiếp)
                </h2>
                <button
                    onClick={onOpenModal}
                    className="text-xs bg-orange-100 text-orange-600 hover:bg-orange-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-colors"
                >
                    <Plus className="w-3 h-3" /> Tạo mới
                </button>
            </div>

            {/* Khu vực các nút chọn nhanh */}
            <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {variants.map((variant, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectVariant(variant.code)}
                            className={`px-2 py-3 rounded-lg text-sm font-medium border transition-all relative group ${selectedVariant === variant.code
                                ? 'bg-orange-100 border-orange-500 text-orange-800 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="font-bold truncate">{variant.label}</div>
                            <div className="text-[10px] opacity-75 font-mono">{variant.code}</div>
                        </button>
                    ))}

                    {/* Nút Thêm Nhanh dạng Card */}
                    <button
                        onClick={onOpenModal}
                        className="px-2 py-3 rounded-lg text-sm font-medium border border-dashed border-gray-300 text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-[10px]">Thêm mới</span>
                    </button>
                </div>
            </div>

            {/* Input thủ công */}
        </div>
    );
};
