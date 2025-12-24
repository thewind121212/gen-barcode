import { useCategoryModuleStore } from "@Jade/components/category-module/store";
import { buildCategoryTree, type HandleSubCategory } from "@Jade/components/category-module/utils";
import type { ActionMenuItem } from "@Jade/core-design/card/active-menu/ActiveMenu";
import CategoryItem, { type CategoryNode, type FlatCategory } from "@Jade/core-design/categoryTreeItem/CategoryTreeItem";
import { ConfirmModal } from "@Jade/core-design/modal/ConfirmModal";
import { ModalId, useModal } from "@Jade/core-design/modal/useModal";
import { useGetCategoryTree, useRemoveCategory } from "@Jade/services/category/useQuery";
import type { RootState } from "@Jade/store/global.store";
import type { CategoryResponse } from "@Jade/types/category.d";
import { Edit2Icon, FolderTree, Plus, Trash2Icon } from "lucide-react";
import { lazy, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NIL as NIL_UUID } from "uuid";
import CategoryTreeSkeleton from "./CategoryTreeSkeleton";
import { useTranslation, Trans } from "react-i18next";
const CreateCategoryDialog = lazy(() => import('@Jade/components/category-module/CreateCategoryDialog'));

const DEFAULT_EXPAND_ALL = false;

