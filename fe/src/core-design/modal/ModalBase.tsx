import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidthClass?: string;
};

export type UseModalReturn = {
  isOpen: boolean;
  isClosing: boolean;
  open: () => void;
  close: () => void;
};

const Modal = ({
  isOpen,
  isClosing = false,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-lg'
}: ModalProps) => {
  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 font-sans">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={onClose}
      />

      <div
        className={`
          relative w-full ${maxWidthClass} rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]
          ${isClosing ? 'animate-spring-down' : 'animate-spring-up'} 
          bg-white text-slate-900 border border-gray-100
          dark:bg-slate-900 dark:text-white dark:border-slate-800
        `}
      >
        {title && (
          <div
            className="px-8 py-5 border-b flex justify-between items-center border-gray-100 dark:border-slate-800"
          >
            <h3 className="font-bold text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors hover:bg-gray-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
              aria-label="Close modal"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
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

