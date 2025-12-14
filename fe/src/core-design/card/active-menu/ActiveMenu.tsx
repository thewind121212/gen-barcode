import React, { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  danger?: boolean;
};

export type ActionMenuProps = {
  isOpen?: boolean;
  onToggle?: () => void;
  callBack?: () => void;
  actions: ActionMenuItem[];
};

const ActionMenu: React.FC<ActionMenuProps> = ({ isOpen, onToggle, callBack, actions }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const openState = typeof isOpen === 'boolean' ? isOpen : localOpen;

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      return;
    }
    setLocalOpen((prev) => !prev);
  };

  const handleClose = () => {
    clearCloseTimer();
    if (typeof isOpen === 'boolean') {
      if (isOpen && onToggle) onToggle();
      return;
    }
    setLocalOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!openState) return;
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      clearCloseTimer();
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [openState]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
          (callBack) && callBack();
        }}
        className={`p-2 rounded-md transition-all duration-200 outline-none
          ${openState 
            ? 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-100 dark:ring-indigo-800/60' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
          }`}
      >
        <MoreHorizontal size={20} />
      </button>
      
      {/* Dropdown Menu */}
      {openState && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right dark:bg-gray-900 dark:border-gray-800 dark:shadow-2xl"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={() => {
            clearCloseTimer();
            closeTimerRef.current = setTimeout(() => handleClose(), 200);
          }}
        >
          {actions.map((action, index) => (
            <button 
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                handleClose();
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors
                ${action.danger 
                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-indigo-300'
                }`}
            >
              {action.icon && <action.icon size={16} />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
