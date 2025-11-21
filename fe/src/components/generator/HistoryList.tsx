import React from 'react';
import { Trash2 } from 'lucide-react';
import type { HistoryItem } from './types';

interface HistoryListProps {
    history: HistoryItem[];
    onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
    const handleCopyHistoryItem = (code: string) => {
        navigator.clipboard.writeText(code);
        alert("Đã copy!");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Lịch sử tạo mã</h2>
                <button
                    onClick={onClear}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                    <Trash2 className="w-3 h-3" /> Xóa
                </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                {history.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 italic">Chưa có mã nào được lưu</p>
                ) : (
                    history.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors group"
                        >
                            <div className="overflow-hidden">
                                <div className="font-mono font-bold text-gray-800 tracking-wider text-sm">
                                    {item.code}
                                </div>
                                <div className="text-xs text-gray-500 truncate w-48" title={item.desc}>
                                    {item.desc}
                                </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                                <span className="text-[10px] text-gray-400 block">{item.time}</span>
                                <button
                                    onClick={() => handleCopyHistoryItem(item.code)}
                                    className="text-blue-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
