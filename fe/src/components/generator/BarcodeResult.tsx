import React from 'react';
import { Copy, Save } from 'lucide-react';
import { BarcodeVisual } from '@Jade/components/generator/BarcodeVisual';

interface BarcodeResultProps {
    fullCode: string;
    selectedSupplier: string;
    selectedCategory: string;
    productDetail: string;
    checkDigit: number;
    onCopy: () => void;
    onSave: () => void;
}

export const BarcodeResult: React.FC<BarcodeResultProps> = ({
    fullCode,
    selectedSupplier,
    selectedCategory,
    productDetail,
    checkDigit,
    onCopy,
    onSave
}) => {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-widest">
                Mã Vạch Hoàn Chỉnh
            </h3>

            {/* Phần hiển thị Visual */}
            <div className="mb-6 text-black bg-white p-2 rounded-lg">
                <BarcodeVisual code={fullCode} />
            </div>

            {/* Phân tích mã */}
            <div className="flex justify-center gap-1 font-mono text-sm mb-6 opacity-80">
                <div className="flex flex-col items-center w-1/4">
                    <span className="bg-blue-600 px-1 py-1 rounded-t w-full truncate">{selectedSupplier}</span>
                    <span className="text-[10px] mt-1">NPP</span>
                </div>
                <div className="flex flex-col items-center w-1/4">
                    <span className="bg-green-600 px-1 py-1 rounded-t w-full truncate">{selectedCategory}</span>
                    <span className="text-[10px] mt-1">Nhóm</span>
                </div>
                <div className="flex flex-col items-center w-1/4">
                    <span className="bg-orange-600 px-1 py-1 rounded-t w-full truncate">
                        {productDetail.padEnd(5, '0')}
                    </span>
                    <span className="text-[10px] mt-1">Chi tiết</span>
                </div>
                <div className="flex flex-col items-center w-1/6">
                    <span className="bg-red-500 px-1 py-1 rounded-t w-full font-bold">{checkDigit}</span>
                    <span className="text-[10px] mt-1">Check</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
                <button
                    onClick={onCopy}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors shadow-lg text-sm"
                >
                    <Copy className="w-4 h-4" /> Copy
                </button>
                <button
                    onClick={onSave}
                    className="flex items-center gap-2 px-4 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors shadow-lg text-sm"
                >
                    <Save className="w-4 h-4" /> Lưu
                </button>
            </div>
        </div>
    );
};
