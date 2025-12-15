import {  useState, type ChangeEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react'; // Import all icons
import { Modal, useModal, type UseModalReturn } from '@Jade/core-design/modal/ModalBase';
import { IconPickerContent, type IconName } from '@Jade/core-design/modal/IconPicker';
import ColorPicker, { quickColors } from '@Jade/core-design/modal/ColorPicker';

type CategoryStatus = 'active' | 'inactive' | 'archived';

type CategoryFormData = {
    name: string;
    status: CategoryStatus;
    parent: string;
    description: string;
    color: string;
    icon: string;
};

type EditableField = Exclude<keyof CategoryFormData, 'status'>;

const isLucideIcon = (icon: unknown): icon is LucideIcon =>
    typeof icon === 'function' || typeof icon === 'object';

type CreateCategoryDialogProps = {
    mainModal: UseModalReturn;
};

export default function CreateCategoryDialog({ mainModal }: CreateCategoryDialogProps) {
    const colorModal = useModal();
    const iconModal = useModal();

    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        status: 'active', // Replaced slug with status
        parent: '',
        description: '',
        color: 'indigo-400',
        icon: 'LayoutGrid'
    });


    const SelectedIcon: LucideIcon = isLucideIcon(
        LucideIcons[formData.icon as IconName]
    )
        ? (LucideIcons[formData.icon as IconName] as LucideIcon)
        : LucideIcons.LayoutGrid;

    // Handlers
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === 'status') {
            setFormData((prev) => ({ ...prev, status: value as CategoryStatus }));
            return;
        }

        const fieldName = name as EditableField;
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
    };

    const handleColorSelect = (colorId: string) => {
        setFormData(prev => ({ ...prev, color: colorId }));
        // Removed auto-close: setShowColorModal(false);
    };

    const handleIconSelect = (iconName: IconName) => {
        setFormData(prev => ({ ...prev, icon: iconName }));
    };

    // ---------------------------------------------------------------------------
    // UI COMPONENTS
    // ---------------------------------------------------------------------------

    return (
        <Modal
            isOpen={mainModal.isOpen}
            isClosing={mainModal.isClosing}
            onClose={mainModal.close}
            maxWidthClass="max-w-2xl"
        >
            <div className="relative w-full rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 z-50 animate-in fade-in zoom-in-95 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 dark:shadow-black/50">

                <div className="px-8 py-6 border-b flex items-center justify-between border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Category</h2>
                        <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Organize your items with a new classification.</p>
                    </div>
                    <button
                        onClick={mainModal.close}
                        className="p-2 rounded-full transition-colors hover:bg-gray-200 text-slate-500 dark:text-slate-400 dark:hover:bg-slate-800"
                        type="button"
                    >
                        <LucideIcons.X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category Name</label>
                            <div className="flex items-center rounded-xl border px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 bg-gray-50 border-gray-200 dark:bg-slate-950 dark:border-slate-700">
                                <LucideIcons.Type size={18} className="mr-3 text-slate-400 dark:text-slate-500" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Electronics"
                                    className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</label>
                            <div className="relative flex items-center rounded-xl border px-3 py-2.5 transition-all hover:border-indigo-400 bg-gray-50 border-gray-200 dark:bg-slate-950 dark:border-slate-700">
                                <LucideIcons.Activity size={18} className="mr-3 text-slate-400 dark:text-slate-500" />
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="bg-transparent border-none outline-none w-full text-sm font-medium appearance-none cursor-pointer text-slate-900 dark:text-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="archived">Archived</option>
                                </select>
                                <LucideIcons.ChevronDown size={16} className="absolute right-3 pointer-events-none text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent Category</label>
                            <div className="relative flex items-center rounded-xl border px-3 py-2.5 transition-all hover:border-indigo-400 bg-gray-50 border-gray-200 dark:bg-slate-950 dark:border-slate-700">
                                <LucideIcons.LayoutGrid size={18} className="mr-3 text-slate-400 dark:text-slate-500" />
                                <select
                                    name="parent"
                                    value={formData.parent}
                                    onChange={handleChange}
                                    className="bg-transparent border-none outline-none w-full text-sm font-medium appearance-none cursor-pointer text-slate-900 dark:text-white"
                                >
                                    <option value="">No Parent (Root Category)</option>
                                    <option value="1">Products</option>
                                    <option value="2">Services</option>
                                    <option value="3">Digital Assets</option>
                                </select>
                                <LucideIcons.ChevronDown size={16} className="absolute right-3 pointer-events-none text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Briefly describe what belongs in this category..."
                                className="w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 border-gray-200 text-slate-900 placeholder:text-slate-400 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-600"
                            ></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <LucideIcons.Palette size={14} /> Color Tag
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    {quickColors.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => handleColorSelect(c.id)}
                                            className={`w-8 h-8 rounded-full ${c.bg} transition-all duration-200 flex items-center justify-center shadow-sm ${formData.color === c.id
                                                ? `ring-2 ring-offset-2 scale-110 ${c.ring} ring-offset-white dark:ring-offset-slate-900`
                                                : 'hover:scale-110 opacity-80 hover:opacity-100'
                                                }`}
                                            title={c.name}
                                        >
                                            {formData.color === c.id && <LucideIcons.Check size={14} className="text-white" strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={colorModal.open}
                                    className="w-8 h-8 rounded-full border-dashed border-2 flex items-center justify-center transition-all border-gray-300 hover:border-gray-500 text-slate-400 hover:text-slate-600 dark:border-slate-600 dark:hover:border-slate-400 dark:hover:text-white"
                                >
                                    <LucideIcons.Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <LucideIcons.LayoutGrid size={14} /> Category Icon
                            </label>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all bg-white text-indigo-600 border border-indigo-100 dark:bg-slate-800 dark:text-white">
                                    <SelectedIcon size={24} />
                                </div>

                                <button
                                    onClick={iconModal.open}
                                    className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all bg-gray-50 border-gray-200 hover:border-gray-300 text-slate-600 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-500 dark:text-slate-300"
                                >
                                    <span className="text-sm font-medium">{formData.icon}</span>
                                    <span className="text-xs opacity-70 bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded">Change</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="px-8 py-6 border-t flex items-center justify-end gap-3 border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                    <button className="px-5 py-2.5 rounded-xl font-medium text-sm transition-colors text-slate-500 hover:text-slate-800 hover:bg-gray-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800">
                        Cancel
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                        Create Category
                    </button>
                </div>

            </div>

            <Modal
                isOpen={colorModal.isOpen}
                isClosing={colorModal.isClosing}
                onClose={colorModal.close}
                title="Select Color Tag"
                maxWidthClass="max-w-lg"
            >
                <ColorPicker
                    selectedColor={formData.color}
                    onSelect={handleColorSelect}
                    onClose={colorModal.close}
                />
            </Modal>

            <Modal
                isOpen={iconModal.isOpen}
                isClosing={iconModal.isClosing}
                onClose={iconModal.close}
                title="Select Icon"
                maxWidthClass="max-w-3xl"
            >
                <IconPickerContent
                    selectedIcon={formData.icon as IconName}
                    onSelect={handleIconSelect}
                    onClose={iconModal.close}
                />
            </Modal>
        </Modal>
    );
}