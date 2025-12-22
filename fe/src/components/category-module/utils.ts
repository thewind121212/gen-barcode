import type { CategoryNode, FlatCategory } from "@Jade/core-design/categoryTreeItem/CategoryTreeItem";

export interface HandleSubCategory {
    mode: "create" | "edit";
    categoryEditId?: string;
    categoryCreateParentId: string;
    categoryCreateLayer: string;
    categoryCreateName: string;
}


export function buildCategoryTree(categories: FlatCategory[]): CategoryNode[] {
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
}

export function getAllChildIds(categoryId: string, allCategories: FlatCategory[]): string[] {
    let ids: string[] = [categoryId];
    const directChildren = allCategories.filter((c) => c.parentId === categoryId);
    directChildren.forEach((child) => {
        ids = [...ids, ...getAllChildIds(child.id, allCategories)];
    });
    return ids;
}


