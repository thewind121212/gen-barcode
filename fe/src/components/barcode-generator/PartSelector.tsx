import React from 'react';
import { Layers, Settings, Tag, Plus, Palette, Ruler } from 'lucide-react';
import type { ComponentOptions, Selection, PartKey, ComponentPart } from './types';

interface PartSelectorProps {
    componentOptions: ComponentOptions;
    selection: Selection;
    onSelectionChange: (part: PartKey, item: ComponentPart) => void;
    onOpenAddModal: (part: PartKey, title: string) => void;
}

export const PartSelector: React.FC<PartSelectorProps> = ({
    componentOptions,
    selection,
    onSelectionChange,
    onOpenAddModal
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
                <Layers className="w-32 h-32" />
            </div>

            <h2 className="text-lg font-bold text-orange-700 mb-6 flex items-center gap-2 border-b border-orange-100 pb-2">
                <Settings className="w-5 h-5" /> 3. Lắp Ghép Chi Tiết (5 Số)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Cột 1: Dòng/Phiên bản (1 số) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-500 uppercase flex gap-1">
                            <Tag className="w-3 h-3" /> Dòng (1 số)
                        </label>
                        <button onClick={() => onOpenAddModal('part1', 'Thêm Dòng Mới')} className="text-orange-500 hover:bg-orange-50 p-1 rounded"><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg scrollbar-thin">
                        {componentOptions.part1.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectionChange('part1', item)}
                                className={`w-full text-left px-3 py-2 text-sm border-b border-gray-50 flex justify-between items-center hover:bg-gray-50 transition-colors ${selection.part1.code === item.code ? 'bg-orange-100 text-orange-800 font-semibold' : 'text-gray-600'
                                    }`}
                            >
                                <span>{item.name}</span>
                                <span className="font-mono text-xs bg-white px-1 rounded border">{item.code}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cột 2: Màu sắc (2 số) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-500 uppercase flex gap-1">
                            <Palette className="w-3 h-3" /> Màu (2 số)
                        </label>
                        <button onClick={() => onOpenAddModal('part2', 'Thêm Màu Mới')} className="text-orange-500 hover:bg-orange-50 p-1 rounded"><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg scrollbar-thin">
                        {componentOptions.part2.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectionChange('part2', item)}
                                className={`w-full text-left px-3 py-2 text-sm border-b border-gray-50 flex justify-between items-center hover:bg-gray-50 transition-colors ${selection.part2.code === item.code ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-600'
                                    }`}
                            >
                                <span>{item.name}</span>
                                <span className="font-mono text-xs bg-white px-1 rounded border">{item.code}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cột 3: Size (2 số) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-500 uppercase flex gap-1">
                            <Ruler className="w-3 h-3" /> Size (2 số)
                        </label>
                        <button onClick={() => onOpenAddModal('part3', 'Thêm Size Mới')} className="text-orange-500 hover:bg-orange-50 p-1 rounded"><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg scrollbar-thin">
                        {componentOptions.part3.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectionChange('part3', item)}
                                className={`w-full text-left px-3 py-2 text-sm border-b border-gray-50 flex justify-between items-center hover:bg-gray-50 transition-colors ${selection.part3.code === item.code ? 'bg-purple-100 text-purple-800 font-semibold' : 'text-gray-600'
                                    }`}
                            >
                                <span>{item.name}</span>
                                <span className="font-mono text-xs bg-white px-1 rounded border">{item.code}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Preview Tên Ghép */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                <span className="text-xs text-gray-400 uppercase font-bold">Tên sản phẩm kết hợp:</span>
                <div className="text-lg font-medium text-gray-800 mt-1 flex items-center justify-center gap-2">
                    <span className="text-orange-600">{selection.part1.name}</span>
                    <span className="text-gray-300">--</span>
                    <span className="text-blue-600">{selection.part2.name}</span>
                    <span className="text-gray-300">--</span>
                    <span className="text-purple-600">{selection.part3.name}</span>
                </div>
            </div>
        </div>
    );
};
