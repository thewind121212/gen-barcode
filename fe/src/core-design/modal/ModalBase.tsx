import { X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';


export enum ModalId {
  MAIN = "main-category-dialog",
  COLOR = "color-picker-dialog",
  ICON = "icon-picker-dialog",
}

type ModalProps = {
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidthClass?: string;
  layer?: number;
  xIcon?: boolean;
  subtitle?: string;
  blurEffect?: boolean;
  className?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
};

export type UseModalReturn = {
  isOpen: boolean;
  isClosing: boolean;
  open: () => void;
  close: () => void;
};

const PREFIX_LAYER = "6";

const Modal = ({
  isOpen,
  isClosing = false,
  onClose,
  layer = 0,
  title,
  subtitle,
  xIcon = true,
  children,
  maxWidthClass = 'max-w-lg',
  className = '',
  blurEffect = true,
  showCancelButton = true,
  showConfirmButton = true,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm = () => {},
}: ModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const styledLayer = {
    "zIndex": `${PREFIX_LAYER}${layer?.toString()}`
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 font-sans left-0 top-0 ${className} max-h-screen`}
      style={styledLayer}
    >
      <div
        className={`absolute inset-0 bg-black/40 ${blurEffect || layer === 0 ? 'backdrop-blur-sm' : ''} ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={onClose}
      />

      <div
        className={`
          relative w-full ${maxWidthClass} rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]
          ${isClosing ? 'animate-spring-down' : 'animate-spring-up'} 
          bg-white text-slate-900 border border-gray-100
          dark:bg-slate-900 dark:text-white dark:border-slate-800
        `}
      >
        <div className="px-8 py-4 border-b flex items-center justify-between border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors hover:bg-gray-200 text-slate-500 dark:text-slate-400 dark:hover:bg-slate-800"
            type="button"
          >
            {xIcon && (
              <X size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
        <div className="px-8 py-6 border-t flex items-center justify-end gap-3 border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          {
            showCancelButton && (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-medium text-sm transition-colors text-slate-500 hover:text-slate-800 hover:bg-gray-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800">
                {cancelButtonText || 'Cancel'}
              </button>
            )
          }
          {
            showConfirmButton && (
              <button onClick={onConfirm} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                {confirmButtonText || 'Create Category'}
              </button>
            )
          }
        </div>
      </div>

      <style>{`
        @keyframes spring-up {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spring-down {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.95) translateY(10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-spring-up { animation: spring-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-spring-down { animation: spring-down 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-out { animation: fade-out 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
};

const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const open = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const close = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  };

  return { isOpen, isClosing, open, close };
};

export { Modal, useModal };

