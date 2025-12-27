import { useEffect } from "react";
import {
  ChevronDown,
  Plus,
  QrCode,
  Settings,
  Trash2,
  Package,
  Archive,
  Check,
  Layers,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import CommonButton from "@Jade/core-design/input/CommonButton";
import CommonInput from "@Jade/core-design/input/CommonInput";
import { cn } from "@Jade/components/product-module/CreateProduct/utils";

type PackFormData = {
  id: number;
  name: string;
  multiplier: number;
  price: string;
  barcode: string;
};

type ContainerConfig = {
  name: string;
  multiplier: number;
  barcode: string;
};

type InventoryType = "TOTAL_ONLY" | "LOT_CONTAINER";

type CreateProductFormValues = {
  packs: PackFormData[];
  inventoryType: InventoryType;
  containerConfig: ContainerConfig;
};

export function AdvancedSection({
  showAdvanced,
  setShowAdvanced,
  getBaseUnitLabel,
}: {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  getBaseUnitLabel: () => string;
}) {
  const { watch, setValue, register } = useFormContext<CreateProductFormValues>();
  const packs = watch("packs") ?? [];
  const inventoryType = watch("inventoryType");
  const containerConfig = watch("containerConfig");

  const isLotContainerMode = inventoryType === "LOT_CONTAINER";
  const canAddPack = !isLotContainerMode || packs.length < 1;

  const addPack = () => {
    const current = packs ?? [];
    const newId = current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1;
    setValue(
      "packs",
      [...current, { id: newId, name: "", multiplier: 1, price: "", barcode: "" }],
      { shouldDirty: true },
    );
  };

  const removePack = (id: number) => {
    setValue(
      "packs",
      (packs ?? []).filter((p) => p.id !== id),
      { shouldDirty: true },
    );
  };

  const setInventoryType = (type: InventoryType) => {
    setValue("inventoryType", type, { shouldDirty: true });
  };

  const setContainerConfig = (config: Partial<ContainerConfig>) => {
    setValue("containerConfig", { ...(containerConfig ?? { name: "", multiplier: 0, barcode: "" }), ...config }, { shouldDirty: true });
  };

  // Keep containerConfig synced with the single "container unit" pack (so save payload stays correct).
  useEffect(() => {
    if (!isLotContainerMode) return;
    const p = packs[0];
    if (!p) return;
    setContainerConfig({
      name: p.name ?? "",
      multiplier: Number(p.multiplier || 0),
      barcode: p.barcode ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLotContainerMode, packs]);

  const handleSelectInventoryType = (type: InventoryType) => {
    setInventoryType(type);

    // Enforce "only 1 pack" when switching into LOT_CONTAINER mode.
    if (type === "LOT_CONTAINER" && packs.length > 1) {
      for (const p of packs.slice(1)) {
        removePack(p.id);
      }
    }
  };

  return (
    <section
      id="advanced"
      className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden scroll-mt-24 transition-all"
    >
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Settings size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Advanced Configuration</h2>
            <p className="text-xs text-slate-500 font-normal">
              Manage sales packs and inventory strategy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          {showAdvanced ? "Collapse" : "Expand"}
          <ChevronDown
            size={16}
            className={cn("transition-transform duration-200", showAdvanced ? "rotate-180" : "")}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      {showAdvanced && (
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
          {/* Main Tabs (mapped to inventory type) */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg mb-8 w-fit">
            <button
              type="button"
              onClick={() => handleSelectInventoryType("TOTAL_ONLY")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                !isLotContainerMode
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              )}
            >
              <Layers size={16} />
              Simple Quantity
            </button>
            <button
              type="button"
              onClick={() => handleSelectInventoryType("LOT_CONTAINER")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                isLotContainerMode
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              )}
            >
              <Package size={16} />
              Lot & Container
            </button>
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
            {/* Pack / Container Config Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {isLotContainerMode ? "Container Unit Configuration" : "Pack Configuration"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-500">
                      {isLotContainerMode
                        ? "Define the single container unit (e.g. Pallet) used for lot tracking."
                        : "Define selling units (e.g. Box, Case). Multiple variants allowed."}
                    </span>
                  </div>
                </div>

                {canAddPack && (
                  <CommonButton
                    className="w-auto! py-2! px-4! rounded-lg! text-sm! font-semibold! shadow-sm"
                    icon={<Plus size={16} />}
                    iconPosition="left"
                    onClick={addPack}
                  >
                    {isLotContainerMode ? "Create Container Unit" : "Add Pack"}
                  </CommonButton>
                )}
              </div>

              {isLotContainerMode && packs.length >= 1 && (
                <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 text-xs rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  <p>
                    <strong>Container Defined:</strong> This unit acts as both the container definition
                    and the primary sales pack for lot management.
                  </p>
                </div>
              )}

              {packs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/30 dark:bg-slate-900/30">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 text-slate-400">
                    <Archive size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {isLotContainerMode ? "No container unit defined" : "No packs configured"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    This item is sold only by its base unit ({getBaseUnitLabel()}).
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {packs.map((p, index) => (
                    <div
                      key={p.id}
                      className="group relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="absolute -left-px top-4 bottom-4 w-1 bg-indigo-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500">
                            {isLotContainerMode ? "1" : index + 1}
                          </span>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            {isLotContainerMode ? "Container Unit" : "Pack Variant"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePack(p.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-5">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">
                            {isLotContainerMode ? "Container Name" : "Pack Name"}
                          </label>
                          <CommonInput
                            name={`packs.${index}.name`}
                            value={p.name}
                            placeholder={isLotContainerMode ? "e.g. Pallet" : "e.g. Small Box"}
                            register={register}
                            floatingLabel={false}
                            className="h-[46px]! placeholder:text-xs placeholder:font-normal"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">
                            {isLotContainerMode ? "Capacity" : "Qty"} ({getBaseUnitLabel()})
                          </label>
                          <CommonInput
                            name={`packs.${index}.multiplier`}
                            type="number"
                            value={p.multiplier}
                            register={register}
                            registerOptions={{ valueAsNumber: true }}
                            floatingLabel={false}
                            className="h-[46px]! placeholder:text-xs placeholder:font-normal font-bold"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-5">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">
                            Barcode / SKU
                          </label>
                          <CommonInput
                            name={`packs.${index}.barcode`}
                            icon={<QrCode size={16} />}
                            value={p.barcode || ""}
                            placeholder="Scan or enter..."
                            register={register}
                            floatingLabel={false}
                            className="h-[46px]! placeholder:text-xs placeholder:font-normal"
                          />
                        </div>

                        <div className="col-span-12">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">
                            Price Override (Optional)
                          </label>
                          <CommonInput
                            name={`packs.${index}.price`}
                            icon={null}
                            value={p.price ?? ""}
                            placeholder="Leave empty to calculate automatically"
                            register={register}
                            floatingLabel={false}
                            className="h-[46px]! placeholder:text-xs placeholder:font-normal"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


