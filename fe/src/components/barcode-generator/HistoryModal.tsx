import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { HistoryItem } from './types';

interface HistoryModalProps {
    isOpen: boolean;
    history: HistoryItem[];
    onClose: () => void;
    onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, history, onClose, onClearHistory }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Lịch Sử Lưu</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClearHistory}
                            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Xóa Tất Cả
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-3">
                        {history.map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono font-bold text-blue-900 tracking-wide text-lg">
                                        {item.code}
                                    </span>
                                    <span className="text-xs text-gray-400">{item.time}</span>
                                </div>
                                <div className="font-medium text-gray-800 mb-1">{item.compositeName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                                        {item.desc.split('[')[0]}
                                    </span>
                                    <span>•</span>
                                    <span>{item.subDesc}</span>
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="text-center text-gray-400 italic py-12">
                                Chưa có dữ liệu lịch sử
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
