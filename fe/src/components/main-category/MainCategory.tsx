import {
  ListMainCategory,
} from "@Jade/core-design/list/main-category-list/MainCategoryList";
import { Edit2Icon, EyeIcon, LayoutGrid, List, Plus, Trash2Icon } from "lucide-react";
import type React from "react";
import { useState } from "react";

import type { ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";
import { CardMainCategory } from "@Jade/core-design/card/main-category-card/MainCategoryCard";

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

type NewCategory = {
  name: string;
  color: string;
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

const COLOR_OPTIONS = [
  { label: "Blue", value: "bg-blue-100 text-blue-800" },
  { label: "Green", value: "bg-green-100 text-green-800" },
  { label: "Purple", value: "bg-purple-100 text-purple-800" },
  { label: "Orange", value: "bg-orange-100 text-orange-800" },
  { label: "Red", value: "bg-red-100 text-red-800" },
  { label: "Gray", value: "bg-gray-100 text-gray-800" },
  { label: "Indigo", value: "bg-indigo-100 text-indigo-800" },
  { label: "Teal", value: "bg-teal-100 text-teal-800" },
  { label: "Cyan", value: "bg-cyan-100 text-cyan-800" },
  { label: "Emerald", value: "bg-emerald-100 text-emerald-800" },
  { label: "Lime", value: "bg-lime-100 text-lime-800" },
  { label: "Amber", value: "bg-amber-100 text-amber-800" },
  { label: "Yellow", value: "bg-yellow-100 text-yellow-800" },
  { label: "Rose", value: "bg-rose-100 text-rose-800" },
  { label: "Pink", value: "bg-pink-100 text-pink-800" },
  { label: "Fuchsia", value: "bg-fuchsia-100 text-fuchsia-800" },
  { label: "Sky", value: "bg-sky-100 text-sky-800" },
  { label: "Slate", value: "bg-slate-100 text-slate-800" },
  { label: "Stone", value: "bg-stone-100 text-stone-800" },
  { label: "Zinc", value: "bg-zinc-100 text-zinc-800" },
  { label: "Neutral", value: "bg-neutral-100 text-neutral-800" },
  { label: "Emerald Dark", value: "bg-emerald-200 text-emerald-900" },
  { label: "Indigo Soft", value: "bg-indigo-50 text-indigo-700" },
  { label: "Orange Deep", value: "bg-orange-200 text-orange-900" },
  { label: "Rose Soft", value: "bg-rose-50 text-rose-700" },
  { label: "Blue Gray", value: "bg-blue-gray-100 text-blue-gray-800" },
];

const MENU_ACTIONS: ActionMenuItem[] = [
  {
    label: "View",
    onClick: () => console.log("View"),
    icon: EyeIcon,
  },
  {
    label: "Edit",
    onClick: () => console.log("Edit"),
    icon: Edit2Icon,
  },
  {
    label: "Delete",
    onClick: () => console.log("Delete"),
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
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [items] = useState<Item[]>(INITIAL_ITEMS);
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    color: COLOR_OPTIONS[0].value,
  });
  const [categoryViewMode, setCategoryViewMode] = useState<"grid" | "list">(
    "grid"
  );
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleCreateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const category: Category = {
      id: `cat_${Date.now()}`,
      name: newCategory.name.trim(),
      color: newCategory.color,
      subCategoriesCount: 0,
    };

    setCategories((prev) => [...prev, category]);
    setNewCategory({ name: "", color: COLOR_OPTIONS[0].value });
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
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
            className={`p-2 rounded transition-all ${
              categoryViewMode === "grid"
                ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-200"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setCategoryViewMode("list")}
            className={`p-2 rounded transition-all ${
              categoryViewMode === "list"
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
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-indigo-500" /> Add Category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 dark:text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                  placeholder="e.g. Summer Collection"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 dark:text-gray-400">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.label}
                      type="button"
                      onClick={() =>
                        setNewCategory({ ...newCategory, color: color.value })
                      }
                      className={`h-6 w-full rounded flex items-center justify-center transition-all ${color.value} ${
                        newCategory.color === color.value
                          ? "ring-2 ring-offset-1 ring-gray-400 dark:ring-gray-500 dark:ring-offset-gray-900"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm dark:hover:bg-indigo-500"
              >
                Create Category
              </button>
            </form>
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
                    className={`bg-white border border-gray-200 hover:border-indigo-300 hover:bg-gray-100 hover:dark:bg-gray-800 transition-all group dark:bg-gray-900 dark:border-gray-800 dark:hover:border-indigo-500 ${
                      categoryViewMode === "grid"
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
    </div>
  );
};

export default CategoriesView;