export type CategoryListSkeletonProps = {
  viewMode: "grid" | "list";
  count?: number;
};

const CategoryListSkeleton = ({ viewMode, count }: CategoryListSkeletonProps) => {
  const items = Array.from({
    length: count ?? (viewMode === "grid" ? 4 : 6),
  });

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col space-y-3"}>
      {items.map((_, idx) => (
        <div
          key={`${viewMode}-${idx}`}
          className={`bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 ${viewMode === "grid"
            ? "p-4 rounded-xl shadow-sm"
            : "p-3 rounded-lg flex items-center shadow-sm"
            }`}
        >
          <div className="w-full animate-pulse">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="min-w-0">
                  <div className="h-4 w-40 max-w-[60vw] bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="mt-2 h-3 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800" />
            </div>

            {viewMode === "grid" && (
              <>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-12 rounded bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800" />
                  <div className="h-12 rounded bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-6 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-6 w-28 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryListSkeleton;


