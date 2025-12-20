import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import Spinner from '@Jade/core-design/loader/Spinner';

export type ActionMenuItem = {
  label: string;
  onClick: (id: string) => void;
  loading?: boolean;
  icon?: LucideIcon;
  danger?: boolean;
};

export type ActionMenuProps = {
  isOpen?: boolean;
  onToggle?: () => void;
  callBack?: () => void;
  actions: ActionMenuItem[];
  targetId: string;
};

const ActionMenu: React.FC<ActionMenuProps> = ({ isOpen, onToggle, callBack, actions, targetId }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const openState = typeof isOpen === 'boolean' ? isOpen : localOpen;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      return;
    }
    setLocalOpen((prev) => !prev);
  };


  const handleClose = useCallback(() => {
    clearCloseTimer();
    if (typeof isOpen === 'boolean') {
      if (isOpen && onToggle) onToggle();
      return;
    }
    setLocalOpen(false);
  }, [clearCloseTimer, isOpen, onToggle]);

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
  }, [clearCloseTimer, handleClose, openState]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
          if (callBack) {
            callBack();
          }
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
      <div
        className={`
          absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50
          origin-top-right transition-all duration-200 ease-out
          ${openState
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
          }
          dark:bg-gray-900 dark:border-gray-800 dark:shadow-2xl
        `}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={() => {
          clearCloseTimer();
          closeTimerRef.current = setTimeout(() => handleClose(), 180);
        }}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(targetId);
              handleClose();
            }}
            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors
              ${action.danger
                ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-indigo-300'
              }`}
          >

            {action.icon && !action.loading && <action.icon size={16} />}
            {action.loading && (
              <span className="flex h-4 w-4 items-center justify-center">
                <Spinner className="h-4 w-4 text-slate-900! dark:text-white!" />
              </span>
            )}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionMenu;
