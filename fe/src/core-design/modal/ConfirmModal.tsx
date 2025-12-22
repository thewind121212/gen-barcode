import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import Modal from "@Jade/core-design/modal/ModalBase";
import type { UseModalReturn } from "@Jade/core-design/modal/useModal";

type ConfirmModalProps = {
  modal: UseModalReturn;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  children?: ReactNode;
};

export const ConfirmModal = ({
  modal,
  title,
  subtitle,
  children,
  onClose,
  onConfirm,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  isLoading = false,
}: ConfirmModalProps) => {
  const handleClose = () => {
    onClose?.();
    modal.close();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Modal
      modalId={modal.modalId}
      isOpen={modal.isOpen}
      isClosing={modal.isClosing}
      layer={modal.layer}
      onClose={handleClose}
      title=""
      xIcon={false}
      blurEffect={true}
      hideHeader={true}
      maxWidthClass="max-w-sm"
      showCancelButton={true}
      showConfirmButton={true}
      confirmButtonText={confirmButtonText}
      confirmButtonClassName="bg-red-600! hover:bg-red-700! text-white! dark:text-white!"
      cancelButtonText={cancelButtonText}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      footerClassName="py-4!"
    >
      <div className="p-6 text-center">
        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-900 shadow-sm">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {subtitle}
          </p>
        ) : null}
        {children ? (
          <div className={`${subtitle ? "mt-3" : ""} text-sm text-gray-600 dark:text-gray-300 leading-relaxed`}>
            {children}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

// Backwards compatible export (older name)
export const DeleteConfirmationModal = ConfirmModal;