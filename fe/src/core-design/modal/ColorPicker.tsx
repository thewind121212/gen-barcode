import { Check } from 'lucide-react';
import { allColors } from './colorOptions';

type ColorPickerContentProps = {
    selectedColor: string;
    onSelect: (colorId: string) => void;
    onClose: () => void;
};

export default function ColorPicker({
    selectedColor,
    onSelect,
    onClose,
}: ColorPickerContentProps) {
    return (
        <ColorPickerContent
            selectedColor={selectedColor}
            onSelect={onSelect}
            onClose={onClose}
        />
    );
}

// -----------------------------------------------------------------------------
// Sub-components for Content (Example Content)
// -----------------------------------------------------------------------------

function ColorPickerContent({
    selectedColor,
    onSelect,
    onClose,
}: ColorPickerContentProps) {
    const selectedName = allColors.find(c => c.id === selectedColor)?.name || 'Custom';

    const handleDoubleClick = (colorId: string) => {
        onSelect(colorId);
        onClose();
    };

    return (
        <>
            <div className="p-8">
                <p className="text-xs mb-4 text-slate-500 dark:text-slate-400">
                    Selected: <span className="font-semibold text-indigo-500 dark:text-indigo-400">{selectedName}</span>
                </p>
                <div className="p-3 grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-[50vh] overflow-y-auto">
                    {allColors.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => onSelect(c.id)}
                            onDoubleClick={() => handleDoubleClick(c.id)}
                            className={`w-10 h-10 rounded-full ${c.bg} transition-all duration-300 flex items-center justify-center shadow-sm ${selectedColor === c.id
                                    ? `ring-4 ${c.ring} ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110`
                                    : 'hover:scale-110 opacity-90 hover:opacity-100'
                                }`}
                            title={c.name}
                        >
                            {selectedColor === c.id && <Check size={18} className="text-white drop-shadow-md" strokeWidth={3} />}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
