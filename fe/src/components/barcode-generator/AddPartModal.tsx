import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { PartKey } from './types';

interface AddPartModalProps {
    isOpen: boolean;
    title: string;
    targetPart: PartKey | null;
    onClose: () => void;
    onAdd: (name: string, code: string) => void;
}

export const AddPartModal: React.FC<AddPartModalProps> = ({ isOpen, title, targetPart, onClose, onAdd }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemCode, setNewItemCode] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNewItemName('');
            setNewItemCode('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onAdd(newItemName, newItemCode);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-red-500" /></button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Tên hiển thị (Ví dụ: Xanh Lơ)</label>
                        <input
                            autoFocus
                            type="text"
                            className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                            Mã số ({targetPart === 'part1' ? '1 số' : '2 số'})
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded p-2 font-mono text-sm outline-none focus:border-blue-500"
                            maxLength={targetPart === 'part1' ? 1 : 2}
                            placeholder={targetPart === 'part1' ? '1' : '01'}
                            value={newItemCode}
                            onChange={(e) => setNewItemCode(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 mt-2"
                    >
                        Lưu & Chọn
                    </button>
                </div>
            </div>
        </div>
    );
};
