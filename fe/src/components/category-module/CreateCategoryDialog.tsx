import { lazy } from 'react';
import InputCommon from '@Jade/core-design/input/CommonInput';
import Select from '@Jade/core-design/input/Select';
import { allColors, quickColors } from '@Jade/core-design/modal/ColorPicker';
import type { IconName } from '@Jade/core-design/modal/IconPicker';
import { Modal, ModalId, useModal, type UseModalReturn } from '@Jade/core-design/modal/ModalBase';
import { yupResolver } from "@hookform/resolvers/yup";
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { useParams } from 'react-router-dom';
// Lazy import ColorPicker and IconPicker
const ColorPicker = lazy(() => import('@Jade/core-design/modal/ColorPicker'));
const IconPickerContent = lazy(() => import('@Jade/core-design/modal/IconPicker'));

type CategoryStatus = 'active' | 'inactive' | 'archived';

type CategoryFormValues = {
    name: string;
    status: CategoryStatus;
    parentId?: string;
    description: string;
    color: string;
    icon: string;
};

const categorySchema: yup.ObjectSchema<CategoryFormValues> = yup.object({
    name: yup.string().required('Name is required'),
    status: yup.mixed<CategoryStatus>().oneOf(['active', 'inactive', 'archived']).required('Status is required'),
    parentId: yup.string().uuid("parentId must be a valid UUID").optional().default(''),
    description: yup.string().optional().default(''),
    color: yup.string().optional().default('indigo-400'),
    icon: yup.string().optional().default('LayoutGrid'),
});

const isLucideIcon = (icon: unknown): icon is LucideIcon =>
    typeof icon === 'function' || typeof icon === 'object';

type CreateCategoryDialogProps = {
    mainModal: UseModalReturn;
};

