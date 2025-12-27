import { lazy, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Warehouse, LayoutGrid, Palette, Plus, MapPin, type LucideIcon } from "lucide-react"; // Added Plus
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import * as yup from "yup";

// Ensure these paths are correct in your project
import InputCommon from "@Jade/core-design/input/CommonInput";
import ColorPicker from "@Jade/core-design/modal/ColorPicker";
import type { IconName } from "@Jade/core-design/modal/IconPicker";
import { allColors, quickColors } from "@Jade/core-design/modal/colorOptions";
import { ModalId, type UseModalReturn, useModal } from "@Jade/core-design/modal/useModal";
import type { RootState } from "@Jade/store/global.store";
import { useCreateStorage, useUpdateStorage } from "@Jade/services/storage/useQuery";
import { useStorageModuleStore } from "@Jade/components/storage-module/store";

const Modal = lazy(() => import("@Jade/core-design/modal/ModalBase"));
const IconPickerContent = lazy(() => import("@Jade/core-design/modal/IconPicker"));

export type CreateStorageFormValues = {
  name: string;
  address?: string;
  color: string;
  icon: string;
  isActive: boolean;
};

export type CreateStorageDialogProps = {
  mainModal: UseModalReturn;
  onStorageCreatedCallback?: (created: {
    id: string;
    name: string;
    address?: string;
    color: string;
    icon: string;
    isActive: boolean;
  }) => void;
  onStorageUpdatedCallback?: () => void;
};


