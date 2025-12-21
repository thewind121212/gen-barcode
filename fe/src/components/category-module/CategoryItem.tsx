import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { allColors } from "@Jade/core-design/modal/colorOptions";
import type { CategoryNode } from "@Jade/core/category/categoryTree";

export type CategoryItemProps = {
  node: CategoryNode;
  level: number;
  onAddSub: (id: string) => void;
  onDelete: (id: string) => void;
  defaultOpen?: boolean;
};

export default function CategoryItem({ node, level, onAddSub, onDelete, defaultOpen = false }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = node.children && node.children.length > 0;

  const color = useMemo(() => allColors.find((c) => c.id === node.colorId), [node.colorId]);
  const badgeClass = color ? `${color.bg} text-white` : "bg-slate-100 text-slate-700";

  return (
    <div className="select-none">
      <div
        className={`flex items-center justify-between p-3 mb-2 rounded-lg border border-gray-100 bg-white hover:border-indigo-200 transition-all ${
          level > 0 ? "ml-6" : ""
        }`}
      >
        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {hasChildren ? (
            isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
          ) : (
            <div className="w-4" />
          )}

          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${badgeClass}`}>L{level + 1}</span>

          <span className="font-medium text-gray-900">{node.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSub(node.id);
              setIsOpen(true);
            }}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors text-xs flex items-center gap-1"
            title="Add Subcategory"
            type="button"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Sub</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Category"
            type="button"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="border-l-2 border-gray-100 ml-5 pl-2">
          {node.children.map((child) => (
            <CategoryItem
              key={child.id}
              node={child}
              level={level + 1}
              onAddSub={onAddSub}
              onDelete={onDelete}
              defaultOpen={defaultOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}


