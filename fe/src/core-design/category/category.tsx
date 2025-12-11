import { useMemo, useState } from "react";
import {
  CornerDownRight,
  FolderTree,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Trash2,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
};

type CategoryNode = Category & {
  children: CategoryNode[];
};

type CategoryTreeItemProps = {
  node: CategoryNode;
  level: number;
  onAddSub: (id: string) => void;
  onDelete: (id: string) => void;
};

const INITIAL_CATEGORIES: Category[] = [
  { id: "cat_1", name: "Electronics", parentId: null, color: "bg-blue-100 text-blue-800" },
  { id: "cat_1_1", name: "Computers", parentId: "cat_1", color: "bg-blue-50 text-blue-700" },
  { id: "cat_1_1_1", name: "Laptops", parentId: "cat_1_1", color: "bg-blue-50 text-blue-600" },
  { id: "cat_1_1_1_1", name: "Gaming", parentId: "cat_1_1_1", color: "bg-blue-50 text-blue-600" },
  { id: "cat_1_2", name: "Audio", parentId: "cat_1", color: "bg-blue-50 text-blue-700" },
  { id: "cat_2", name: "Groceries", parentId: null, color: "bg-green-100 text-green-800" },
  { id: "cat_2_1", name: "Fresh Produce", parentId: "cat_2", color: "bg-green-50 text-green-700" },
  { id: "cat_3", name: "Clothing", parentId: null, color: "bg-purple-100 text-purple-800" },
];

const COLOR_OPTIONS = [
  { label: "Blue", value: "bg-blue-100 text-blue-800" },
  { label: "Green", value: "bg-green-100 text-green-800" },
  { label: "Purple", value: "bg-purple-100 text-purple-800" },
  { label: "Orange", value: "bg-orange-100 text-orange-800" },
  { label: "Red", value: "bg-red-100 text-red-800" },
  { label: "Gray", value: "bg-gray-100 text-gray-800" },
];

const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
  const map: Record<string, CategoryNode> = {};
  const tree: CategoryNode[] = [];

  categories.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat.id]);
    } else {
      tree.push(map[cat.id]);
    }
  });

  return tree;
};

const getAllChildIds = (categoryId: string, allCategories: Category[]): string[] => {
  let ids: string[] = [categoryId];
  const directChildren = allCategories.filter((c) => c.parentId === categoryId);
  directChildren.forEach((child) => {
    ids = [...ids, ...getAllChildIds(child.id, allCategories)];
  });
  return ids;
};

const CategoryTreeItem = ({ node, level, onAddSub, onDelete }: CategoryTreeItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center justify-between p-3 mb-2 rounded-lg border border-gray-100 bg-white hover:border-indigo-200 transition-all ${level > 0 ? "ml-6" : ""}`}
      >
        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {hasChildren ? (
            isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
          ) : (
            <div className="w-4" />
          )}

          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${node.color || "bg-gray-100 text-gray-600"}`}>
            L{level + 1}
          </span>

          <span className="font-medium text-gray-900">{node.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSub(node.id);
            }}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors text-xs flex items-center gap-1"
            title="Add Subcategory"
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
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="border-l-2 border-gray-100 ml-5 pl-2">
          {node.children.map((child) => (
            <CategoryTreeItem key={child.id} node={child} level={level + 1} onAddSub={onAddSub} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoriesView = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [newCategory, setNewCategory] = useState({ name: "", color: COLOR_OPTIONS[0].value, parentId: "" });
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const parentName = newCategory.parentId ? categories.find((c) => c.id === newCategory.parentId)?.name : "Root (Top Level)";

  const handleCreateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const category: Category = {
      id: `cat_${Date.now()}`,
      name: newCategory.name.trim(),
      color: newCategory.color,
      parentId: newCategory.parentId ? newCategory.parentId : null,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", color: COLOR_OPTIONS[0].value, parentId: "" });
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (id: string) => {
    const idsToDelete = getAllChildIds(id, categories);
    setCategories(categories.filter((c) => !idsToDelete.includes(c.id)));
  };

  const openAddSubCategory = (parentId: string) => {
    setNewCategory({ ...newCategory, parentId });
    setIsAddingCategory(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Hierarchy</h1>
          <p className="text-gray-500">Manage nested categories up to 5+ layers</p>
        </div>
        <button
          onClick={() => {
            setNewCategory({ ...newCategory, parentId: "" });
            setIsAddingCategory(true);
          }}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          Add Root Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-2">
          {categoryTree.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No categories yet. Start by adding one!</p>
            </div>
          ) : (
            categoryTree.map((node) => (
              <CategoryTreeItem key={node.id} node={node} level={0} onAddSub={openAddSubCategory} onDelete={handleDeleteCategory} />
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
              <li>Click <strong>Sub</strong> to add a child category instantly.</li>
              <li>You can nest as deep as you want (Layer 1 to Layer 5+).</li>
              <li>Items in sub-categories will appear when filtering by the parent.</li>
            </ul>
          </div>
        </div>
      </div>

      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">{newCategory.parentId ? "Add Subcategory" : "Add Root Category"}</h3>
              <button onClick={() => setIsAddingCategory(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              {newCategory.parentId && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-center gap-2">
                  <CornerDownRight size={16} />
                  Adding inside: <span className="font-bold text-gray-900">{parentName}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Laptops"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Tag</label>
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.label}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                      className={`h-8 rounded-md flex items-center justify-center border transition-all ${color.value} ${
                        newCategory.color === color.value ? "ring-2 ring-offset-2 ring-gray-400 border-transparent" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;