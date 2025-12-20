import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectModalStack } from '@Jade/store/modal.store';
import type { RootState } from '@Jade/store/global.store';
import { ModalId, type ModalKey } from '@Jade/types/modal';
import Spinner from '@Jade/core-design/loader/Spinner';


type ModalProps = {
  modalId: ModalKey;
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
  isLoading?: boolean;
  isLoadingComponent?: boolean;
  loadingComponent?: ReactNode;
  onConfirm?: () => void;
};

const PREFIX_LAYER = "6";


const Modal = ({
  modalId,
  isOpen,
  isClosing = false,
  onClose,
  layer,
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
  isLoading = false,
  isLoadingComponent = false,
  loadingComponent = null,
  onConfirm = () => { },
}: ModalProps) => {

  const modalStack = useSelector((state: RootState) => selectModalStack(state));
  const isTopLayer = modalStack[modalStack.length - 1]?.id === modalId;
  const derivedLayer = typeof layer === 'number'
    ? layer
    : Math.max(modalStack.findIndex((modal) => modal.id === modalId), 0);

  useEffect(() => {
    document.body.style.overflow = modalStack.length ? 'hidden' : 'auto';
    return () => {
      if (!modalStack.length) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [modalStack.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const isEscape = event.key === 'Escape' || event.key === 'Esc' || event.code === 'Escape';
      if (isEscape && isTopLayer) {
        event.preventDefault();
        onClose();
      }
    };
    // Use capture to ensure we get the event before other handlers that might stop propagation
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, isTopLayer, onClose]);

  if (!isOpen && !isClosing) return null;

  const styledLayer = {
    "zIndex": `${PREFIX_LAYER}${derivedLayer.toString()}`
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 font-sans left-0 top-0 ${className} max-h-screen`}
      style={styledLayer}
    >
      <div
        className={`absolute inset-0 bg-black/40 ${blurEffect || derivedLayer === 0 ? 'backdrop-blur-sm' : ''} ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
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

        <div className="flex-1 overflow-y-auto">
          {isLoadingComponent && loadingComponent}
          {!isLoadingComponent && children}
        </div>
        <div className="px-8 py-6 border-t flex items-center justify-end gap-3 border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          {
            showCancelButton && !isLoading && (
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl font-medium text-sm transition-colors text-slate-500 hover:text-slate-800 hover:bg-gray-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800">
                {cancelButtonText || 'Cancel'}
              </button>
            )
          }
          {
            showConfirmButton && (
              <button onClick={onConfirm}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                {isLoading ? <Spinner /> : (
                  confirmButtonText
                )}
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

export default Modal;
export { ModalId };

