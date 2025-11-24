import React from 'react';
import { Hash, RefreshCw } from 'lucide-react';

interface InputVariantProps {
    onManualInput: (code: string) => void;
    onRandomGenerate: () => void;
    selectedVariant: string;
}

const InputVariant: React.FC<InputVariantProps> = ({ onManualInput, onRandomGenerate, selectedVariant }) => {

    return (
        <div className="mt-4 pt-4 shadow-sm border border-gray-200 bg-white rounded-xl p-4">
            <p className="text-xs text-black mb-2">Hoặc nhập mã thủ công / Random:</p>
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={selectedVariant}
                        onChange={(e) => onManualInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        placeholder="00001"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-lg tracking-wider"
                    />
                    <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                </div>
                <button
                    onClick={onRandomGenerate}
                    className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Tạo ngẫu nhiên"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default InputVariant;