import type { ChangeEvent } from "react";
import {
  ChevronDown,
  DollarSign,
  Layers,
  Plus,
  QrCode,
  Settings,
  Trash2,
  Warehouse,
} from "lucide-react";
import CommonButton from "@Jade/core-design/input/CommonButton";
import CommonInput from "@Jade/core-design/input/CommonInput";
import type { ContainerConfig, PackFormData, ProductModuleStore } from "../../store";
import { cn } from "../utils";

export function AdvancedSection({
  showAdvanced,
  setShowAdvanced,
  advancedTab,
  setAdvancedTab,
  packs,
  addPack,
  removePack,
  updatePack,
  inventoryType,
  setInventoryType,
  containerConfig,
  setContainerConfig,
  getBaseUnitLabel,
}: {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  advancedTab: ProductModuleStore["advancedTab"];
  setAdvancedTab: (tab: ProductModuleStore["advancedTab"]) => void;
  packs: PackFormData[];
  addPack: () => void;
  removePack: (id: number) => void;
  updatePack: (id: number, field: keyof PackFormData, value: string | number) => void;
  inventoryType: ProductModuleStore["inventoryType"];
  setInventoryType: (type: ProductModuleStore["inventoryType"]) => void;
  containerConfig: ContainerConfig;
  setContainerConfig: (config: Partial<ContainerConfig>) => void;
  getBaseUnitLabel: () => string;
}) {
  return (
    <section
      id="advanced"
      className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden scroll-mt-24"
    >
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Settings className="text-indigo-600 dark:text-indigo-400" size={18} />
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Advanced Configuration</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
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
          {/* Internal Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-slate-700 mb-6">
            <button
              type="button"
              onClick={() => setAdvancedTab("packs")}
              className={cn(
                "pb-2 text-sm font-medium transition-all relative",
                advancedTab === "packs"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              )}
            >
              Sales Packs
              {advancedTab === "packs" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setAdvancedTab("inventory")}
              className={cn(
                "pb-2 text-sm font-medium transition-all relative",
                advancedTab === "inventory"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              )}
            >
              Inventory & Logistics
              {advancedTab === "inventory" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          </div>

          {/* TAB 1: Sales Packs */}
          {advancedTab === "packs" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={16} /> Sales Packs
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create multiple pack variants (e.g. Box, Case) for selling.
                  </p>
                </div>
                <CommonButton
                  className="w-auto! py-2! px-3! rounded-lg! text-sm! font-semibold!"
                  icon={<Plus size={18} />}
                  iconPosition="left"
                  onClick={addPack}
                >
                  Add Pack
                </CommonButton>
              </div>

              {packs.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-900/50">
                  <p className="text-sm text-slate-500">
                    No packs defined. Sold as <strong>{getBaseUnitLabel()}</strong> only.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {packs.map((p) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-12 gap-3 items-start bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <div className="col-span-12 sm:col-span-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          Pack Name
                        </label>
                        <CommonInput
                          name={`pack-name-${p.id}`}
                          value={p.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updatePack(p.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          Multiplier
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-sm text-center font-bold text-indigo-600 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-indigo-400 outline-none"
                            value={p.multiplier}
                            onChange={(e) => updatePack(p.id, "multiplier", e.target.value)}
                          />
                          <span className="absolute right-8 top-2.5 text-xs text-slate-400 pointer-events-none">
                            x
                          </span>
                        </div>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          Price Override
                        </label>
                        <CommonInput
                          name={`pack-price-${p.id}`}
                          icon={<DollarSign size={18} />}
                          value={p.price}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updatePack(p.id, "price", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-11 sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          Pack Barcode
                        </label>
                        <CommonInput
                          name={`pack-barcode-${p.id}`}
                          icon={<QrCode size={18} />}
                          value={p.barcode || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updatePack(p.id, "barcode", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-1 pt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePack(p.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Inventory & Logistics */}
          {advancedTab === "inventory" && (
            <div className="animate-in fade-in slide-in-from-right-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Warehouse size={16} /> Inventory Strategy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strategy Toggle */}
                <div className="space-y-3">
                  <div
                    onClick={() => setInventoryType("TOTAL_ONLY")}
                    className={cn(
                      "p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3",
                      inventoryType === "TOTAL_ONLY"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500"
                        : "border-transparent bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        inventoryType === "TOTAL_ONLY" ? "border-indigo-600" : "border-slate-400"
                      )}
                    >
                      {inventoryType === "TOTAL_ONLY" && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Total Quantity Only
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Simple tracking (e.g. 150 items in stock)
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setInventoryType("LOT_CONTAINER")}
                    className={cn(
                      "p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3",
                      inventoryType === "LOT_CONTAINER"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500"
                        : "border-transparent bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        inventoryType === "LOT_CONTAINER" ? "border-indigo-600" : "border-slate-400"
                      )}
                    >
                      {inventoryType === "LOT_CONTAINER" && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Lot & Container
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Track expiration, lots, and pallet locations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Container Settings (Conditional) */}
                <div className="space-y-4">
                  {inventoryType === "LOT_CONTAINER" && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-left-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Container Definition (Singular)
                      </label>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                              Container Name
                            </label>
                            <CommonInput
                              name="containerName"
                              value={containerConfig.name}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setContainerConfig({ name: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                              Capacity ({getBaseUnitLabel()}s)
                            </label>
                            <CommonInput
                              name="containerCapacity"
                              type="number"
                              value={containerConfig.multiplier}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setContainerConfig({ multiplier: Number(e.target.value) })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Barcode (Label)
                          </label>
                          <CommonInput
                            name="containerBarcode"
                            icon={<QrCode size={18} />}
                            value={containerConfig.barcode}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setContainerConfig({ barcode: e.target.value })
                            }
                            className="font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}


