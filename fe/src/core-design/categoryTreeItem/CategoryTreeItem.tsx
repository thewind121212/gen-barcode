import { useLayoutEffect, useMemo, useState } from "react";
import { ChevronRight, ChevronsDownUp, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { type HandleSubCategory } from "@Jade/components/category-module/utils";
import { allColors } from "@Jade/core-design/modal/colorOptions";

export type FlatCategory = {
    id: string;
    name: string;
    parentId: string | null;
    colorId: string;
    layer: string;
  };
  
  export type CategoryNode = FlatCategory & {
    children: CategoryNode[];
  };

export type CategoryItemProps = {
  node: CategoryNode;
  level: number;
  onAddSub: (payload: HandleSubCategory) => void;
  onDelete: (id: string) => void;
  defaultOpen?: boolean;
  controlledOpen?: boolean;
  onToggleOpen?: (nextOpen: boolean) => void;
  onExpandToggle?: () => void;
};

export default function CategoryItem({
  node,
  level,
  onAddSub,
  onDelete,
  defaultOpen = false,
  controlledOpen,
  onToggleOpen,
  onExpandToggle,
}: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [layer2OpenMap, setLayer2OpenMap] = useState<Record<string, boolean>>({});
  const hasChildren = node.children && node.children.length > 0;
  const childrenId = `cat-children-${node.id}`;
  const isRootLayer = level === 0;
  const isControlled = controlledOpen !== undefined;

  const effectiveOpen = isRootLayer ? true : (isControlled ? Boolean(controlledOpen) : isOpen);

  useLayoutEffect(() => {
    if (isRootLayer) {
      setLayer2OpenMap({});
      return;
    }
    if (isControlled) return;
    setIsOpen(defaultOpen);
  }, [defaultOpen, isControlled, isRootLayer]);

  const toggleSelf = () => {
    if (isRootLayer) {
      setLayer2OpenMap((prev) => {
        const next: Record<string, boolean> = { ...prev };
        node.children.forEach((child) => {
          next[child.id] = false;
        });
        return next;
      });
      return;
    }
    if (!hasChildren) return;
    const next = !effectiveOpen;
    if (isControlled) onToggleOpen?.(next);
    else setIsOpen(next);
  };

  // const openSelf = () => {
  //   if (isRootLayer) return;
  //   if (isControlled) onToggleOpen?.(true);
  //   else setIsOpen(true);
  // };

  const color = useMemo(() => allColors.find((c) => c.id === node.colorId), [node.colorId]);
  const badgeClass = color ? `${color.bg} text-white` : "bg-slate-100 text-slate-700";

  return (
    <div className="select-none">
      <div
        className={`flex items-center justify-between p-3 mb-2 rounded-lg border border-gray-100 bg-white hover:border-indigo-200 transition-all ${level > 0 ? "ml-6" : ""
          }`}
      >
        <div
          className={`flex items-center gap-3 flex-1 ${!isRootLayer && hasChildren ? "cursor-pointer" : ""}`}
          onClick={toggleSelf}
          role={!isRootLayer && hasChildren ? "button" : undefined}
          aria-expanded={!isRootLayer && hasChildren ? effectiveOpen : undefined}
          aria-controls={!isRootLayer && hasChildren ? childrenId : undefined}
        >
          {!isRootLayer && hasChildren ? (
            <ChevronRight
              size={16}
              className={`text-gray-400 transition-transform duration-500 ease-[cubic-bezier(.2,.9,.2,1)] will-change-transform motion-reduce:transition-none ${effectiveOpen ? "rotate-90" : "rotate-0"}`}
            />
          ) : (
            <div className="w-4" />
          )}

          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${badgeClass}`}>{node.layer}</span>

          <span className="font-medium text-gray-900">{node.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {isRootLayer && hasChildren && onExpandToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpandToggle();
              }}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title={defaultOpen ? "Collapse all" : "Expand all"}
              aria-label={defaultOpen ? "Collapse all categories" : "Expand all categories"}
              type="button"
            >
              {defaultOpen ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSub({ mode: "create", categoryCreateParentId: node.id, categoryCreateLayer: node.layer });
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

      {hasChildren && (
        <div
          id={childrenId}
          className={`ml-5 pl-2 border-l-2 border-gray-100 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.9,.2,1)] will-change-[grid-template-rows] motion-reduce:transition-none ${effectiveOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
        >
          <div className="overflow-hidden">
            <div
              className={`transform transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.9,.2,1)] will-change-[opacity,transform] motion-reduce:transition-none ${effectiveOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
            >
              {node.children.map((child) => (
                <CategoryItem
                  key={child.id}
                  node={child}
                  level={level + 1}
                  onAddSub={(payload: HandleSubCategory) => onAddSub(payload)}
                  onDelete={onDelete}
                  defaultOpen={defaultOpen}
                  controlledOpen={isRootLayer ? (layer2OpenMap[child.id] ?? defaultOpen) : undefined}
                  onToggleOpen={
                    isRootLayer
                      ? (nextOpen) => setLayer2OpenMap((prev) => ({ ...prev, [child.id]: nextOpen }))
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}