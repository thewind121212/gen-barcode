import { AlertTriangle, FolderTree } from "lucide-react";
import type { Category, CategoryStats } from "@Jade/components/main-category/MainCategory";
import { useNavigate } from "react-router-dom";
import ActionMenu, { type ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";

type MainCategoryContentProps = {
  cat: Category;
  stats: CategoryStats;
  menuActions: ActionMenuItem[];
  isMenuOpen: boolean;
  onMenuToggle: (open: boolean) => void;
};

export const CardMainCategory = ({
  cat,
  stats,
  menuActions,
  isMenuOpen,
  onMenuToggle,
}: MainCategoryContentProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/categories/${cat.id}`);

  return (
    <div onClick={handleNavigate} role="button" tabIndex={0}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${cat.color.split(" ")[0]}`}
          ></div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px] cursor-default">
            {cat.name}
          </h3>
        </div>
        <div
          className="text-gray-400 hover:text-gray-600 transition-colors w-6 h-6 flex items-center justify-center cursor-pointer"
          title="More"
        >
          {
            menuActions.length > 0 && (
              <ActionMenu
                actions={menuActions}
                isOpen={isMenuOpen}
                onToggle={() => onMenuToggle(!isMenuOpen)}
              />
            ) 
          }
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-50 p-2 rounded border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {stats.itemCount}
          </p>
        </div>
        <div className="bg-gray-50 p-2 rounded border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Value</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            ${stats.totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        {/* Subcategory Count Indicator */}
        <div
          className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-50 px-2 py-1 rounded cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Subcategories clicked");
          }}
        >
          <FolderTree size={12} />
          <span>{cat.subCategoriesCount}</span>
        </div>

        {stats.lowStockCount > 0 && (
          <div
            className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Low stock clicked");
            }}
          >
            <AlertTriangle size={12} />
            <span>{stats.lowStockCount} items low stock</span>
          </div>
        )}
      </div>
    </div>
  );
};
