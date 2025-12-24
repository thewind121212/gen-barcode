const CategorySkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg shadow-sm">
      <div className="p-8 space-y-6 animate-pulse">

        {/* Top Grid: Name and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Category Field */}
          <div className="space-y-3">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-[46px] w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl"></div>
          </div>

          {/* Status Field */}
          <div className="space-y-3">
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-[46px] w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl"></div>
          </div>
        </div>

        {/* Middle Section: Parent Select and Description */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-[46px] w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl"></div>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-24 w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl"></div>
          </div>
        </div>

        {/* Bottom Grid: Color Tag and Icon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Color Tag Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-3.5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                ))}
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-100 dark:border-slate-800"></div>
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-3.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="flex items-end gap-4">
              <div className="size-[42px] rounded-xl bg-slate-100 dark:bg-slate-800"></div>
              <div className="h-10 w-24 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"></div>
              <div className="h-10 w-28 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategorySkeleton;