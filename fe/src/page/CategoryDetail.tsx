import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import NestedCategoriesView from "@Jade/core/category/NestedCategoriesView";

export default function CategoryDetail() {
  const { id } = useParams();
  const categoryId = useMemo(() => (id ? decodeURIComponent(id) : ""), [id]);

  return (
    <div className="space-y-6 pt-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <Link className="hover:underline" to="/categories">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <span
              className="font-semibold text-slate-700 dark:text-slate-200 font-mono"
              title={categoryId || "Unknown"}
            >
              {categoryId || "Unknown"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Category Detail</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Name: <span className="font-mono">Ao</span>
          </p>
        </div>
      </div>

      <NestedCategoriesView rootId={categoryId} showHeader={false} />
    </div>
  );
}


