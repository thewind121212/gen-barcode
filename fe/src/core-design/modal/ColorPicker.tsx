import { Check } from 'lucide-react';

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

export const allColors = [
    { id: 'slate-400', name: 'Slate', bg: 'bg-slate-400', ring: 'ring-slate-400' },
    { id: 'red-400', name: 'Red', bg: 'bg-red-400', ring: 'ring-red-400' },
    { id: 'orange-400', name: 'Orange', bg: 'bg-orange-400', ring: 'ring-orange-400' },
    { id: 'amber-400', name: 'Amber', bg: 'bg-amber-400', ring: 'ring-amber-400' },
    { id: 'yellow-400', name: 'Yellow', bg: 'bg-yellow-400', ring: 'ring-yellow-400' },
    { id: 'lime-400', name: 'Lime', bg: 'bg-lime-400', ring: 'ring-lime-400' },
    { id: 'green-400', name: 'Green', bg: 'bg-green-400', ring: 'ring-green-400' },
    { id: 'emerald-400', name: 'Emerald', bg: 'bg-emerald-400', ring: 'ring-emerald-400' },
    { id: 'teal-400', name: 'Teal', bg: 'bg-teal-400', ring: 'ring-teal-400' },
    { id: 'cyan-400', name: 'Cyan', bg: 'bg-cyan-400', ring: 'ring-cyan-400' },
    { id: 'sky-400', name: 'Sky', bg: 'bg-sky-400', ring: 'ring-sky-400' },
    { id: 'blue-400', name: 'Blue', bg: 'bg-blue-400', ring: 'ring-blue-400' },
    { id: 'indigo-400', name: 'Indigo', bg: 'bg-indigo-400', ring: 'ring-indigo-400' },
    { id: 'violet-400', name: 'Violet', bg: 'bg-violet-400', ring: 'ring-violet-400' },
    { id: 'purple-400', name: 'Purple', bg: 'bg-purple-400', ring: 'ring-purple-400' },
    { id: 'fuchsia-400', name: 'Fuchsia', bg: 'bg-fuchsia-400', ring: 'ring-fuchsia-400' },
    { id: 'pink-400', name: 'Pink', bg: 'bg-pink-400', ring: 'ring-pink-400' },
    { id: 'rose-400', name: 'Rose', bg: 'bg-rose-400', ring: 'ring-rose-400' },
    { id: 'red-500', name: 'Red Dark', bg: 'bg-red-500', ring: 'ring-red-500' },
    { id: 'orange-500', name: 'Orange Dark', bg: 'bg-orange-500', ring: 'ring-orange-500' },
    { id: 'green-500', name: 'Green Dark', bg: 'bg-green-500', ring: 'ring-green-500' },
    { id: 'blue-500', name: 'Blue Dark', bg: 'bg-blue-500', ring: 'ring-blue-500' },
    { id: 'indigo-500', name: 'Indigo Dark', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
    { id: 'purple-500', name: 'Purple Dark', bg: 'bg-purple-500', ring: 'ring-purple-500' },
    { id: 'pink-500', name: 'Pink Dark', bg: 'bg-pink-500', ring: 'ring-pink-500' },
    { id: 'slate-600', name: 'Slate Dark', bg: 'bg-slate-600', ring: 'ring-slate-600' },
];

export const quickColors = [...allColors.slice(0, 5)];

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
