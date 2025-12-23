import React from "react";

type CategoryTreeItemSkeletonProps = {
  level?: number;
  children?: React.ReactNode;
};

export function CategoryTreeItemSkeleton({
  level = 0,
  children,
}: CategoryTreeItemSkeletonProps) {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center justify-between p-3 mb-2 min-h-[62px] rounded-lg border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 ${
          level > 0 ? "ml-6" : ""
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Chevron placeholder */}
          <div className={`w-4 h-4 shrink-0 rounded ${hasChildren ? "bg-gray-200 dark:bg-gray-700" : ""} animate-pulse`} />

          {/* Layer badge placeholder */}
          <div className="w-8 h-5 shrink-0 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />

          {/* Name placeholder */}
          <div className="w-32 h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          {/* Actions placeholders */}
          <div className="w-7 h-7 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-7 h-7 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>

      {hasChildren && (
        <div className="ml-5 pl-2 border-l-2 border-gray-200 dark:border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}

export default function CategoryTreeSkeleton() {
  return (
    <div className="w-full pointer-events-none">
      <CategoryTreeItemSkeleton level={0} >
        <CategoryTreeItemSkeleton level={1} />
        <CategoryTreeItemSkeleton level={1} >
             <CategoryTreeItemSkeleton level={2} />
             <CategoryTreeItemSkeleton level={2} />
        </CategoryTreeItemSkeleton>
        <CategoryTreeItemSkeleton level={1} />
      </CategoryTreeItemSkeleton>
      
      <CategoryTreeItemSkeleton level={0} />
      
       <CategoryTreeItemSkeleton level={0} >
        <CategoryTreeItemSkeleton level={1} />
      </CategoryTreeItemSkeleton>
    </div>
  );
}
