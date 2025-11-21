import React from 'react';
import { Plus, X } from 'lucide-react';

interface AddVariantModalProps {
    isOpen: boolean;
    newVariantName: string;
    newVariantCode: string;
    onNameChange: (name: string) => void;
    onCodeChange: (code: string) => void;
    onAdd: () => void;
    onClose: () => void;
}

export const AddVariantModal: React.FC<AddVariantModalProps> = ({
    isOpen,
    newVariantName,
    newVariantCode,
    onNameChange,
    onCodeChange,
    onAdd,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-orange-500" /> Thêm biến thể mới
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên biến thể (Ví dụ: Size 3XL)
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            placeholder="Nhập tên..."
                            value={newVariantName}
                            onChange={(e) => onNameChange(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã số (5 ký tự)
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 font-mono tracking-wider focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            placeholder="00000"
                            maxLength={5}
                            value={newVariantCode}
                            onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{newVariantCode.length}/5</p>
                    </div>
                    <div className="pt-2 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onAdd}
                            className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-orange-200"
                        >
                            Thêm Ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