export default function CreateCategoryDialog({ mainModal }: CreateCategoryDialogProps) {
    const colorModal = useModal(ModalId.COLOR);
    const iconModal = useModal(ModalId.ICON);
    const { id } = useParams();
    const {handleSubmit ,register, watch, setValue, formState: { errors } } = useForm<CategoryFormValues>({
        resolver: yupResolver(categorySchema),
        defaultValues: {
            name: '',
            status: 'active',
            parentId: '',
            description: '',
            color: 'indigo-400',
            icon: 'LayoutGrid',
        },
    });

    const status = watch('status');
    const parentId = watch('parentId');
    const color = watch('color');
    const icon = watch('icon');

    const SelectedIcon: LucideIcon = isLucideIcon(
        LucideIcons[icon as IconName]
    )
        ? (LucideIcons[icon as IconName] as LucideIcon)
        : LucideIcons.LayoutGrid;

    const handleColorSelect = (colorId: string) => {
        setValue('color', colorId, { shouldValidate: true });
    };

    const handleIconSelect = (iconName: IconName) => {
        setValue('icon', iconName, { shouldValidate: true });
    };


    const isSelectedColorExistsInQuickColors = quickColors.some(c => c.id === color);
    const quickColorsList = () => {
        if (!isSelectedColorExistsInQuickColors) {
            const quickColorsClone = [...quickColors];
            const appendColor = allColors.find(c => c.id === color);
            if (appendColor) {
                quickColorsClone.push(appendColor);
            }
            return quickColorsClone;
        }
        return quickColors;
    }

    const onSubmit = (data: CategoryFormValues) => {
        console.log(data);
    };

    return (
        <>
            <Modal
                modalId={mainModal.modalId}
                isOpen={mainModal.isOpen}
                isClosing={mainModal.isClosing}
                onClose={mainModal.close}
                layer={mainModal.layer}
                maxWidthClass="max-w-2xl"
                title="Create New Category"
                subtitle="Organize your items with a new classification."
                blurEffect={true}
                className={"mb-0"}
                onConfirm={handleSubmit(onSubmit)}
            >
                <div className="relative w-full overflow-hidden transition-all duration-300 z-50 animate-in fade-in zoom-in-95 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 dark:shadow-black/50">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent Category</label>
                                <InputCommon
                                    type="text"
                                    name="name"
                                    register={register}
                                    registerOptions={{ required: true }}
                                    error={errors.name?.message}
                                    className='h-[46px]!'
                                    floatingLabel={false}
                                />
                            </div>

                            <div className="space-y-2 flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</label>
                                <Select
                                    name="status"
                                    value={status}
                                    register={register}
                                    registerOptions={{ required: true }}
                                    error={errors.status?.message}
                                    options={[
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' },
                                        { value: 'archived', label: 'Archived' },
                                    ]}
                                    icon={LucideIcons.Activity}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {!Boolean(id) && (
                            <div className="relative flex flex-col transition-all gap-1 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent Category</label>
                                <Select
                                    name="parentId"
                                    value={parentId}
                                    register={register}
                                    options={[
                                        { value: '', label: 'No Parent (Root Category)' },
                                        { value: '1', label: 'Products' },
                                        { value: '2', label: 'Services' },
                                        { value: '3', label: 'Digital Assets' },
                                    ]}
                                    icon={LucideIcons.LayoutGrid}
                                />
                            </div>
                            )}
                            <div className="space-y-2 flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
                                <textarea
                                    {...register('description')}
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
                                    <div className="flex gap-2 duration-200 transition-all">
                                        {quickColorsList().map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => handleColorSelect(c.id)}
                                                className={`w-8 h-8 rounded-full ${c.bg} transition-all duration-200 flex items-center justify-center shadow-sm ${color === c.id
                                                    ? `ring-2 ring-offset-2 scale-110 ${c.ring} ring-offset-white dark:ring-offset-slate-900`
                                                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                                                    }`}
                                                title={c.name}
                                            >
                                                {color === c.id && <LucideIcons.Check size={14} className="text-white" strokeWidth={3} />}
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

                                <div className="flex items-end gap-4">
                                    <div className="size-[42px] rounded-xl flex items-center justify-center shadow-lg transition-all bg-white text-indigo-600 border border-indigo-100 dark:bg-slate-800 dark:text-white">
                                        <SelectedIcon size={24} />
                                    </div>

                                    <button
                                        onClick={iconModal.open}
                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all bg-gray-50 border-gray-200 hover:border-gray-300 text-slate-600 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-500 dark:text-slate-300"
                                    >
                                        <span className="text-xs opacity-70 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400 px-2 py-0.5 rounded">More</span>
                                    </button>
                                    <button
                                        onClick={iconModal.open}
                                        className="flex items-center justify-between gap-1 px-4 py-2.5 rounded-xl border transition-all bg-gray-50 border-gray-200 hover:border-gray-300 text-slate-600 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-500 dark:text-slate-300"
                                    >
                                        <LucideIcons.Upload size={16} className="text-green-500 dark:text-green-300" />
                                        <span className="text-xs opacity-70 bg-green-500/10 text-green-500 dark:bg-green-300/20 dark:text-green-300 px-2 py-0.5 rounded">Upload</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </Modal>
            <Modal
                modalId={colorModal.modalId}
                isOpen={colorModal.isOpen}
                isClosing={colorModal.isClosing}
                onClose={colorModal.close}
                title="Select Color Tag"
                layer={colorModal.layer}
                blurEffect={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmButtonText="Done"
                onConfirm={colorModal.close}
            >
                <ColorPicker
                    selectedColor={color}
                    onSelect={handleColorSelect}
                    onClose={colorModal.close}
                />
            </Modal>

            <Modal
                modalId={iconModal.modalId}
                isOpen={iconModal.isOpen}
                isClosing={iconModal.isClosing}
                onClose={iconModal.close}
                title="Select Icon"
                layer={iconModal.layer}
                blurEffect={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmButtonText="Done"
                maxWidthClass="max-w-2xl"
                onConfirm={iconModal.close}
            >
                <IconPickerContent
                    selectedIcon={icon as IconName}
                    onSelect={handleIconSelect}
                    onClose={iconModal.close}
                />
            </Modal>
        </>
    );
}