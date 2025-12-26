import type { ComponentType, ReactNode } from "react";
import { Construction } from "lucide-react";

export function UnderDevelopmentSection({
  id,
  title,
  Icon,
  children,
}: {
  id: string;
  title: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden scroll-mt-24 opacity-80"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
        <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 flex items-center gap-3">
          <Construction className="text-amber-500" size={20} />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Feature Under Development
          </span>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex items-center gap-2">
        <Icon className="text-indigo-600 dark:text-indigo-400" size={18} />
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
      </div>

      {children ? (
        <div className="p-6 pointer-events-none select-none filter blur-[2px]">{children}</div>
      ) : (
        <div className="p-6 pointer-events-none select-none filter blur-[2px] h-32" />
      )}
    </section>
  );
}


