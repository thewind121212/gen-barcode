import { ArrowLeft, Save } from "lucide-react";
import CommonButton from "@Jade/core-design/input/CommonButton";

export function CreateProductHeader({
  onDiscard,
  onSave,
  isSaving,
}: {
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <header className="fixed w-full left-0 pl-[79px] top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onDiscard}
            className="p-2 -ml-2 text-slate-500 hover:bg-gray-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Create New Product</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Start creating your product</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block" />
          <CommonButton
            className="hidden sm:flex w-auto! py-2! px-4! rounded-lg! text-sm! font-medium! bg-transparent! text-slate-600! shadow-none! hover:bg-gray-100! hover:shadow-none! dark:hover:bg-slate-800!"
            onClick={onDiscard}
          >
            Discard
          </CommonButton>
          <CommonButton
            className="w-auto! py-2! px-4! rounded-lg! text-sm! font-semibold! shadow-sm!"
            icon={<Save size={18} />}
            iconPosition="right"
            onClick={onSave}
            loading={isSaving}
          >
            Save Product
          </CommonButton>
        </div>
      </div>
    </header>
  );
}


