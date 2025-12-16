import {
  ListMainCategory,
} from "@Jade/core-design/list/main-category-list/MainCategoryList";
import { Edit2Icon, EyeIcon, Info, LayoutGrid, List, Plus, Trash2Icon } from "lucide-react";
import { useState } from "react";

import CreateCategoryDialog from "@Jade/components/category-module/CreateCategoryDialog";
import type { ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";
import { CardMainCategory } from "@Jade/core-design/card/main-category-card/MainCategoryCard";
import CommonButton from "@Jade/core-design/input/CommonButton";
import { useModal } from "@Jade/core-design/modal/ModalBase";

export type Category = {
  id: string;
  name: string;
  color: string;
  subCategoriesCount: number;
};

export type Item = {
  id: string;
  name: string;
  sku?: string;
  category: string;
  vendor?: string;
  price: number;
  quantity: number;
  minStock: number;
};

export type CategoryStats = {
  itemCount: number;
  totalQty: number;
  totalValue: number;
  lowStockCount: number;
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "7c5f2bde-1b9c-4a04-9ab1-f46a02c8ffba",
    name: "Electronics",
    color: "bg-blue-100 text-blue-800",
    subCategoriesCount: 2,
  },
  {
    id: "4b0e8e2d-8c55-4c8e-9f2c-0f7e8d1ac7c1",
    name: "Groceries",
    color: "bg-green-100 text-green-800",
    subCategoriesCount: 4,
  },
  {
    id: "1f6f7a5c-26f4-4f6d-8c63-7a3a9c9e5d2b",
    name: "Clothing",
    color: "bg-purple-100 text-purple-800",
    subCategoriesCount: 0,
  },
];

const INITIAL_ITEMS: Item[] = [
  {
    id: "item_1",
    name: "Wireless Headphones",
    sku: "WH-001-BLU",
    category: "7c5f2bde-1b9c-4a04-9ab1-f46a02c8ffba",
    vendor: "TechGiant Dist.",
    price: 129.99,
    quantity: 15,
    minStock: 5,
  },
  {
    id: "item_2",
    name: "Organic Coffee Beans",
    sku: "GRO-CF-500",
    category: "4b0e8e2d-8c55-4c8e-9f2c-0f7e8d1ac7c1",
    vendor: "Green Earth Farms",
    price: 18.5,
    quantity: 4,
    minStock: 10,
  },
];


const MENU_ACTIONS: ActionMenuItem[] = [
  {
    label: "View",
    onClick: () => { },
    icon: EyeIcon,
  },
  {
    label: "Edit",
    onClick: () => { },
    icon: Edit2Icon,
  },
  {
    label: "Delete",
    onClick: () => { },
    icon: Trash2Icon,
    danger: true,
  },
];

const getCategoryStats = (items: Item[], catId: string): CategoryStats => {
  const catItems = items.filter((i) => i.category === catId);
  const totalQty = catItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalValue = catItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const lowStockCount = catItems.filter((i) => i.quantity <= i.minStock).length;

  return {
    itemCount: catItems.length,
    totalQty,
    totalValue,
    lowStockCount,
  };
};

const CategoriesView = () => {
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [items] = useState<Item[]>(INITIAL_ITEMS);
  const [categoryViewMode, setCategoryViewMode] = useState<"grid" | "list">(
    "grid"
  );
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const mainModal = useModal();

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 pt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your product classifications
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 dark:bg-gray-900 dark:border-gray-800">
          <button
            onClick={() => setCategoryViewMode("grid")}
            className={`p-2 rounded transition-all ${categoryViewMode === "grid"
              ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-200"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setCategoryViewMode("list")}
            className={`p-2 rounded transition-all ${categoryViewMode === "list"
              ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-200"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category Form - Compact */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4 dark:bg-gray-900 dark:border-gray-800">
            <CommonButton
              onClick={() => mainModal.open()}
              className="w-full h-10 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm dark:hover:bg-indigo-500"
              icon={<Plus size={18} />}
            >
              Create Main Category
            </CommonButton>
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                <Info size={18} className="text-indigo-500" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Quick Guide</h3>
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
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Create Main Layer</h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      Start by using the button above to create your top-level categories.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    2
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Enter Details</h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      Click on any category card to enter it and view its contents.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    3
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Nest Layers</h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      Create sub-layers easily. You can nest up to <span className="font-bold text-indigo-600 dark:text-indigo-400">5 levels</span> deep.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10 dark:bg-gray-800 dark:border-indigo-900 dark:text-indigo-400">
                    4
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Assign Items</h4>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      Add items to any specific layer you are currently viewing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category List - Responsive Grid or List */}
        <div className="lg:col-span-2">
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                No categories yet. Create one to get started!
              </p>
            </div>
          ) : (
            <div
              className={
                categoryViewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                  : "flex flex-col space-y-3"
              }
            >
              {categories.map((cat) => {
                const stats = getCategoryStats(items, cat.id);
                const isMenuOpen = activeMenuId === cat.id;

                return (
                  <div
                    key={cat.id}
                    id={cat.id}
                    className={`bg-white border border-gray-200 hover:border-indigo-300 hover:bg-gray-100 hover:dark:bg-gray-800 transition-all group dark:bg-gray-900 dark:border-gray-800 dark:hover:border-indigo-500 ${categoryViewMode === "grid"
                      ? "p-4 rounded-xl shadow-sm hover:shadow-md"
                      : "p-3 rounded-lg flex items-center shadow-sm"
                      } 
                    ${isMenuOpen && "bg-gray-100! dark:bg-gray-800! border-indigo-300! dark:border-indigo-500! shadow-md!"}
                    `
                    }
                  >
                    {categoryViewMode === "grid" ? (
                      <CardMainCategory
                        cat={cat}
                        stats={stats}
                        menuActions={MENU_ACTIONS}
                        isMenuOpen={isMenuOpen}
                        onMenuToggle={(open) =>
                          setActiveMenuId(open ? cat.id : null)
                        }
                      />
                    ) : (
                      <ListMainCategory
                        cat={cat}
                        stats={stats}
                        menuActions={MENU_ACTIONS}
                        isMenuOpen={isMenuOpen}
                        onMenuToggle={(open) =>
                          setActiveMenuId(open ? cat.id : null)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <CreateCategoryDialog mainModal={mainModal} />
    </div>
  );
};

export default CategoriesView;