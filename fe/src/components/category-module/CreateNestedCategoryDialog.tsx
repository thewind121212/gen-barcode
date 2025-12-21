import { useMemo, useState } from "react";
import Modal from "@Jade/core-design/modal/ModalBase";
import type { UseModalReturn } from "@Jade/core-design/modal/useModal";
import InputCommon from "@Jade/core-design/input/CommonInput";
import { allColors } from "@Jade/core-design/modal/colorOptions";

export type CreateNestedCategoryDialogProps = {
  mainModal: UseModalReturn;
  parentId: string | null;
  parentName?: string;
  onCreate: (payload: { name: string; colorId: string; parentId: string | null }) => void;
};

export default function CreateNestedCategoryDialog({ mainModal, parentId, parentName, onCreate }: CreateNestedCategoryDialogProps) {
  const [name, setName] = useState("");
  const [colorId, setColorId] = useState<string>(allColors.find((c) => c.id === "indigo-400")?.id ?? allColors[0]?.id ?? "slate-400");

  const color = useMemo(() => allColors.find((c) => c.id === colorId), [colorId]);

  const resetForm = () => {
    setName("");
    setColorId(allColors.find((c) => c.id === "indigo-400")?.id ?? allColors[0]?.id ?? "slate-400");
  };

  const close = () => {
    resetForm();
    mainModal.close();
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate({ name: trimmed, colorId, parentId });
    close();
  };

  return (
    <Modal
      modalId={mainModal.modalId}
      isOpen={mainModal.isOpen}
      isClosing={mainModal.isClosing}
      onClose={close}
      layer={mainModal.layer}
      maxWidthClass="max-w-2xl"
      title={parentId ? "Create Sub Category" : "Create Main Category"}
      subtitle={parentId ? `Inside: ${parentName ?? "Selected category"}` : "Create a top-level category."}
      blurEffect={true}
      onConfirm={submit}
      confirmButtonText="Create"
    >
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category Name</label>
            <InputCommon
              type="text"
              name="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="h-[46px]!"
              floatingLabel={false}
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Color Tag</label>
            <div className="flex items-center gap-3 flex-wrap">
              {allColors.slice(0, 10).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  className={`w-8 h-8 rounded-full ${c.bg} transition-all duration-200 flex items-center justify-center shadow-sm ${
                    colorId === c.id
                      ? `ring-2 ring-offset-2 scale-110 ${c.ring} ring-offset-white dark:ring-offset-slate-900`
                      : "hover:scale-110 opacity-80 hover:opacity-100"
                  }`}
                  title={c.name}
                />
              ))}
              <div className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                Selected: <span className="font-semibold">{color?.name ?? colorId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}


