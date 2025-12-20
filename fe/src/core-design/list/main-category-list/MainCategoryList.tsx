/* eslint-disable react-hooks/static-components */
import { AlertTriangle, FolderTree } from "lucide-react";
import type { Category, CategoryStats } from "@Jade/components/category-module/MainCategory";
import { useNavigate } from "react-router-dom";
import ActionMenu, { type ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";
import { getLucideIconComponent } from "../../utils/iconHelpers";
import { useMemo } from "react";

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
  const IconComponent = useMemo(() => getLucideIconComponent(cat.icon), [cat.icon]);
  const fallbackIcon = <FolderTree size={16} />;

  return (
    <div className="flex items-center justify-between w-full"
      onClick={() => navigate(`/categories/${cat.id}`)}>
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`w-8 h-8 rounded-full flex items-center text-white! justify-center ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${cat.backgroundColor} ${cat.textColor}`}
        >
          {IconComponent
            ? <IconComponent size={16} />
            : fallbackIcon}
        </div>
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
        <div
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          {
            menuActions.length > 0 && (
              <ActionMenu actions={menuActions}
                isOpen={isMenuOpen}
                onToggle={() => onMenuToggle(!isMenuOpen)}
                targetId={cat.id}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};
