import { Package } from "lucide-react";
import ActionMenu, { type ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";
import type { Product } from "@Jade/components/product-module/MainProduct";

type MainProductContentProps = {
  product: Product;
  menuActions: ActionMenuItem[];
  isMenuOpen: boolean;
  onMenuToggle: (open: boolean) => void;
};

const formatPriceVnd = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export const ListMainProduct = ({
  product,
  menuActions,
  isMenuOpen,
  onMenuToggle,
}: MainProductContentProps) => {
  return (
    <>
      {/* Product Image */}
      <div className="w-12 h-12 rounded-lg bg-gradient-linear-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Package className="text-indigo-400" size={20} />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate text-sm">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {formatPriceVnd(product.sellPrice)}
            </span>
            <p className="text-xs text-slate-400">/{product.baseUnit}</p>
          </div>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              product.stock > 20
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : product.stock > 0
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {product.stock}
          </span>

          {/* Menu Button */}
          {menuActions.length > 0 && (
            <ActionMenu
              actions={menuActions}
              isOpen={isMenuOpen}
              onToggle={() => onMenuToggle(!isMenuOpen)}
              targetId={product.id}
              portal
            />
          )}
        </div>
      </div>
    </>
  );
};


