/* eslint-disable react-hooks/static-components */
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import {
  Edit2Icon,
  EyeIcon,
  Info,
  LayoutGrid,
  List,
  MapPin,
  Warehouse,
  Plus,
  Trash2Icon,
  Coins,
  Package,
} from "lucide-react";
import CommonButton from "@Jade/core-design/input/CommonButton";
import { ModalId, useModal } from "@Jade/core-design/modal/useModal";
import { ConfirmModal } from "@Jade/core-design/modal/ConfirmModal";
import ActionMenu, { type ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";
import { getLucideIconComponent } from "@Jade/core-design/utils/iconHelpers";
import { allColors } from "@Jade/core-design/modal/colorOptions";
import { useStorageModuleStore } from "@Jade/components/storage-module/store";
import CreateStorageDialog from "@Jade/components/storage-module/CreateStorageDialog";
import { useGetStorageByStoreIdOverview, useRemoveStorage } from "@Jade/services/storage/useQuery";
import { type StorageResponseOverview } from "@Jade/types/storage.d";
import { useSelector } from "react-redux";
import type { RootState } from "@Jade/store/global.store";
import toast from "react-hot-toast";


const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

const StorageCard = ({
  storage,
  isMenuOpen,
  onMenuToggle,
  menuActions,
}: {
  storage: StorageResponseOverview;
  isMenuOpen: boolean;
  onMenuToggle: (open: boolean) => void;
  menuActions: ActionMenuItem[];
}) => {
  const IconComponent = useMemo(() => getLucideIconComponent(storage.icon), [storage.icon]);
  const colorMeta = useMemo(() => {
    const id = storage.color ?? "slate-400";
    return allColors.find((c) => c.id === id) ?? allColors.find((c) => c.id === "slate-400");
  }, [storage.color]);
  const bgClass = colorMeta?.bg ?? "bg-slate-400";
  const ringClass = colorMeta?.ring ?? "ring-slate-400";


  return (
    <div
      className={`relative bg-white dark:bg-slate-900 rounded-xl border transition-all group ${isMenuOpen
        ? "border-indigo-300 dark:border-indigo-500 shadow-md"
        : "border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md"
        }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${bgClass} ${ringClass}`}
          >
            {IconComponent
              ? <IconComponent size={24} className="text-white" />
              : <Warehouse size={24} className="text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {storage.name}
              </h3>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 animate-pulse ${storage.active
                ? "bg-emerald-500"
                : "bg-red-400 dark:bg-red-600"
                }`}></span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${storage.isPrimary
                ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900/30"
                : "bg-gray-100 text-gray-600 border-transparent dark:bg-gray-800 dark:text-gray-300"
                }`}>
                {storage.isPrimary ? "Primary" : "Secondary"}
              </span>
            </div>
          </div>

          {/* Menu Button */}
          {menuActions.length > 0 && (
            <ActionMenu
              actions={menuActions}
              isOpen={isMenuOpen}
              onToggle={() => onMenuToggle(!isMenuOpen)}
              targetId={storage.id}
              portal
            />
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 p-2 rounded-lg">
          <MapPin size={16} className="mt-0.5 shrink-0 text-indigo-500" />
          <span className="line-clamp-2 leading-tight">{storage.address ?? "No Address"}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4">

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Package size={12} />
              Items Stored
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {storage.itemCount}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Coins size={12} />
              Total Value
            </p>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(storage.totalValue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


const StorageListItem = ({
  storage,
  isMenuOpen,
  onMenuToggle,
  menuActions,
}: {
  storage: StorageResponseOverview;
  isMenuOpen: boolean;
  onMenuToggle: (open: boolean) => void;
  menuActions: ActionMenuItem[];
}) => {
  const IconComponent = useMemo(() => getLucideIconComponent(storage.icon), [storage.icon]);
  const colorMeta = useMemo(() => {
    const id = storage.color ?? "slate-400";
    return allColors.find((c) => c.id === id) ?? allColors.find((c) => c.id === "slate-400");
  }, [storage.color]);
  const bgClass = colorMeta?.bg ?? "bg-slate-400";
  const ringClass = colorMeta?.ring ?? "ring-slate-400";

  return (
    <div
      className={`relative bg-white dark:bg-slate-900 rounded-lg border p-3 flex items-center gap-4 transition-all ${isMenuOpen
        ? "border-indigo-300 dark:border-indigo-500 shadow-md"
        : "border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500"
        }`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${bgClass} ${ringClass}`}
      >
        {IconComponent
          ? <IconComponent size={20} className="text-white" />
          : <Warehouse size={20} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

        <div className="md:col-span-7 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate text-sm min-w-0">
              {storage.name}
            </h3>
            <span
              className={`inline-flex shrink-0 rounded-full h-2.5 w-2.5 animate-pulse ${storage.active
                ? "bg-emerald-500"
                : "bg-red-400 dark:bg-red-600"
                }`}
              title={storage.active ? "Active" : "Inactive"}
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {storage.isPrimary ? "Primary" : "Secondary"}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${storage.active
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
            >
              {storage.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>


        <div className="md:col-span-2 text-right md:text-left">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Items</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{storage.itemCount}</p>
        </div>

        <div className="md:col-span-2 text-right md:text-left">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total Value</p>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(storage.totalValue)}</p>
        </div>

        <div className="md:col-span-1 flex justify-end">
          {menuActions.length > 0 && (
            <ActionMenu
              actions={menuActions}
              isOpen={isMenuOpen}
              onToggle={() => onMenuToggle(!isMenuOpen)}
              targetId={storage.id}
              portal={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};


const MainStorage = () => {
  const { t } = useTranslation("storage");

  // Store state
  const viewMode = useStorageModuleStore((s) => s.viewMode);
  const activeMenuId = useStorageModuleStore((s) => s.activeMenuId);
  const setViewMode = useStorageModuleStore((s) => s.setViewMode);
  const setActiveMenuId = useStorageModuleStore((s) => s.setActiveMenuId);
  const setEditingStorage = useStorageModuleStore((s) => s.setEditingStorage);
  const storageToDelete = useStorageModuleStore((s) => s.storageToDelete);
  const setStorageToDelete = useStorageModuleStore((s) => s.setStorageToDelete);

  // Modals
  const confirmModal = useModal(ModalId.CONFIRM);
  const createModal = useModal(ModalId.CREATE_STORAGE);


  const storeInfo = useSelector((state: RootState) => state.app);
  const {
    data: storageOverview,
    isLoading: isLoadingStorages,
    refetch: refetchStorages,
  } = useGetStorageByStoreIdOverview(
    { storeId: storeInfo?.storeId || "" },
    storeInfo?.storeId,
    { enabled: Boolean(storeInfo?.storeId) },
  );

  const storageUnits: StorageResponseOverview[] = storageOverview?.data?.storages ?? [];


  const handleCreate = () => {
    setEditingStorage(null);
    createModal.open();
  };

  const { mutate: removeStorage, isPending: isRemoving } = useRemoveStorage({
    storeId: storeInfo?.storeId || "",
    onSuccess: () => {
      toast.success(t("storageRemoved", "Storage removed"));
      refetchStorages();
      confirmModal.close();
      setStorageToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || t("removeFailed", "Failed to remove storage"));
      confirmModal.close();
      setStorageToDelete(null);
    },
  });

  const MENU_ACTIONS: ActionMenuItem[] = [
    {
      label: t("viewDetails", "View"),
      onClick: (id: string) => console.log("View storage:", id),
      icon: EyeIcon,
    },
    {
      label: t("edit", "Edit"),
      onClick: (id: string) => {
        const toEdit = storageUnits.find((s) => s.id === id);
        if (!toEdit) return;
        setEditingStorage(toEdit);
        createModal.open();
        setActiveMenuId(null);
      },
      icon: Edit2Icon,
    },
    {
      label: t("delete", "Delete"),
      onClick: (id: string) => {
        if (!id) return;
        setStorageToDelete(id);
        confirmModal.open();
      },
      icon: Trash2Icon,
      danger: true,
      loading: isRemoving,
    },
  ];


  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 pt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {t("storageList", "Storage Units")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("manageStorage", "Manage warehouses and storage locations")}
          </p>
        </div>

        <div className="flex bg-white rounded-lg border border-gray-200 p-1 dark:bg-gray-900 dark:border-gray-800">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-all ${viewMode === "grid"
              ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-200"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            title={t("gridView", "Grid View")}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-all ${viewMode === "list"
              ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-200"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            title={t("listView", "List View")}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4 dark:bg-gray-900 dark:border-gray-800">
            <CommonButton
              onClick={handleCreate}
              className="w-full h-10 text-sm"
              icon={<Plus size={18} />}
            >
              {t("createStorage", "Add Storage Unit")}
            </CommonButton>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                <Info size={18} className="text-indigo-500" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  {t("setupGuide", "Setup Guide")}
                </h3>
              </div>

              <div className="space-y-6 relative">
                <div className="absolute left-3.5 top-2 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-800" />

                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    1
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("step1Title", "Define Location")}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {t("step1Desc", "Set physical address and zone info.")}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    2
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("step2Title", "Assign Type")}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {t("step2Desc", "Mark as Cold, Dry, or Hazardous.")}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    3
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("step3Title", "Add Items")}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {t("step3Desc", "Move inventory into this unit.")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {storageUnits.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <Warehouse className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                {isLoadingStorages
                  ? t("loading", "Loading...")
                  : t("noStorage", "No storage units found. Create one to get started.")}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                  : "flex flex-col space-y-3"
              }
            >
              {storageUnits.map((item: StorageResponseOverview) => {
                const isMenuOpen = activeMenuId === item.id;

                return viewMode === "grid" ? (
                  <StorageCard
                    key={item.id}
                    storage={item}
                    isMenuOpen={isMenuOpen}
                    onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                    menuActions={MENU_ACTIONS}
                  />
                ) : (
                  <StorageListItem
                    key={item.id}
                    storage={item}
                    isMenuOpen={isMenuOpen}
                    onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                    menuActions={MENU_ACTIONS}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        modal={confirmModal}
        title={t("deleteStorageTitle", "Delete Storage Unit")}
        subtitle={t("deleteStorageSubtitle", "Items in this storage must be moved first.")}
        isLoading={isRemoving}
        cancelButtonText={t("cancel", "Cancel")}
        confirmButtonText={t("delete", "Delete")}
        onClose={() => { }}
        onConfirm={() => {
          if (!storageToDelete) return;
          removeStorage({ storageId: storageToDelete });
          confirmModal.close();
        }}
      >
        {t("deleteStorageConfirm", "Are you sure you want to delete this unit? This action cannot be undone.")}
      </ConfirmModal>

      <CreateStorageDialog
        mainModal={createModal}
        onStorageCreatedCallback={() => {
          refetchStorages();
        }}
        onStorageUpdatedCallback={() => {
          refetchStorages();
        }}
      />
    </div>
  );
};

export default MainStorage;