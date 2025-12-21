import { useEffect, useMemo, useState } from "react";
import { FolderTree, Plus } from "lucide-react";
import { ModalId, useModal } from "@Jade/core-design/modal/useModal";
import CategoryItem from "@Jade/components/category-module/CategoryItem";
import CreateNestedCategoryDialog from "@Jade/components/category-module/CreateNestedCategoryDialog";
import { buildCategoryTree, getAllChildIds, type CategoryNode, type FlatCategory } from "@Jade/core/category/categoryTree";

const INITIAL_CATEGORIES: FlatCategory[] = [
  { id: "cat_1", name: "Electronics", parentId: null, colorId: "blue-400" },
  { id: "cat_1_1", name: "Computers", parentId: "cat_1", colorId: "sky-400" },
  { id: "cat_1_1_1", name: "Laptops", parentId: "cat_1_1", colorId: "indigo-400" },
  { id: "cat_1_1_1_1", name: "Gaming", parentId: "cat_1_1_1", colorId: "violet-400" },
  { id: "cat_1_2", name: "Audio", parentId: "cat_1", colorId: "cyan-400" },
  { id: "cat_2", name: "Groceries", parentId: null, colorId: "green-400" },
  { id: "cat_2_1", name: "Fresh Produce", parentId: "cat_2", colorId: "lime-400" },
  { id: "cat_3", name: "Clothing", parentId: null, colorId: "purple-400" },
];

type NestedCategoriesViewProps = {
  /** If provided, render only this category as the root (with all its descendants). */
  rootId?: string;
  /** Expand all nodes by default (dropdown all). */
  expandAll?: boolean;
  /** Show/hide the header (useful when embedding inside CategoryDetail page). */
  showHeader?: boolean;
};

function findNodeById(nodes: CategoryNode[], id: string): CategoryNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found: CategoryNode | undefined = findNodeById(node.children, id);
    if (found) return found;
  }
  return undefined;
}

export default function NestedCategoriesView({ rootId, expandAll = false, showHeader = true }: NestedCategoriesViewProps) {
  const [categories, setCategories] = useState<FlatCategory[]>(INITIAL_CATEGORIES);

  const [createTarget, setCreateTarget] = useState<{ parentId: string | null } | null>(null);
  const mainModal = useModal(ModalId.MAIN);

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const treeToRender = useMemo(() => {
    if (!rootId) return categoryTree;
    const rootNode = findNodeById(categoryTree, rootId);
    return rootNode ? [rootNode] : [];
  }, [categoryTree, rootId]);

  // Dummy detail support: if we navigate to /categories/:id and it doesn't exist in our dummy list,
  // seed a dummy root + a few descendants so the page isn't empty.
  useEffect(() => {
    if (!rootId) return;
    const exists = categories.some((c) => c.id === rootId);
    if (exists) return;

    setCategories((prev) => [
      ...prev,
      { id: rootId, name: "Selected Category", parentId: null, colorId: "indigo-400" },
      { id: `${rootId}_sub_1`, name: "Sub Category A", parentId: rootId, colorId: "blue-400" },
      { id: `${rootId}_sub_2`, name: "Sub Category B", parentId: rootId, colorId: "green-400" },
      { id: `${rootId}_sub_1_1`, name: "Level 3 - A1", parentId: `${rootId}_sub_1`, colorId: "violet-400" },
      { id: `${rootId}_sub_1_1_1`, name: "Level 4 - A1a", parentId: `${rootId}_sub_1_1`, colorId: "purple-400" },
    ]);
  }, [categories, rootId]);
  const parentName = useMemo(() => {
    if (!createTarget?.parentId) return undefined;
    return categories.find((c) => c.id === createTarget.parentId)?.name;
  }, [categories, createTarget?.parentId]);

  const handleDeleteCategory = (id: string) => {
    const idsToDelete = getAllChildIds(id, categories);
    setCategories(categories.filter((c) => !idsToDelete.includes(c.id)));
  };

  const openCreate = (parentId: string | null) => {
    setCreateTarget({ parentId });
    mainModal.open();
  };

  const handleCreateLocal = (payload: { name: string; colorId: string; parentId: string | null }) => {
    const category: FlatCategory = {
      id: `cat_${Date.now()}`,
      name: payload.name,
      parentId: payload.parentId,
      colorId: payload.colorId,
    };
    setCategories((prev) => [...prev, category]);
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories Hierarchy</h1>
            <p className="text-gray-500">Manage nested categories up to 5+ layers</p>
          </div>
          <button
            onClick={() => openCreate(null)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            type="button"
          >
            <Plus size={18} />
            Add Root Category
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-2">
          {treeToRender.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No categories yet. Start by adding one!</p>
            </div>
          ) : (
            treeToRender.map((node) => (
              <CategoryItem
                key={node.id}
                node={node}
                level={0}
                onAddSub={(id) => openCreate(id)}
                onDelete={handleDeleteCategory}
                defaultOpen={expandAll}
              />
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <FolderTree size={20} />
              Structure Tips
            </h3>
            <ul className="text-sm text-indigo-800 space-y-2 list-disc pl-4">
              <li>Click the <strong>Arrow</strong> to expand folders.</li>
              <li>Click <strong>Sub</strong> to add a child category.</li>
              <li>You can nest as deep as you want (Layer 1 to Layer 5+).</li>
              <li>Later we’ll replace this dummy list with API data.</li>
            </ul>
          </div>
        </div>
      </div>

      <CreateNestedCategoryDialog
        mainModal={mainModal}
        parentId={createTarget?.parentId ?? null}
        parentName={parentName}
        onCreate={handleCreateLocal}
      />
    </div>
  );
}


