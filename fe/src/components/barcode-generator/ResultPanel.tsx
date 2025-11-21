import React from 'react';
import { Copy, Save, History } from 'lucide-react';
import { BarcodeVisual } from './BarcodeVisual';
import type { Selection } from './types';

interface ResultPanelProps {
    fullCode: string;
    checkDigit: number;
    selection: Selection;
    selectedSupplier: string;
    selectedCategory: string;
    onCopy: () => void;
    onSave: () => void;
    onViewHistory: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
    fullCode,
    checkDigit,
    selection,
    selectedSupplier,
    selectedCategory,
    onCopy,
    onSave,
    onViewHistory
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-6">
            <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-widest text-center">Mã Vạch Hoàn Chỉnh</h3>

            <div className="mb-6 transform scale-90 origin-center">
                <BarcodeVisual code={fullCode} />
            </div>

            {/* Phân tích mã */}
            <div className="flex justify-center gap-0.5 font-mono text-xs mb-6">
                <div className="flex flex-col items-center w-10">
                    <span className="bg-gray-100 py-1 w-full text-center border-b-2 border-gray-400">{selectedSupplier}</span>
                    <span className="text-[8px] text-gray-400 mt-1">NPP</span>
                </div>
                <div className="flex flex-col items-center w-12">
                    <span className="bg-gray-100 py-1 w-full text-center border-b-2 border-gray-400">{selectedCategory}</span>
                    <span className="text-[8px] text-gray-400 mt-1">Nhóm</span>
                </div>
                {/* 3 Phần ghép */}
                <div className="flex flex-col items-center w-6">
                    <span className="bg-orange-100 text-orange-700 font-bold py-1 w-full text-center border-b-2 border-orange-500">{selection.part1.code}</span>
                    <span className="text-[8px] text-orange-500 mt-1">Dòng</span>
                </div>
                <div className="flex flex-col items-center w-8">
                    <span className="bg-blue-100 text-blue-700 font-bold py-1 w-full text-center border-b-2 border-blue-500">{selection.part2.code}</span>
                    <span className="text-[8px] text-blue-500 mt-1">Màu</span>
                </div>
                <div className="flex flex-col items-center w-8">
                    <span className="bg-purple-100 text-purple-700 font-bold py-1 w-full text-center border-b-2 border-purple-500">{selection.part3.code}</span>
                    <span className="text-[8px] text-purple-500 mt-1">Size</span>
                </div>
                {/* Check digit */}
                <div className="flex flex-col items-center w-6">
                    <span className="bg-red-100 text-red-600 font-bold py-1 w-full text-center border-b-2 border-red-500">{checkDigit}</span>
                    <span className="text-[8px] text-red-500 mt-1">Check</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button onClick={onCopy} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all flex justify-center items-center gap-2">
                    <Copy className="w-4 h-4" /> Copy Mã
                </button>
                <button onClick={onSave} className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all flex justify-center items-center gap-2">
                    <Save className="w-4 h-4" /> Lưu Lịch Sử
                </button>
                <button onClick={onViewHistory} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all flex justify-center items-center gap-2">
                    <History className="w-4 h-4" /> Xem Lịch Sử
                </button>
            </div>
        </div>
    );
};
