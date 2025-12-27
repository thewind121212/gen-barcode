import { Briefcase, ChevronDown, Package, Settings, Truck, Users } from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "@Jade/components/product-module/CreateProduct/utils";

export function CreateProductSidebar({
  activeSection,
  showAdvanced,
  onScrollTo,
}: {
  activeSection: string;
  showAdvanced: boolean;
  onScrollTo: (e: MouseEvent, id: string) => void;
}) {
  return (
    <div className="col-span-12 md:col-span-3 md:sticky md:top-24 md:border-r md:border-gray-200 dark:md:border-slate-800 md:pr-6">
      <nav className="space-y-1">
        {/* Required Sections */}
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Required
        </div>
        <a
          href="#basic-details"
          onClick={(e) => onScrollTo(e, "basic-details")}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all border cursor-pointer",
            activeSection === "basic-details"
              ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-sm"
              : "bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-transparent hover:bg-white hover:border-indigo-100 dark:hover:bg-slate-800"
          )}
        >
          <Package
            size={18}
            className={cn(
              activeSection === "basic-details"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400"
            )}
          />
          Basic Details
        </a>

        {/* Optional Sections */}
        <div className="px-3 py-2 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Optional
        </div>
        <a
          href="#advanced"
          onClick={(e) => onScrollTo(e, "advanced")}
          className={cn(
            "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all border cursor-pointer",
            activeSection === "advanced"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-gray-200 dark:border-slate-700 shadow-sm"
              : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Settings size={18} />
            Advanced
          </div>
          <ChevronDown
            size={14}
            className={cn("transition-transform", showAdvanced ? "rotate-180" : "")}
          />
        </a>

        <a
          href="#shipping"
          onClick={(e) => onScrollTo(e, "shipping")}
          className={cn(
            "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer",
            activeSection === "shipping"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Truck size={18} />
            Logistics
          </div>
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-slate-500 border border-gray-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
            DEV
          </span>
        </a>

        <a
          href="#wholesale"
          onClick={(e) => onScrollTo(e, "wholesale")}
          className={cn(
            "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer",
            activeSection === "wholesale"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Briefcase size={18} />
            Wholesale
          </div>
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-slate-500 border border-gray-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
            DEV
          </span>
        </a>

        <a
          href="#commission"
          onClick={(e) => onScrollTo(e, "commission")}
          className={cn(
            "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer",
            activeSection === "commission"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Users size={18} />
            Commission
          </div>
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-slate-500 border border-gray-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
            DEV
          </span>
        </a>
      </nav>
    </div>
  );
}


