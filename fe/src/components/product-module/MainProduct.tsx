import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Edit2Icon,
  EyeIcon,
  Info,
  LayoutGrid,
  List,
  Package,
  Plus,
  Trash2Icon,
} from "lucide-react";
import CommonButton from "@Jade/core-design/input/CommonButton";
import { ModalId, useModal } from "@Jade/core-design/modal/useModal";
import { ConfirmModal } from "@Jade/core-design/modal/ConfirmModal";
import { useProductModuleStore } from "@Jade/components/product-module/store";
import type { ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";
import { CardMainProduct } from "@Jade/core-design/card/main-product-card/MainProductCard";
import { ListMainProduct } from "@Jade/core-design/list/main-product-list/MainProductListItem";

// ==========================================
// --- MOCK DATA (for now - dummy API) ---
// ==========================================

export type Product = {
  id: string;
  name: string;
  category: string;
  sellPrice: number;
  baseUnit: string;
  stock: number;
  imageUrl?: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Wireless Mouse",
    category: "Electronics",
    sellPrice: 299000,
    baseUnit: "Each",
    stock: 45,
  },
  {
    id: "prod_2",
    name: "USB-C Cable",
    category: "Electronics",
    sellPrice: 89000,
    baseUnit: "Piece",
    stock: 120,
  },
  {
    id: "prod_3",
    name: "Organic Coffee Beans",
    category: "Groceries",
    sellPrice: 185000,
    baseUnit: "Kg",
    stock: 30,
  },
];

const MainProduct = () => {
  const { t } = useTranslation("product");
  const navigate = useNavigate();

  // Store state
  const viewMode = useProductModuleStore((s) => s.viewMode);
  const activeMenuId = useProductModuleStore((s) => s.activeMenuId);
  const setViewMode = useProductModuleStore((s) => s.setViewMode);
  const setActiveMenuId = useProductModuleStore((s) => s.setActiveMenuId);

  // Modals
  const confirmModal = useModal(ModalId.CONFIRM);

  // TODO: Replace with real API hook when ready
  const products = MOCK_PRODUCTS;

  // Menu actions
  const MENU_ACTIONS: ActionMenuItem[] = [
    {
      label: t("view", "View"),
      onClick: (id: string) => {
        console.log("View product:", id);
      },
      icon: EyeIcon,
    },
    {
      label: t("edit", "Edit"),
      onClick: (id: string) => {
        console.log("Edit product:", id);
      },
      icon: Edit2Icon,
    },
    {
      label: t("delete", "Delete"),
      onClick: (id: string) => {
        console.log("Delete product:", id);
        confirmModal.open();
      },
      icon: Trash2Icon,
      danger: true,
    },
  ];

  const handleCreateProduct = () => {
    navigate("/products/create");
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 pt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {t("products", "Products")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("manageProducts", "Manage your product inventory")}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 dark:bg-gray-900 dark:border-gray-800">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-all ${
              viewMode === "grid"
                ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-200"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
            title={t("gridView", "Grid View")}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-all ${
              viewMode === "list"
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
        {/* Sidebar - Create Button & Guide */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4 dark:bg-gray-900 dark:border-gray-800">
            <CommonButton
              onClick={handleCreateProduct}
              className="w-full h-10 text-sm"
              icon={<Plus size={18} />}
            >
              {t("createProduct", "Create Product")}
            </CommonButton>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                <Info size={18} className="text-indigo-500" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  {t("quickGuide", "Quick Guide")}
                </h3>
              </div>

              <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-3.5 top-2 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-800" />

                {/* Step 1 */}
                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    1
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("step1Title", "Add Basic Info")}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {t("step1Desc", "Enter product name, price, and category.")}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    2
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("step2Title", "Add Barcodes")}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {t("step2Desc", "Scan or generate barcodes for your product.")}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    3
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("step3Title", "Configure Packs")}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {t("step3Desc", "Optional: Set up bulk packs (box, case).")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <Package className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                {t("noProducts", "No products yet. Create your first product!")}
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
              {products.map((product) => {
                const isMenuOpen = activeMenuId === product.id;

                return viewMode === "grid" ? (
                  <div
                    key={product.id}
                    className={`relative bg-white dark:bg-slate-900 rounded-xl border transition-all group ${
                      isMenuOpen
                        ? "border-indigo-300 dark:border-indigo-500 shadow-md"
                        : "border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md"
                    }`}
                  >
                    <CardMainProduct
                      product={product}
                      isMenuOpen={isMenuOpen}
                      onMenuToggle={(open) => setActiveMenuId(open ? product.id : null)}
                      menuActions={MENU_ACTIONS}
                    />
                  </div>
                ) : (
                  <div
                    key={product.id}
                    className={`relative bg-white dark:bg-slate-900 rounded-lg border p-3 flex items-center gap-4 transition-all ${
                      isMenuOpen
                        ? "border-indigo-300 dark:border-indigo-500 shadow-md"
                        : "border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500"
                    }`}
                  >
                    <ListMainProduct
                      product={product}
                      isMenuOpen={isMenuOpen}
                      onMenuToggle={(open) => setActiveMenuId(open ? product.id : null)}
                      menuActions={MENU_ACTIONS}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        modal={confirmModal}
        title={t("deleteProductTitle", "Delete Product")}
        subtitle={t("deleteProductSubtitle", "This action cannot be undone.")}
        isLoading={false}
        cancelButtonText={t("cancel", "Cancel")}
        confirmButtonText={t("delete", "Delete")}
        onClose={() => {}}
        onConfirm={() => {
          // TODO: Call delete API
          confirmModal.close();
        }}
      >
        {t("deleteProductConfirm", "Are you sure you want to delete this product?")}
      </ConfirmModal>
    </div>
  );
};

export default MainProduct;
