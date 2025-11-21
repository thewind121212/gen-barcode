import React from 'react';
import { Trash2 } from 'lucide-react';
import type { HistoryItem } from './types';

interface HistoryListProps {
    history: HistoryItem[];
    onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClearHistory }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-sm font-bold text-gray-700 uppercase">Lịch sử lưu</h2>
                <button onClick={onClearHistory} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Xóa
                </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                {history.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border border-gray-100 text-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start">
                            <span className="font-mono font-bold text-blue-900 tracking-wide">{item.code}</span>
                            <span className="text-[10px] text-gray-400">{item.time}</span>
                        </div>
                        <div className="mt-1 font-medium text-gray-800">{item.compositeName}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <span className="bg-gray-200 px-1 rounded text-[10px]">{item.desc.split('[')[0]}</span>
                            • {item.subDesc}
                        </div>
                    </div>
                ))}
                {history.length === 0 && <div className="text-center text-gray-400 text-xs italic py-4">Chưa có dữ liệu</div>}
            </div>
        </div>
    );
};
