import type { ChangeEvent, KeyboardEvent, MouseEvent, RefObject } from "react";
import {
  Barcode,
  DollarSign,
  Edit,
  Home,
  Package,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import CommonButton from "@Jade/core-design/input/CommonButton";
import CommonInput from "@Jade/core-design/input/CommonInput";
import { useGetStorageByStoreId } from "@Jade/services/storage/useQuery";
import CoreSelect from "@Jade/core-design/input/Select";
import { AVAILABLE_UOMS } from "@Jade/components/product-module/CreateProduct/constants";
import { useSelector } from "react-redux";
import type { RootState } from "@Jade/store/global.store";
import { cn } from "@Jade/components/product-module/CreateProduct/utils";

type CreateProductFormValues = {
  productName: string;
  category: string;
  baseUnit: string;
  storageId: string;
  sellPrice: string;
  barcodeInput: string;
  barcodes: string[];
};

export function BasicDetailsSection({
  fileInputRef,
  imagePreview,
  handleFileChange,
  handleImageClick,
  handleClearImage,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  imagePreview: string | null;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  handleClearImage: (e: MouseEvent) => void;
}) {
  const { register, watch, setValue } = useFormContext<CreateProductFormValues>();
  const appStoreInfo = useSelector((state: RootState) => state.app)


  const productName = watch("productName");
  const category = watch("category");
  const baseUnit = watch("baseUnit");
  const storageId = watch("storageId");
  const sellPrice = watch("sellPrice");
  const barcodeInput = watch("barcodeInput");
  const barcodes = watch("barcodes");

  const handleAddBarcode = () => {
    const v = (barcodeInput ?? "").trim();
    if (!v) return;
    setValue("barcodes", [...(barcodes ?? []), v], { shouldDirty: true });
    setValue("barcodeInput", "", { shouldDirty: true });
  };

  const handleBarcodeKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddBarcode();
    }
  };

  const { data: storageData } = useGetStorageByStoreId({
    storeId: appStoreInfo?.storeId || "",
  }, appStoreInfo?.storeId, {
    enabled: Boolean(appStoreInfo?.storeId),
  });


  const storageOptions = storageData?.data.storages.map((storage) => ({
    label: storage.name,
    value: storage.id,
  }));

  const removeBarcode = (index: number) => {
    setValue(
      "barcodes",
      (barcodes ?? []).filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <section
      id="basic-details"
      className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 scroll-mt-24"
    >
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="text-indigo-600 dark:text-indigo-400" size={18} />
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Basic Details</h2>
        </div>
        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
          Required
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Uploader */}
          <div className="shrink-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div
              onClick={handleImageClick}
              className={cn(
                "group relative w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 dark:border-slate-700 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden",
                imagePreview
                  ? "border-transparent"
                  : "border-dashed border-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500"
              )}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="p-1.5 bg-white/20 text-white rounded-full backdrop-blur-sm"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="p-1.5 bg-red-500/80 text-white rounded-full backdrop-blur-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500">
                  <UploadCloud size={24} className="mb-1" />
                  <span className="text-[10px] font-medium">Upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-6">
            {/* Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CommonInput
                name="productName"
                label="Product Name"
                value={productName}
                placeholder="Product Name"
                register={register}
                floatingLabel={false}
                className="h-[46px]! placeholder:text-xs placeholder:font-normal"
              />
              <CoreSelect
                name="category"
                label="Category"
                value={category}
                register={register}
                className="h-[46px]!"
                placeholder="Select Category"
                placeholderClassName="text-xs font-normal"
                options={[
                  { label: "Electronics", value: "electronics" },
                  { label: "Groceries", value: "groceries" },
                ]}
              />
            </div>

            {/* Base Unit & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
              <CoreSelect
                name="storageId"
                label="Storage Location"
                value={storageId}
                register={register}
                placeholder="Select Storage Location"
                placeholderClassName="text-xs font-normal"
                icon={<Home size={16} />}
                className="h-[46px]!"
                options={storageOptions}
              />

              <CommonInput
                name="sellPrice"
                label="Sell Price (VND)"
                type="number"
                icon={<DollarSign size={16} />}
                value={sellPrice}
                placeholder="0.00"
                register={register}
                className="font-bold text-indigo-700 dark:text-indigo-400 h-[46px]! placeholder:text-xs placeholder:font-normal"
                floatingLabel={false}
              />
              <div className="space-y-1.5">
                <CoreSelect
                  name="baseUnit"
                  label="Base Unit"
                  value={baseUnit}
                  register={register}
                  placeholder="Select Base Unit"
                  placeholderClassName="text-xs font-normal"
                  className="h-[46px]!"
                  options={AVAILABLE_UOMS.map((u) => ({
                    label: `${u.label_en} (${u.label_vi})`,
                    value: u.code,
                  }))}
                />
                <p className="text-[10px] text-slate-500">Default: "Each" (Cái/Chiếc).</p>
              </div>
            </div>
            {/* Barcode Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Barcodes
              </label>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <CommonInput
                    name="barcodeInput"
                    icon={<Barcode size={16} className="translate-y-[-4px]" />}
                    placeholder="Enter Barcode (optional)"
                    placeholderClassName="text-xs font-normal"
                    value={barcodeInput}
                    onKeyDown={handleBarcodeKeyDown}
                    register={register}
                    floatingLabel={false}
                    className="h-[40px]!"
                  />
                </div>
                <CommonButton
                  onClick={handleAddBarcode}
                  className="shrink-0 w-10! h-10! py-0! px-0! rounded-lg! text-sm! font-semibold!"
                >
                  <Plus size={18} />
                </CommonButton>
              </div>
              {barcodes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {barcodes.map((code, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 shadow-sm animate-in zoom-in-95"
                    >
                      {code}
                      <button
                        type="button"
                        onClick={() => removeBarcode(idx)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Additional barcodes for easy to track your product.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


