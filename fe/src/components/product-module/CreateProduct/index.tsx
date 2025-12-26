import type { ChangeEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Briefcase, Truck, Users, Weight } from "lucide-react";
import { useForm, FormProvider, useWatch } from "react-hook-form";

import type { RootState } from "@Jade/store/global.store";
import { useCreateProduct } from "@Jade/services/product/useQuery";
import CommonInput from "@Jade/core-design/input/CommonInput";

import { AVAILABLE_UOMS } from "@Jade/components/product-module/CreateProduct/constants";
import { CreateProductHeader } from "@Jade/components/product-module/CreateProduct/CreateProductHeader";
import { CreateProductSidebar } from "@Jade/components/product-module/CreateProduct/CreateProductSidebar";
import { BasicDetailsSection } from "@Jade/components/product-module/CreateProduct/sections/BasicDetailsSection";
import { AdvancedSection } from "@Jade/components/product-module/CreateProduct/sections/AdvancedSection";
import { UnderDevelopmentSection } from "@Jade/components/product-module/CreateProduct/sections/UnderDevelopmentSection";

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
  productName: string;
  category: string;
  baseUnit: string;
  sellPrice: string;
  storageId: string;
  isExportPriceEnabled: boolean;
  exportPrice: string;
  barcodes: string[];
  barcodeInput: string;
  packs: PackFormData[];
  inventoryType: InventoryType;
  containerConfig: ContainerConfig;
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const appStoreInfo = useSelector((state: RootState) => state.app);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isManualScrolling = useRef(false);

  // Sidebar active section
  const [activeSection, setActiveSection] = useState("basic-details");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<CreateProductFormValues>({
    defaultValues: {
      productName: "",
      category: "",
      baseUnit: "each",
      sellPrice: "",
      storageId: "",
      isExportPriceEnabled: false,
      exportPrice: "",
      barcodes: [],
      barcodeInput: "",
      packs: [],
      inventoryType: "TOTAL_ONLY",
      containerConfig: { name: "Pallet", multiplier: 100, barcode: "" },
    },
  });

  const { reset } = form;
  const baseUnit = useWatch({ control: form.control, name: 'baseUnit' });
  // API mutation
  const { mutate: createProduct, isPending } = useCreateProduct({
    storeId: appStoreInfo?.storeId,
    onSuccess: () => {
      toast.success("Product created successfully");
      reset();
      setImagePreview(null);
      setShowAdvanced(false);
      navigate("/products");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  // --- HELPERS ---
  const getBaseUnitLabel = () => {
    const uom = AVAILABLE_UOMS.find((u) => u.code === baseUnit);
    return uom ? uom.label_en : baseUnit;
  };

  // --- HANDLERS ---
  const handleImageClick = () => {
    if (!imagePreview) fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleClearImage = (e: MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleScrollTo = (e: MouseEvent, id: string) => {
    e.preventDefault();
    isManualScrolling.current = true;
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      if (id === "advanced" && !showAdvanced) setShowAdvanced(true);

      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
          isManualScrolling.current = false;
        }, 1000);
      }, 50);
    }
  };

  const handleDiscard = () => {
    reset();
    setImagePreview(null);
    setShowAdvanced(false);
    navigate("/products");
  };

  const handleSave = form.handleSubmit((values) => {
    if (!values.productName.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!values.sellPrice || Number(values.sellPrice) <= 0) {
      toast.error("Sell price must be greater than 0");
      return;
    }

    createProduct({
      storeId: appStoreInfo?.storeId || "",
      name: values.productName,
      categoryId: values.category || undefined,
      sellPrice: Number(values.sellPrice),
      baseUnitCode: values.baseUnit,
      exportPrice: values.isExportPriceEnabled ? Number(values.exportPrice) : undefined,
      trackingMode: values.inventoryType,
      containerLabel: values.inventoryType === "LOT_CONTAINER" ? values.containerConfig.name : undefined,
      containerSize: values.inventoryType === "LOT_CONTAINER" ? values.containerConfig.multiplier : undefined,
      packs: values.packs.map((p) => ({
        name: p.name || `Pack x${p.multiplier}`,
        multiplier: Number(p.multiplier),
        barcodes: p.barcode ? [{ value: p.barcode }] : [],
      })),
      barcodes: values.barcodes.map((b) => ({ value: b })),
    });
  });

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrolling.current) return;
      const sections = ["basic-details", "advanced", "shipping", "wholesale", "commission"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans pb-32 mt-16">
      <CreateProductHeader onDiscard={handleDiscard} onSave={handleSave} isSaving={isPending} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <CreateProductSidebar
            activeSection={activeSection}
            showAdvanced={showAdvanced}
            onScrollTo={handleScrollTo}
          />

          {/* --- RIGHT CONTENT --- */}
          <FormProvider {...form}>
            <div className="col-span-12 md:col-span-9 space-y-8">
              <BasicDetailsSection
                fileInputRef={fileInputRef}
                imagePreview={imagePreview}
                handleFileChange={handleFileChange}
                handleImageClick={handleImageClick}
                handleClearImage={handleClearImage}
              />

              <AdvancedSection
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                getBaseUnitLabel={getBaseUnitLabel}
              />

              <UnderDevelopmentSection id="shipping" title="Shipping & Logistics" Icon={Truck}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Physical Dimensions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <CommonInput name="shippingWeight" label="Weight (kg)" icon={<Weight size={18} />} disabled />
                      <CommonInput name="shippingVolume" label="Volume (m³)" disabled />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Handling
                    </h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded" disabled />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Fragile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded" disabled />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Perishable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </UnderDevelopmentSection>

              <UnderDevelopmentSection id="wholesale" title="Wholesale Pricing" Icon={Briefcase} />
              <UnderDevelopmentSection id="commission" title="Staff Commission" Icon={Users} />
            </div>
          </FormProvider>
        </div>
      </main>
    </div>
  );
}


