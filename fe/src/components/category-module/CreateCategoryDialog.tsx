import CategorySkeleton from '@Jade/components/category-module/CreateCategoryLoading';
import { INITIAL_LAYER } from '@Jade/config';
import InputCommon from '@Jade/core-design/input/CommonInput';
import Select from '@Jade/core-design/input/Select';
import ColorPicker from '@Jade/core-design/modal/ColorPicker';
import type { IconName } from '@Jade/core-design/modal/IconPicker';
import { allColors, quickColors } from '@Jade/core-design/modal/colorOptions';
import { ModalId, useModal, type UseModalReturn } from '@Jade/core-design/modal/useModal';
import { useCreateCategory, useGetCategoryById, useUpdateCategory } from '@Jade/services/category/useQuery';
import type { RootState } from '@Jade/store/global.store';
import type { CreateCategoryRequest } from '@Jade/types/category';
import { yupResolver } from "@hookform/resolvers/yup";
import { Activity, Check, LayoutGrid, Palette, Plus, Upload, type LucideIcon } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NIL as NIL_UUID } from 'uuid';
import * as yup from "yup";
import { useCategoryModuleStore } from './store';


const Modal = lazy(() => import('@Jade/core-design/modal/ModalBase'));
const IconPickerContent = lazy(() => import('@Jade/core-design/modal/IconPicker'));

type CategoryStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

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
    status: yup.mixed<CategoryStatus>().oneOf(['ACTIVE', 'INACTIVE', 'ARCHIVED']).required('Status is required'),
    parentId: yup.string().optional().uuid("parentId must be a valid UUID"),
    description: yup.string().optional().default(''),
    color: yup.string().optional().default('indigo-400'),
    icon: yup.string().optional().default('layout-grid'),
});

type CreateCategoryDialogProps = {
    mainModal: UseModalReturn;
    onCategoryCreatedCallback: () => void;
};