export default function CreateStorageDialog({ mainModal, onStorageCreatedCallback, onStorageUpdatedCallback }: CreateStorageDialogProps) {
  const { t } = useTranslation("storage");
  const storeId = useSelector((state: RootState) => state.app.storeId);
  const editingStorage = useStorageModuleStore((s) => s.editingStorage);
  const setEditingStorage = useStorageModuleStore((s) => s.setEditingStorage);
  const isEditMode = Boolean(editingStorage?.id);

  const colorModal = useModal(ModalId.COLOR);
  const iconModal = useModal(ModalId.ICON);

  const [SelectedIcon, setSelectedIcon] = useState<LucideIcon>(() => LayoutGrid);

  const schema: yup.ObjectSchema<CreateStorageFormValues> = yup.object({
    name: yup.string().required(t("nameRequired", "Storage name is required")),
    address: yup.string().optional().default(""),
    color: yup.string().optional().default("slate-400"),
    icon: yup.string().optional().default("layout-grid"),
    isActive: yup.boolean().optional().default(true),
  });

  const { handleSubmit, register, control, setValue, formState: { errors }, reset } = useForm<CreateStorageFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      color: "slate-400",
      icon: "layout-grid",
      isActive: true,
    },
  });

  const color = useWatch({ control, name: "color" });
  const icon = useWatch({ control, name: "icon" });
  // const  = useWatch({ control, name: "isActive" }); // Unused in render currently, but available


  useEffect(() => {
    let isMounted = true;
    const loader = dynamicIconImports[icon as IconName] ?? dynamicIconImports["layout-grid"];
    loader()
      .then((mod) => {
        if (isMounted && mod?.default) setSelectedIcon(() => mod.default);
      })
      .catch(() => {
        if (isMounted) setSelectedIcon(() => LayoutGrid);
      });
    return () => {
      isMounted = false;
    };
  }, [icon]);

  const quickColorsList = useMemo(() => {
    const exists = quickColors.some((c) => c.id === color);
    if (exists) return quickColors;
    const append = allColors.find((c) => c.id === color);
    if (!append) return quickColors;
    return [...quickColors, append];
  }, [color]);

  const { mutate: createStorage, isPending: isCreating } = useCreateStorage({
    storeId: storeId,
    onSuccess: (data) => {
      const id = data?.data?.storageId;
      toast.success(t("storageCreated", "Storage created"));
      if (id) {
        const values = control._formValues as CreateStorageFormValues;
        onStorageCreatedCallback?.({
          id,
          name: values.name,
          address: values.address,
          color: values.color,
          icon: values.icon,
          isActive: values.isActive,
        });
      }
      reset();
      mainModal.close();
    },
    onError: (error) => {
      toast.error(error.message || t("createFailed", "Failed to create storage"));
    },
  });

  const { mutate: updateStorage, isPending: isUpdating } = useUpdateStorage({
    storeId: storeId,
    onSuccess: () => {
      toast.success(t("storageUpdated", "Storage updated"));
      onStorageUpdatedCallback?.();
      reset();
      setEditingStorage(null);
      mainModal.close();
    },
    onError: (error) => {
      toast.error(error.message || t("updateFailed", "Failed to update storage"));
    },
  });

  useEffect(() => {
    if (!mainModal.isOpen) return;

    if (editingStorage) {
      reset({
        name: editingStorage.name ?? "",
        address: editingStorage.address ?? "",
        color: editingStorage.color ?? "slate-400",
        icon: editingStorage.icon ?? "layout-grid",
        isActive: Boolean(editingStorage.active),
      });
      return;
    }

    reset({
      name: "",
      address: "",
      color: "slate-400",
      icon: "layout-grid",
      isActive: true,
    });
  }, [editingStorage, mainModal.isOpen, reset]);

  const handleColorSelect = (colorId: string) => setValue("color", colorId, { shouldValidate: true });
  const handleIconSelect = (iconName: IconName) => setValue("icon", iconName, { shouldValidate: true });

  const onSubmit = (values: CreateStorageFormValues) => {
    if (!storeId) {
      toast.error(t("storeIdRequired", "storeId is required"));
      return;
    }
    const address = values.address?.trim();
    const payload = {
      name: values.name,
      address: address ? address : undefined,
      active: values.isActive,
      color: values.color,
      icon: values.icon,
    };

    if (isEditMode && editingStorage?.id) {
      updateStorage({
        storageId: editingStorage.id,
        ...payload,
      });
      return;
    }

    createStorage({
      storeId,
      ...payload,
    });
  };

  return (
    <>
      <Modal
        modalId={mainModal.modalId}
        isOpen={mainModal.isOpen}
        isClosing={mainModal.isClosing}
        onClose={() => {
          reset();
          setEditingStorage(null);
          mainModal.close();
        }}
        layer={mainModal.layer}
        maxWidthClass="max-w-2xl"
        title={isEditMode ? t("editStorage", "Edit Storage") : t('createNewStorage', 'Create New Storage')}
        subtitle={t('dialogSubtitle', 'Enter storage details')}
        blurEffect={true}
        className={"mb-0"}
        onConfirm={() => handleSubmit(onSubmit)()}
        confirmButtonText={isEditMode ? t("update", "Update") : t('create', 'Create')}
        isLoading={isEditMode ? isUpdating : isCreating}
      >
        <div className="relative w-full overflow-hidden transition-all duration-300 z-50 animate-in fade-in zoom-in-95 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 dark:shadow-black/50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 space-y-6"
          >
            {/* Name and IsActive Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('storageName', 'Storage Name')}</label>
                <InputCommon
                  type="text"
                  name="name"
                  placeholder="Storage Name"
                  register={register}
                  registerOptions={{ required: true }}
                  error={errors.name?.message}
                  className='h-[46px]! placeholder:text-sm placeholder:font-normal'
                  floatingLabel={false}
                  icon={<Warehouse size={16} />}
                />
              </div>

              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('status', 'Status')}</label>
                <div className="h-[46px] flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{t('active', 'Active')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Address Row */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('address', 'Address / Location')}</label>
              <InputCommon
                type="text"
                name="address"
                register={register}
                registerOptions={{ required: true }}
                error={errors.address?.message}
                className='h-[46px]! placeholder:text-sm placeholder:font-normal'
                floatingLabel={false}
                icon={<MapPin size={16} />}
                placeholder={t('addressPlaceholder', 'e.g. Warehouse A, Shelf 3')}
              />
            </div>

            {/* Color and Icon Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Palette size={14} /> {t('colorTag', 'Color Tag')}
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
                  <LayoutGrid size={14} /> {t('storageIcon', 'Storage Icon')}
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
                    <span className="text-xs opacity-70 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400 px-2 py-0.5 rounded">{t('select', 'Select')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Allow "Enter" key to submit the form even though the modal footer button is outside this <form>. */}
            <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
          </form>
        </div>

      </Modal>

      {/* Color Modal */}
      <Modal
        modalId={colorModal.modalId}
        isOpen={colorModal.isOpen}
        isClosing={colorModal.isClosing}
        onClose={colorModal.close}
        title={t('selectColorTag', 'Select Color')}
        layer={colorModal.layer}
        blurEffect={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmButtonText={t('done', 'Done')}
        onConfirm={colorModal.close}
      >
        <ColorPicker
          selectedColor={color}
          onSelect={handleColorSelect}
          onClose={colorModal.close}
        />
      </Modal>

      {/* Icon Modal */}
      <Modal
        modalId={iconModal.modalId}
        isOpen={iconModal.isOpen}
        isClosing={iconModal.isClosing}
        onClose={iconModal.close}
        title={t('selectIcon', 'Select Icon')}
        layer={iconModal.layer}
        blurEffect={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmButtonText={t('done', 'Done')}
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