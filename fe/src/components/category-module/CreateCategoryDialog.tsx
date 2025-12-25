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
import { useCategoryModuleStore } from '@Jade/components/category-module/store';
import { useTranslation } from 'react-i18next';


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
    layer?: string;
    parentName?: string;
};



type CreateCategoryDialogProps = {
    mainModal: UseModalReturn;
    onCategoryCreatedCallback: () => void;
};

export default function CreateCategoryDialog({ mainModal, onCategoryCreatedCallback }: CreateCategoryDialogProps) {
    const { t } = useTranslation('category');
    const colorModal = useModal(ModalId.COLOR);
    const iconModal = useModal(ModalId.ICON);
    const storeId = useSelector((state: RootState) => state.app.storeId);
    const [SelectedIcon, setSelectedIcon] = useState<LucideIcon>(() => LayoutGrid);
    const { rootCategoryId } = useParams();
    const createCategoryModalData = useCategoryModuleStore((s) => s.categories.createCategoryModalData);
    const resetCreateCategoryModalData = useCategoryModuleStore((s) => s.resetCreateCategoryModalData);
    const categoryCreateParentId = createCategoryModalData.categoryCreateParentId;
    const mode = createCategoryModalData.mode;
    const categoryEditId = createCategoryModalData.categoryEditId;

    const categorySchema: yup.ObjectSchema<CategoryFormValues> = yup.object({
        name: yup.string().required(t('nameRequired')),
        status: yup.mixed<CategoryStatus>().oneOf(['ACTIVE', 'INACTIVE', 'ARCHIVED']).required(t('statusRequired')),
        parentId: yup.string().optional().uuid(t('parentIdUuid')),
        description: yup.string().optional().default(''),
        color: yup.string().optional().default('indigo-400'),
        icon: yup.string().optional().default('layout-grid'),
        layer: yup.string().optional().default('0'),
        parentName: yup.string().optional().default(''),
    });

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
            // Set all form values in one shot (avoids duplicated setValue calls)
            if (mode === "EDIT") {
                reset({
                    name: cat.name ?? '',
                    status: (cat.status as CategoryStatus) ?? 'ACTIVE',
                    parentId: cat.parentId ?? NIL_UUID,
                    description: cat.description ?? '',
                    color: cat.colorSettings ?? 'slate-400',
                    icon: cat.icon ?? 'layout-grid',
                    layer: cat.layer ?? INITIAL_LAYER,
                    parentName: cat.parentName ?? '',
                });
            }
            else if (mode === "CREATE_NEST") {
                reset({
                    parentId: cat.categoryId ?? NIL_UUID,
                    layer: cat.layer ?? INITIAL_LAYER,
                    parentName: cat.name ?? '',
                    color: cat.colorSettings ?? 'slate-400',
                    icon: cat.icon ?? 'layout-grid',
                    status: 'ACTIVE'
                });
            }
        },
        onError: (error) => {
            reset();
            resetCreateCategoryModalData();
            mainModal.close();
            toast.error(t('getFailed') + ': ' + error?.message);
        },
    });

    useEffect(() => {
        if (!mainModal.isOpen) return;
        if (categoryEditId && (mode === "EDIT")) {
            getCategoryById({ categoryId: categoryEditId });
        }
        if (categoryCreateParentId && (mode === "CREATE_NEST")) {
            getCategoryById({ categoryId: categoryCreateParentId });
        }
        // getCategoryById is stable from react-query, safe to depend on
    }, [categoryEditId, getCategoryById, mainModal.isOpen, mode, categoryCreateParentId]);


    const status = useWatch({ control, name: 'status' });
    const parentId = useWatch({ control, name: 'parentId' });
    const color = useWatch({ control, name: 'color' });
    const icon = useWatch({ control, name: 'icon' });
    const parentName = useWatch({ control, name: 'parentName' });

    const { mutate: createCategory, isPending: isLoadingCreateCategory } = useCreateCategory({
        storeId: storeId,
        onSuccess: () => {
            toast.success(t('categoryCreated'));
            onCategoryCreatedCallback();
            reset();
            resetCreateCategoryModalData();
            mainModal.close();
        },
        onError: (error) => {
            toast.error(error?.message || t('createFailed'));
        },
    });

    const { mutate: updateCategory, isPending: isLoadingUpdateCategory } = useUpdateCategory({
        storeId: storeId,
        onSuccess: () => {
            toast.success(t('categoryUpdated'));
            onCategoryCreatedCallback();
            reset();
            resetCreateCategoryModalData();
            mainModal.close();
        },
        onError: (error) => {
            toast.error(error?.message || t('updateFailed'));
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
        let layerRequest = data.layer ? data.layer : INITIAL_LAYER;
        // if parentId is provided, then layer must be get from be first and recheck at be 
        if (rootCategoryId && !layerRequest) {
            toast.error(t('layerRequired'));
            return;
        }
        if (rootCategoryId && data.parentId === NIL_UUID) {
            toast.error(t('parentIdRequired'));
            return;
        }
        if (layerRequest === undefined) {
            toast.error(t('layerRequired'));
            return;
        }
        if (!storeId) {
            toast.error(t('storeIdRequired'));
            return;
        }
        const resolvedParentId =
            mode === "EDIT" || mode === "CREATE_NEST" && data.parentId ? data.parentId : data.parentId;

        if (mode === "CREATE_NEST") {
            layerRequest = (Number(layerRequest) + 1).toString();
        }

        const payload: CreateCategoryRequest = {
            name: data.name,
            status: data.status,
            parentId: resolvedParentId,
            layer: layerRequest,
            description: data.description,
            colorSettings: data.color,
            icon: data.icon,
        };
        if (mode === "CREATE" || mode === "CREATE_NEST") {
            createCategory(payload);
        } else if (mode === "EDIT" && categoryEditId) {
            updateCategory({
                categoryId: categoryEditId,
                categoryUpdate: payload,
            });
        }
    };

    const buildParentCategoryOptions = useMemo(() => {
        const options: { value: string; label: string }[] = [{
            value: NIL_UUID,
            label: t('noParentRoot'),
        }];
        if (parentId && parentId !== NIL_UUID) {
            options.push({
                value: parentId,
                label: parentName ?? parentId,
            });
        }
        return options;
    }, [parentId, parentName, t]);

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
                title={mode === "CREATE" ? t('createNewCategory') : t('editCategory')}
                subtitle={t('dialogSubtitle')}
                blurEffect={true}
                className={"mb-0"}
                onConfirm={() => handleSubmit(onSubmit)()}
                confirmButtonText={mode === "CREATE" || mode === "CREATE_NEST" ? t('create') : t('update')}
                isLoading={mode === "CREATE" || mode === "CREATE_NEST" ? isLoadingCreateCategory : isLoadingUpdateCategory}
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
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('categoryName')}</label>
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
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('status')}</label>
                                <Select
                                    name="status"
                                    value={status}
                                    register={register}
                                    registerOptions={{ required: true }}
                                    error={errors.status?.message}
                                    options={[
                                        { value: 'ACTIVE', label: t('active') },
                                        { value: 'INACTIVE', label: t('inactive') },
                                        { value: 'ARCHIVED', label: t('archived') },
                                    ]}
                                    icon={Activity}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative flex flex-col transition-all gap-1 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('parentCategory')}</label>
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
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('description')}</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    placeholder={t('descriptionPlaceholder')}
                                    className="w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 border-gray-200 text-slate-900 placeholder:text-slate-400 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-600"
                                ></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <Palette size={14} /> {t('colorTag')}
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
                                    <LayoutGrid size={14} /> {t('categoryIcon')}
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
                                        <span className="text-xs opacity-70 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400 px-2 py-0.5 rounded">{t('more')}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={iconModal.open}
                                        className="flex items-center justify-between gap-1 px-4 py-2.5 rounded-xl border transition-all bg-gray-50 border-gray-200 hover:border-gray-300 text-slate-600 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-500 dark:text-slate-300"
                                    >
                                        <Upload size={16} className="text-green-500 dark:text-green-300" />
                                        <span className="text-xs opacity-70 bg-green-500/10 text-green-500 dark:bg-green-300/20 dark:text-green-300 px-2 py-0.5 rounded">{t('upload')}</span>
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
                title={t('selectColorTag')}
                layer={colorModal.layer}
                blurEffect={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmButtonText={t('done')}
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
                title={t('selectIcon')}
                layer={iconModal.layer}
                blurEffect={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmButtonText={t('done')}
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