type NestedCategoriesViewProps = {
  rootId?: string;
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

export default function NestedCategoriesView({ rootId, showHeader = true }: NestedCategoriesViewProps) {
  const { t } = useTranslation('category');
  const [expandedAll, setExpandedAll] = useState<boolean>(DEFAULT_EXPAND_ALL);
  const [autoOpenPathIds, setAutoOpenPathIds] = useState<string[]>([]);
  const mainModal = useModal(ModalId.CREATE_CATEGORY_FROM_TREE);
  const confirmModal = useModal(ModalId.CONFIRM);
  const setCreateCategoryModalData = useCategoryModuleStore((s) => s.setCreateCategoryModalData);
  const activeMenuId = useCategoryModuleStore((s) => s.categories.activeMenuId);
  const setActiveMenuId = useCategoryModuleStore((s) => s.setActiveMenuId);
  const storeInfo = useSelector((state: RootState) => state.app);
  const { rootCategoryId } = useParams();
  const lastCategoryTreeErrorRef = useRef<string | null>(null);
  const setCategoryToDelete = useCategoryModuleStore((s) => s.setCategoryToDelete);
  const categoryToDelete = useCategoryModuleStore((s) => s.categories.categoryToDelete);
  const prevCategoryIdsRef = useRef<Set<string>>(new Set());


  const MENU_ACTIONS: ActionMenuItem[] = [
    {
      label: t('edit'),
      onClick: (id: string) => { handleCreateCategoryDialog({ mode: "EDIT", categoryEditId: id, categoryCreateParentId: undefined }) },
      icon: Edit2Icon,
    },
    {
      label: t('delete'),
      onClick: (id: string) => {
        setCategoryToDelete(id);
        confirmModal.open();
      },
      icon: Trash2Icon,
      danger: true,
    },
  ];



  const categoryTreeRequest = useMemo(() => ({
    categoryId: rootCategoryId ?? "",
  }), [rootCategoryId]);

  const {
    data: getCategoryTree,
    error: getCategoryTreeError,
    isPending: getCategoryTreeLoading,
    refetch: refetchGetCategoryTree,
  } = useGetCategoryTree(
    categoryTreeRequest,
    storeInfo?.storeId ?? "",
    { enabled: Boolean(rootCategoryId && storeInfo?.storeId) },
  );


  const { mutate: removeCategory } = useRemoveCategory({
    storeId: storeInfo?.storeId,
    onSuccess: () => {
      toast.success(t('categoryRemoved'));
      refetchGetCategoryTree();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const apiCategories = useMemo<FlatCategory[] | null>(() => {
    const tree: CategoryResponse[] = getCategoryTree?.data?.categoryTree ?? [];
    const mapped: FlatCategory[] = tree
      .filter((c) => Boolean(c.categoryId))
      .map((c) => ({
        id: c.categoryId ?? "",
        name: c.name ?? "Unnamed",
        parentId: c.parentId && c.parentId !== NIL_UUID ? c.parentId : null,
        colorId: c.colorSettings ?? "slate-400",
        layer: c.layer ?? "1",
      }));
    return mapped.length ? mapped : null;
  }, [getCategoryTree]);

  const categories = useMemo(() => apiCategories ?? [], [apiCategories]);


  useEffect(() => {
    if (!getCategoryTreeError) {
      lastCategoryTreeErrorRef.current = null;
      return;
    }
    const message = getCategoryTreeError.message;
    if (lastCategoryTreeErrorRef.current === message) {
      return;
    }
    lastCategoryTreeErrorRef.current = message;
    toast.error(message, { id: "get-category-tree-error" });
  }, [getCategoryTreeError]);

  const derivedCategories = useMemo(() => {
    if (!rootId) return categories;
    if (categories.some((c) => c.id === rootId)) return categories;
    return [...categories];
  }, [categories, rootId]);

  // Detect newly created categories (after refetch) and auto-open the path to reveal them in the tree.
  useEffect(() => {
    const ids = derivedCategories.map((c) => c.id);

    if (prevCategoryIdsRef.current.size === 0) {
      prevCategoryIdsRef.current = new Set(ids);
      return;
    }

    const prevIds = prevCategoryIdsRef.current;
    const newIds = ids.filter((id) => !prevIds.has(id));
    prevCategoryIdsRef.current = new Set(ids);

    if (newIds.length === 0) return;
    const newId = newIds[0];

    const parentById = new Map(derivedCategories.map((c) => [c.id, c.parentId]));
    const path: string[] = [];
    let cur: string | null | undefined = newId;
    // Walk up parent chain including the new node and its ancestors.
    while (cur) {
      path.push(cur);
      cur = parentById.get(cur) ?? null;
    }
    const raf = requestAnimationFrame(() => setAutoOpenPathIds(path));
    return () => cancelAnimationFrame(raf);
  }, [derivedCategories]);

  const categoryTree = useMemo(() => buildCategoryTree(derivedCategories), [derivedCategories]);
  const treeToRender = useMemo(() => {
    if (!rootId) return categoryTree;
    const rootNode = findNodeById(categoryTree, rootId);
    return rootNode ? [rootNode] : [];
  }, [categoryTree, rootId]);


  const handleCreateCategoryDialog = (payload: HandleSubCategory) => {
    if (payload.mode !== "CREATE" && payload.mode !== "EDIT" && payload.mode !== "CREATE_NEST") {
      toast.error(t('invalidMode'));
      return
    }
    if (payload.categoryCreateParentId === null || payload.categoryCreateParentId === NIL_UUID) {
      toast.error(t('parentIdRequired'));
      return
    }
    // The add layer create so we need to add plus one to current layer to next layer
    if (payload.categoryCreateParentId === undefined && payload.mode === "CREATE_NEST") {
      toast.error(t('parentIdRequired'));
      return
    }
    setCreateCategoryModalData({
      mode: payload.mode,
      categoryEditId: (payload.mode === "EDIT" || payload.mode === "CREATE_NEST") ? (payload.categoryEditId ?? null) : null,
      categoryCreateParentId: payload.categoryCreateParentId ?? null,
    });
    mainModal.open();
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('categoriesHierarchy')}</h1>
            <p className="text-gray-500">{t('manageNestedCategories')}</p>
          </div>
          <button
            onClick={() => { }}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            type="button"
          >
            <Plus size={18} />
            {t('addRootCategory')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-2">
          {getCategoryTreeLoading ? (
            <CategoryTreeSkeleton />
          ) : treeToRender.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">{t('noCategoriesTree')}</p>
            </div>
          ) : (
            treeToRender.map((node) => (
              <CategoryItem
                key={node.id}
                node={node}
                onAddSub={(payload: HandleSubCategory) => handleCreateCategoryDialog(payload)}
                onDelete={() => { }}
                level={0}
                defaultOpen={expandedAll}
                onExpandToggle={() => setExpandedAll((prev) => !prev)}
                menuActions={MENU_ACTIONS}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                autoOpenPathIds={autoOpenPathIds}
              />
            ))
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <FolderTree size={20} />
              {t('structureTips')}
            </h3>
            <ul className="text-sm text-indigo-800 space-y-2 list-disc pl-4">
              <li>
                <Trans i18nKey="tipExpand" components={{ 1: <strong /> }} />
              </li>
              <li>
                <Trans i18nKey="tipSub" components={{ 1: <strong /> }} />
              </li>
              <li>{t('tipNest')}</li>
              <li>{t('tipData')}</li>
            </ul>
          </div>
        </div>
        <CreateCategoryDialog
          mainModal={mainModal}
          onCategoryCreatedCallback={refetchGetCategoryTree}
        />
        <ConfirmModal
          modal={confirmModal}
          title={t('deleteCategoryTitle')}
          subtitle={t('deleteCategorySubtitle')}
          isLoading={false}
          cancelButtonText={t('cancel')}
          confirmButtonText={t('delete')}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={() => {
            if (!categoryToDelete)
              return;
            removeCategory({ categoryIds: [categoryToDelete] });
            confirmModal.close();
            setCategoryToDelete(null);
          }}
        >
          {t('deleteCategoryConfirm')}
        </ConfirmModal>
      </div>
    </div>
  );
}

