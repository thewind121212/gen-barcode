import { useMemo, useState } from "react";
import { FolderTree, Plus } from "lucide-react";
import { ModalId, useModal } from "@Jade/core-design/modal/useModal";
import CategoryItem from "@Jade/components/category-module/CategoryItem";
import { buildCategoryTree, getAllChildIds, type CategoryNode, type FlatCategory } from "@Jade/core/category/categoryTree";

// Dummy data: realistic Vietnamese retail/business category tree (multi-level)
const INITIAL_CATEGORIES: FlatCategory[] = [
  // Tạp hoá / FMCG
  { id: "4b0e8e2d-8c55-4c8e-9f2c-0f7e8d1ac7c1", name: "Tạp hoá & Hàng tiêu dùng", parentId: null, colorId: "indigo-400", layer: "1" },
  { id: "f2a36c3d-5b11-4a9d-8f5b-1e2f1b7c0a11", name: "Đồ uống", parentId: "4b0e8e2d-8c55-4c8e-9f2c-0f7e8d1ac7c1", colorId: "blue-400", layer: "2" },
  { id: "9a98b7f1-38d7-4ccf-8de9-4f6b6f9c3f10", name: "Nước ngọt", parentId: "f2a36c3d-5b11-4a9d-8f5b-1e2f1b7c0a11", colorId: "cyan-400", layer: "3" },
  { id: "c6b19ac9-9d7b-4c2e-8c2c-9e4bb5c4f2a2", name: "Nước suối", parentId: "f2a36c3d-5b11-4a9d-8f5b-1e2f1b7c0a11", colorId: "sky-400", layer: "3" },
  { id: "0a5c2f8a-3df0-4d73-9a02-8c7c9db90a6b", name: "Trà & cà phê", parentId: "f2a36c3d-5b11-4a9d-8f5b-1e2f1b7c0a11", colorId: "emerald-400", layer: "3" },
  { id: "4a5b0b27-0bb1-4d1f-9a41-3d5d9cc6b711", name: "Cà phê", parentId: "0a5c2f8a-3df0-4d73-9a02-8c7c9db90a6b", colorId: "green-400", layer: "4" },
  { id: "e4d0f8a4-6f74-4c5a-80e6-69df2ef4a51d", name: "Cà phê hoà tan", parentId: "4a5b0b27-0bb1-4d1f-9a41-3d5d9cc6b711", colorId: "lime-400", layer: "5" },
  { id: "6e8bbf6b-3103-47b1-a8ea-8c3d61a3ef0f", name: "Cà phê rang xay", parentId: "4a5b0b27-0bb1-4d1f-9a41-3d5d9cc6b711", colorId: "amber-400", layer: "5" },

  { id: "7b5c07f0-4b20-4e6e-9e08-5fd0f5e5a8c9", name: "Thực phẩm khô", parentId: "4b0e8e2d-8c55-4c8e-9f2c-0f7e8d1ac7c1", colorId: "orange-400", layer: "2" },
  { id: "f0ad7db0-8f1a-4f98-9fb7-14a3c9c4b8c0", name: "Mì, bún, phở", parentId: "7b5c07f0-4b20-4e6e-9e08-5fd0f5e5a8c9", colorId: "yellow-400", layer: "3" },
  { id: "2cde9a6e-4d6f-4b34-9a23-41c0f3e6c901", name: "Gia vị", parentId: "7b5c07f0-4b20-4e6e-9e08-5fd0f5e5a8c9", colorId: "red-400", layer: "3" },
  { id: "b9cc1f1d-53d0-43b0-9b20-99e0b6b2b1aa", name: "Nước mắm", parentId: "2cde9a6e-4d6f-4b34-9a23-41c0f3e6c901", colorId: "rose-400", layer: "4" },
  { id: "6c7b0c2f-2c3d-4c4d-8e2f-9c1b2e3f4a5b", name: "Nước tương", parentId: "2cde9a6e-4d6f-4b34-9a23-41c0f3e6c901", colorId: "purple-400", layer: "4" },

  { id: "f1e2d3c4-b5a6-4789-90ab-cdef12345678", name: "Hóa mỹ phẩm", parentId: "4b0e8e2d-8c55-4c8e-9f2c-0f7e8d1ac7c1", colorId: "violet-400", layer: "2" },
  { id: "a6d1f66b-8c2a-4f3a-9b2a-6b1d2c3e4f50", name: "Giặt xả", parentId: "f1e2d3c4-b5a6-4789-90ab-cdef12345678", colorId: "blue-500", layer: "3" },
  { id: "b1a2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", name: "Tắm gội", parentId: "f1e2d3c4-b5a6-4789-90ab-cdef12345678", colorId: "pink-400", layer: "3" },
  { id: "c2b3a4d5-e6f7-4b8c-9d0e-1f2a3b4c5d6e", name: "Kem đánh răng", parentId: "f1e2d3c4-b5a6-4789-90ab-cdef12345678", colorId: "slate-400", layer: "3" },

  // Nhà thuốc
  { id: "7c5f2bde-1b9c-4a04-9ab1-f46a02c8ffba", name: "Nhà thuốc", parentId: null, colorId: "green-500", layer: "1" },
  { id: "3d0f6a8b-6c1e-4c62-9c2a-2b7f8d9e0a1b", name: "Thuốc không kê đơn (OTC)", parentId: "7c5f2bde-1b9c-4a04-9ab1-f46a02c8ffba", colorId: "emerald-400", layer: "2" },
  { id: "8a1b2c3d-4e5f-4a6b-8c9d-0e1f2a3b4c5e", name: "Vitamin & TPCN", parentId: "7c5f2bde-1b9c-4a04-9ab1-f46a02c8ffba", colorId: "lime-400", layer: "2" },
  { id: "9b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e", name: "Chăm sóc cá nhân", parentId: "7c5f2bde-1b9c-4a04-9ab1-f46a02c8ffba", colorId: "teal-400", layer: "2" },
  { id: "ab3c4d5e-6f7a-4c8d-9e0f-1a2b3c4d5e6f", name: "Khẩu trang & y tế", parentId: "9b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e", colorId: "cyan-400", layer: "3" },

  // Quán cà phê / F&B
  { id: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5f", name: "Quán cà phê / F&B", parentId: null, colorId: "amber-400", layer: "1" },
  { id: "2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6f", name: "Nguyên liệu", parentId: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5f", colorId: "orange-400", layer: "2" },
  { id: "3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f", name: "Topping", parentId: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5f", colorId: "pink-400", layer: "2" },
  { id: "4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a", name: "Ly, ống hút, bao bì", parentId: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5f", colorId: "slate-400", layer: "2" },
  { id: "5e6f7a8b-9c0d-4e1f-2a3b-4c5d6e7f8a9b", name: "Syrup", parentId: "2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6f", colorId: "violet-400", layer: "3" },
  { id: "6f7a8b9c-0d1e-4f2a-3b4c-5d6e7f8a9b0c", name: "Sữa", parentId: "2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6f", colorId: "blue-400", layer: "3" },
  { id: "7a8b9c0d-1e2f-4a3b-4c5d-6e7f8a9b0c1d", name: "Trân châu", parentId: "3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f", colorId: "purple-400", layer: "3" },
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

function seedDetailCategories(rootId: string): FlatCategory[] {
  return [
    { id: rootId, name: "Danh mục đang xem", parentId: null, colorId: "indigo-400", layer: "1" },
    // Level 2 groups (for demo)
    { id: `${rootId}_best`, name: "Nhóm hàng bán chạy", parentId: rootId, colorId: "blue-400", layer: "2" },
    { id: `${rootId}_seasonal`, name: "Sản phẩm theo mùa", parentId: rootId, colorId: "green-400", layer: "2" },
    { id: `${rootId}_new`, name: "Hàng mới về", parentId: rootId, colorId: "violet-400", layer: "2" },
    { id: `${rootId}_promo`, name: "Khuyến mãi / Flash Sale", parentId: rootId, colorId: "red-400", layer: "2" },
    { id: `${rootId}_brand`, name: "Theo thương hiệu", parentId: rootId, colorId: "cyan-400", layer: "2" },
    { id: `${rootId}_price`, name: "Theo mức giá", parentId: rootId, colorId: "amber-400", layer: "2" },
    { id: `${rootId}_supplier`, name: "Theo nhà cung cấp", parentId: rootId, colorId: "slate-400", layer: "2" },
    { id: `${rootId}_bundle`, name: "Combo / Set", parentId: rootId, colorId: "purple-400", layer: "2" },

    // Best sellers (L3/L4)
    { id: `${rootId}_best_drink`, name: "Đồ uống bán chạy", parentId: `${rootId}_best`, colorId: "sky-400", layer: "3" },
    { id: `${rootId}_best_snack`, name: "Bánh kẹo bán chạy", parentId: `${rootId}_best`, colorId: "orange-400", layer: "3" },
    { id: `${rootId}_best_personal`, name: "Chăm sóc cá nhân bán chạy", parentId: `${rootId}_best`, colorId: "teal-400", layer: "3" },
    { id: `${rootId}_best_drink_tea`, name: "Trà đóng chai", parentId: `${rootId}_best_drink`, colorId: "emerald-400", layer: "4" },
    { id: `${rootId}_best_drink_coffee`, name: "Cà phê lon / chai", parentId: `${rootId}_best_drink`, colorId: "yellow-400", layer: "4" },
    { id: `${rootId}_best_snack_cookie`, name: "Bánh quy", parentId: `${rootId}_best_snack`, colorId: "amber-400", layer: "4" },
    { id: `${rootId}_best_snack_candy`, name: "Kẹo", parentId: `${rootId}_best_snack`, colorId: "pink-400", layer: "4" },
    { id: `${rootId}_best_personal_tooth`, name: "Kem đánh răng", parentId: `${rootId}_best_personal`, colorId: "slate-400", layer: "4" },
    { id: `${rootId}_best_personal_shampoo`, name: "Dầu gội", parentId: `${rootId}_best_personal`, colorId: "blue-500", layer: "4" },

    // Seasonal (L3/L4)
    { id: `${rootId}_season_tet`, name: "Tết (Bánh kẹo, giỏ quà)", parentId: `${rootId}_seasonal`, colorId: "red-400", layer: "3" },
    { id: `${rootId}_season_trung_thu`, name: "Trung thu (Bánh trung thu)", parentId: `${rootId}_seasonal`, colorId: "amber-400", layer: "3" },
    { id: `${rootId}_season_he`, name: "Mùa hè (Nước giải khát)", parentId: `${rootId}_seasonal`, colorId: "cyan-400", layer: "3" },
    { id: `${rootId}_season_noel`, name: "Noel / Giáng sinh", parentId: `${rootId}_seasonal`, colorId: "green-500", layer: "3" },
    { id: `${rootId}_season_back2school`, name: "Back to school", parentId: `${rootId}_seasonal`, colorId: "indigo-500", layer: "3" },
    { id: `${rootId}_season_tet_gift`, name: "Giỏ quà", parentId: `${rootId}_season_tet`, colorId: "rose-400", layer: "4" },
    { id: `${rootId}_season_tet_candy`, name: "Bánh kẹo Tết", parentId: `${rootId}_season_tet`, colorId: "orange-400", layer: "4" },
    { id: `${rootId}_season_trung_thu_premium`, name: "Hộp cao cấp", parentId: `${rootId}_season_trung_thu`, colorId: "purple-400", layer: "4" },
    { id: `${rootId}_season_trung_thu_normal`, name: "Hộp phổ thông", parentId: `${rootId}_season_trung_thu`, colorId: "yellow-400", layer: "4" },

    // New arrivals (L3/L4)
    { id: `${rootId}_new_drink`, name: "Đồ uống", parentId: `${rootId}_new`, colorId: "sky-400", layer: "3" },
    { id: `${rootId}_new_food`, name: "Thực phẩm", parentId: `${rootId}_new`, colorId: "orange-400", layer: "3" },
    { id: `${rootId}_new_personal`, name: "Hóa mỹ phẩm", parentId: `${rootId}_new`, colorId: "violet-400", layer: "3" },
    { id: `${rootId}_new_drink_energy`, name: "Nước tăng lực", parentId: `${rootId}_new_drink`, colorId: "red-500", layer: "4" },
    { id: `${rootId}_new_food_instant`, name: "Ăn liền", parentId: `${rootId}_new_food`, colorId: "amber-400", layer: "4" },
    { id: `${rootId}_new_personal_body`, name: "Sữa tắm", parentId: `${rootId}_new_personal`, colorId: "blue-400", layer: "4" },

    // Promo / Flash Sale (L3)
    { id: `${rootId}_promo_0_20`, name: "Giảm 0–20%", parentId: `${rootId}_promo`, colorId: "slate-400", layer: "3" },
    { id: `${rootId}_promo_20_40`, name: "Giảm 20–40%", parentId: `${rootId}_promo`, colorId: "orange-400", layer: "3" },
    { id: `${rootId}_promo_40_60`, name: "Giảm 40–60%", parentId: `${rootId}_promo`, colorId: "red-400", layer: "3" },
    { id: `${rootId}_promo_buy1`, name: "Mua 1 tặng 1", parentId: `${rootId}_promo`, colorId: "pink-400", layer: "3" },

    // Brand (L3/L4)
    { id: `${rootId}_brand_coke`, name: "Coca-Cola", parentId: `${rootId}_brand`, colorId: "red-500", layer: "3" },
    { id: `${rootId}_brand_pepsi`, name: "Pepsi", parentId: `${rootId}_brand`, colorId: "blue-500", layer: "3" },
    { id: `${rootId}_brand_vinamilk`, name: "Vinamilk", parentId: `${rootId}_brand`, colorId: "blue-400", layer: "3" },
    { id: `${rootId}_brand_th`, name: "TH true MILK", parentId: `${rootId}_brand`, colorId: "cyan-400", layer: "3" },
    { id: `${rootId}_brand_omo`, name: "Omo", parentId: `${rootId}_brand`, colorId: "sky-400", layer: "3" },
    { id: `${rootId}_brand_comfort`, name: "Comfort", parentId: `${rootId}_brand`, colorId: "pink-400", layer: "3" },
    { id: `${rootId}_brand_chinsu`, name: "CHIN-SU", parentId: `${rootId}_brand`, colorId: "orange-400", layer: "3" },
    { id: `${rootId}_brand_namngu`, name: "Nam Ngư", parentId: `${rootId}_brand`, colorId: "amber-400", layer: "3" },
    { id: `${rootId}_brand_coke_soda`, name: "Nước ngọt có gas", parentId: `${rootId}_brand_coke`, colorId: "red-400", layer: "4" },
    { id: `${rootId}_brand_vinamilk_milk`, name: "Sữa hộp", parentId: `${rootId}_brand_vinamilk`, colorId: "blue-400", layer: "4" },
    { id: `${rootId}_brand_omo_wash`, name: "Bột/nước giặt", parentId: `${rootId}_brand_omo`, colorId: "sky-400", layer: "4" },
    { id: `${rootId}_brand_chinsu_sauce`, name: "Nước mắm / nước tương", parentId: `${rootId}_brand_chinsu`, colorId: "orange-400", layer: "4" },

    // Price bands (L3)
    { id: `${rootId}_price_u20`, name: "Dưới 20.000đ", parentId: `${rootId}_price`, colorId: "lime-400", layer: "3" },
    { id: `${rootId}_price_20_50`, name: "20.000đ – 50.000đ", parentId: `${rootId}_price`, colorId: "emerald-400", layer: "3" },
    { id: `${rootId}_price_50_100`, name: "50.000đ – 100.000đ", parentId: `${rootId}_price`, colorId: "cyan-400", layer: "3" },
    { id: `${rootId}_price_100p`, name: "Trên 100.000đ", parentId: `${rootId}_price`, colorId: "violet-400", layer: "3" },

    // Supplier (L3/L4)
    { id: `${rootId}_supplier_dist1`, name: "Nhà phân phối A", parentId: `${rootId}_supplier`, colorId: "slate-400", layer: "3" },
    { id: `${rootId}_supplier_dist2`, name: "Nhà phân phối B", parentId: `${rootId}_supplier`, colorId: "slate-600", layer: "3" },
    { id: `${rootId}_supplier_dist1_drink`, name: "Đồ uống", parentId: `${rootId}_supplier_dist1`, colorId: "sky-400", layer: "4" },
    { id: `${rootId}_supplier_dist1_personal`, name: "Hóa mỹ phẩm", parentId: `${rootId}_supplier_dist1`, colorId: "violet-400", layer: "4" },
    { id: `${rootId}_supplier_dist2_food`, name: "Thực phẩm", parentId: `${rootId}_supplier_dist2`, colorId: "orange-400", layer: "4" },

    // Bundle / gifts (L3/L4)
    { id: `${rootId}_bundle_gift`, name: "Quà tặng kèm", parentId: `${rootId}_bundle`, colorId: "purple-400", layer: "3" },
    { id: `${rootId}_bundle_mix`, name: "Combo nhiều nhóm", parentId: `${rootId}_bundle`, colorId: "indigo-400", layer: "3" },
    { id: `${rootId}_bundle_gift_mini`, name: "Mini gift", parentId: `${rootId}_bundle_gift`, colorId: "pink-400", layer: "4" },
  ];
}

export default function NestedCategoriesView({ rootId, expandAll = false, showHeader = true }: NestedCategoriesViewProps) {
  const [categories, setCategories] = useState<FlatCategory[]>(INITIAL_CATEGORIES);

  const [createTarget, setCreateTarget] = useState<{ parentId: string | null } | null>(null);
  const mainModal = useModal(ModalId.MAIN);

  // Detail route dummy support:
  // If rootId isn't present in our dummy list, derive a seeded subtree without mutating state in an effect.
  const derivedCategories = useMemo(() => {
    if (!rootId) return categories;
    if (categories.some((c) => c.id === rootId)) return categories;
    return [...categories, ...seedDetailCategories(rootId)];
  }, [categories, rootId]);

  const categoryTree = useMemo(() => buildCategoryTree(derivedCategories), [derivedCategories]);
  const treeToRender = useMemo(() => {
    if (!rootId) return categoryTree;
    const rootNode = findNodeById(categoryTree, rootId);
    return rootNode ? [rootNode] : [];
  }, [categoryTree, rootId]);


  const handleDeleteCategory = (id: string) => {
    const idsToDelete = getAllChildIds(id, derivedCategories);
    setCategories((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
  };

  const openCreate = (parentId: string | null) => {
    setCreateTarget({ parentId });
    mainModal.open();
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
    </div>
  );
}


