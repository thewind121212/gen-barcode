import { AlertTriangle, FolderTree } from "lucide-react";
import type { Category, CategoryStats } from "../../../components/category-module/MainCategory";
import { useNavigate } from "react-router-dom";
import ActionMenu, { type ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";

type MainCategoryContentProps = {
  cat: Category;
  stats: CategoryStats;
  menuActions: ActionMenuItem[];
  isMenuOpen: boolean;
  onMenuToggle: (open: boolean) => void;
};

export const ListMainCategory = ({
  cat,
  stats,
  menuActions,
  isMenuOpen,
  onMenuToggle,
}: MainCategoryContentProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full"
      onClick={() => navigate(`/categories/${cat.id}`)}>
      <div className="flex items-center gap-4 flex-1">
        <span
          className={`w-2 h-10 rounded-full ${cat.color.split(" ")[0]}`}
        ></span>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {cat.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 dark:text-gray-400">
            <span>{stats.itemCount} items</span>
            <span>•</span>
            <span>${stats.totalValue.toLocaleString()} value</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-50 px-2 py-1 rounded cursor-pointer">
          <FolderTree size={12} />
          <span>{cat.subCategoriesCount}</span>
        </div>
        {stats.lowStockCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full dark:text-red-400 dark:bg-red-900/30">
            <AlertTriangle size={12} />
            <span className="hidden sm:inline">Low Stock</span>
          </div>
        )}
        <button
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          {
            menuActions.length > 0 && (
              <ActionMenu actions={menuActions} 
              isOpen={isMenuOpen} 
              onToggle={() => onMenuToggle(!isMenuOpen)} 
              />
            )
          }
        </button>
      </div>
    </div>
  );
};