export default function CreateCategoryDialog({ mainModal, onCategoryCreatedCallback }: CreateCategoryDialogProps) {
    const colorModal = useModal(ModalId.COLOR);
    const iconModal = useModal(ModalId.ICON);
    const storeId = useSelector((state: RootState) => state.app.storeId);
    const [SelectedIcon, setSelectedIcon] = useState<LucideIcon>(() => LayoutGrid);
    const { rootCategoryId } = useParams();
    const createCategoryModalData = useCategoryModuleStore((s) => s.categories.createCategoryModalData);
    const resetCreateCategoryModalData = useCategoryModuleStore((s) => s.resetCreateCategoryModalData);
    const mode = createCategoryModalData.mode;
    const categoryEditId = createCategoryModalData.categoryEditId;
    const categoryCreateParentId = createCategoryModalData.categoryCreateParentId;
    const categoryCreateLayer = createCategoryModalData.categoryCreateLayer;
    const categoryCreateName = createCategoryModalData.categoryCreateName;

    const { handleSubmit, register, control, setValue, formState: { errors }, reset } = useForm<CategoryFormValues>({
        resolver: yupResolver(categorySchema),
        defaultValues: {
            name: '',
            status: 'ACTIVE',
            parentId: NIL_UUID,
            description: '',
            color: 'slate-400',
            icon: 'layout-grid',
        },
    });

    const { mutate: getCategoryById, isPending: isLoadingGetCategoryById } = useGetCategoryById({
        storeId: storeId || '',
        onSuccess: (data) => {
            const cat = data?.data;
            if (!cat) return;
            setValue('name', cat.name ?? '');
            setValue('status', (cat.status as CategoryStatus) ?? 'ACTIVE');
            setValue('parentId', cat.parentId ?? NIL_UUID);
            setValue('description', cat.description ?? '');
            setValue('color', cat.colorSettings ?? 'slate-400');
            setValue('icon', cat.icon ?? 'layout-grid');
        },
        onError: (error) => {
            reset();
            resetCreateCategoryModalData();
            mainModal.close();
            toast.error('Failed to get category:' + error?.message);
        },
    });

    useEffect(() => {
        if (!mainModal.isOpen) return;
        if (categoryEditId && mode === "edit") {
            getCategoryById({ categoryId: categoryEditId });
        }
        // getCategoryById is stable from react-query, safe to depend on
    }, [categoryEditId, getCategoryById, mainModal.isOpen, mode]);

    useEffect(() => {
        if (!mainModal.isOpen) return;
        if (mode !== "create") return;
        if (categoryCreateParentId) {
            setValue('parentId', categoryCreateParentId, { shouldValidate: true });
        }
    }, [categoryCreateName, categoryCreateParentId, mainModal.isOpen, mode, setValue]);

    const status = useWatch({ control, name: 'status' });
    const parentId = useWatch({ control, name: 'parentId' });
    const color = useWatch({ control, name: 'color' });
    const icon = useWatch({ control, name: 'icon' });

    const { mutate: createCategory, isPending: isLoadingCreateCategory } = useCreateCategory({
        storeId: storeId,
        onSuccess: () => {
            toast.success('Category created successfully');
            onCategoryCreatedCallback();
            reset();
            resetCreateCategoryModalData();
            mainModal.close();
        },
        onError: (error) => {
            toast.error(error?.message || 'Failed to create category');
        },
    });

    const { mutate: updateCategory, isPending: isLoadingUpdateCategory } = useUpdateCategory({
        storeId: storeId,
        onSuccess: () => {
            toast.success('Category updated successfully');
            onCategoryCreatedCallback();
            reset();
            resetCreateCategoryModalData();
            mainModal.close();
        },
        onError: (error) => {
            toast.error(error?.message || 'Failed to update category');
        },
    });


    useEffect(() => {
        let isMounted = true;

        const loader = dynamicIconImports[icon as IconName] ?? dynamicIconImports['layout-grid'];

        loader()
            .then((mod) => {
                if (isMounted && mod?.default) {
                    setSelectedIcon(() => mod.default);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setSelectedIcon(() => LayoutGrid);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [icon]);

    const handleColorSelect = (colorId: string) => {
        setValue('color', colorId, { shouldValidate: true });
    };

    const handleIconSelect = (iconName: IconName) => {
        setValue('icon', iconName, { shouldValidate: true });
    };


    const quickColorsList = useMemo(() => {
        const isSelectedColorExistsInQuickColors = quickColors.some(c => c.id === color);
        if (isSelectedColorExistsInQuickColors) return quickColors;

        const appendColor = allColors.find(c => c.id === color);
        if (!appendColor) return quickColors;

        return [...quickColors, appendColor];
    }, [color]);


    const onSubmit = (data: CategoryFormValues) => {
        const layerRequest = categoryCreateLayer ? categoryCreateLayer : INITIAL_LAYER;
        // if parentId is provided, then layer must be get from be first and recheck at be 
        if (rootCategoryId && !layerRequest) {
            toast.error('Layer is required');
            return;
        }
        if (rootCategoryId && data.parentId === NIL_UUID) {
            toast.error('Parent ID is required');
            return;
        }
        if (layerRequest === undefined) {
            toast.error('Layer is required');
            return;
        }
        if (!storeId) {
            toast.error('Store ID is required');
            return;
        }
        const resolvedParentId =
            mode === "create" && categoryCreateParentId ? categoryCreateParentId : data.parentId;

        const payload: CreateCategoryRequest = {
            name: data.name,
            status: data.status,
            parentId: resolvedParentId,
            layer: layerRequest,
            description: data.description,
            colorSettings: data.color,
            icon: data.icon,
        };
        if (mode === "create") {
            createCategory(payload);
        } else if (mode === "edit" && categoryEditId) {
            updateCategory({
                categoryId: categoryEditId,
                categoryUpdate: payload,
            });
        }

    };

    const buildParentCategoryOptions = useMemo(() => {
        const options: { value: string; label: string }[] = [{
            value: NIL_UUID,
            label: 'No Parent (Root Category)',
        }];
        if (categoryCreateParentId && categoryCreateParentId !== NIL_UUID) {
            options.push({
                value: categoryCreateParentId,
                label: categoryCreateName?.trim()?.length ? categoryCreateName : categoryCreateParentId,
            });
        }
        return options;
    }, [categoryCreateName, categoryCreateParentId]);

    return (
        <>
            <Modal
                modalId={mainModal.modalId}
                isOpen={mainModal.isOpen}
                isClosing={mainModal.isClosing}
                onClose={() => {
                    reset();
                    resetCreateCategoryModalData();
                    mainModal.close();
                }}
                layer={mainModal.layer}
                maxWidthClass="max-w-2xl"
                title={mode === "create" ? "Create New Category" : "Edit Category"}
                subtitle="Organize your items with a new classification."
                blurEffect={true}
                className={"mb-0"}
                onConfirm={() => handleSubmit(onSubmit)()}
                confirmButtonText={mode === "create" ? "Create" : "Update"}
                isLoading={mode === "create" ? isLoadingCreateCategory : isLoadingUpdateCategory}
                isLoadingComponent={isLoadingGetCategoryById}
                loadingComponent={<CategorySkeleton />}
            >
                <div className="relative w-full overflow-hidden transition-all duration-300 z-50 animate-in fade-in zoom-in-95 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 dark:shadow-black/50">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-8 space-y-6"
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category Name</label>
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
                                        { value: 'ACTIVE', label: 'Active' },
                                        { value: 'INACTIVE', label: 'Inactive' },
                                        { value: 'ARCHIVED', label: 'Archived' },
                                    ]}
                                    icon={Activity}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative flex flex-col transition-all gap-1 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent Category</label>
                                <Select
                                    name="parentId"
                                    value={parentId}
                                    register={register}
                                    disabled={true}
                                    options={[
                                        ...buildParentCategoryOptions,
                                    ]}
                                    icon={LayoutGrid}
                                />
                            </div>
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
                                    <Palette size={14} /> Color Tag
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2 duration-200 transition-all">
                                        {quickColorsList.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => handleColorSelect(c.id)}
                                                className={`w-8 h-8 rounded-full ${c.bg} transition-all duration-200 flex items-center justify-center shadow-sm ${color === c.id
                                                    ? `ring-2 ring-offset-2 scale-110 ${c.ring} ring-offset-white dark:ring-offset-slate-900`
                                                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                                                    }`}
                                                title={c.name}
                                            >
                                                {color === c.id && <Check size={14} className="text-white" strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={colorModal.open}
                                        className="w-8 h-8 rounded-full border-dashed border-2 flex items-center justify-center transition-all border-gray-300 hover:border-gray-500 text-slate-400 hover:text-slate-600 dark:border-slate-600 dark:hover:border-slate-400 dark:hover:text-white"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <LayoutGrid size={14} /> Category Icon
                                </label>

                                <div className="flex items-end gap-4">
                                    <div className="size-[42px] rounded-xl flex items-center justify-center shadow-lg transition-all bg-white text-indigo-600 border border-indigo-100 dark:bg-slate-800 dark:text-white">
                                        <SelectedIcon size={24} />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={iconModal.open}
                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all bg-gray-50 border-gray-200 hover:border-gray-300 text-slate-600 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-500 dark:text-slate-300"
                                    >
                                        <span className="text-xs opacity-70 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400 px-2 py-0.5 rounded">More</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={iconModal.open}
                                        className="flex items-center justify-between gap-1 px-4 py-2.5 rounded-xl border transition-all bg-gray-50 border-gray-200 hover:border-gray-300 text-slate-600 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-500 dark:text-slate-300"
                                    >
                                        <Upload size={16} className="text-green-500 dark:text-green-300" />
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