import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  portal?: boolean;
};

const ActionMenu: React.FC<ActionMenuProps> = ({ isOpen, onToggle, callBack, actions, targetId, portal = false }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const [portalPos, setPortalPos] = useState<{ top: number; left: number } | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [portalShown, setPortalShown] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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

  const updatePortalPosition = useCallback(() => {
    if (!portal) return;
    if (!openState) return;
    if (!triggerRef.current || !dropdownRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const gap = 8;
    const pad = 8;

    // Default: open below, right-aligned
    let top = triggerRect.bottom + gap;
    let left = triggerRect.right - dropdownRect.width;

    // Clamp horizontally
    left = Math.max(pad, Math.min(left, window.innerWidth - dropdownRect.width - pad));

    // If would overflow bottom, open above
    if (top + dropdownRect.height > window.innerHeight - pad) {
      top = triggerRect.top - gap - dropdownRect.height;
    }

    // Final clamp vertically
    top = Math.max(pad, Math.min(top, window.innerHeight - dropdownRect.height - pad));

    setPortalPos({ top, left });
    setPortalReady(true);
  }, [openState, portal]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!openState) return;
      const target = event.target as Node;
      const clickedInsideTrigger = Boolean(containerRef.current?.contains(target));
      const clickedInsideDropdown = Boolean(dropdownRef.current?.contains(target));
      if (!clickedInsideTrigger && !clickedInsideDropdown) {
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

  useEffect(() => {
    if (!portal) return;
    if (!openState) {
      const raf = requestAnimationFrame(() => {
        setPortalPos(null);
        setPortalReady(false);
        setPortalShown(false);
      });
      return () => cancelAnimationFrame(raf);
    }

    // Mount offscreen first to measure without flashing at (0,0).
    const rafInit = requestAnimationFrame(() => {
      setPortalReady(false);
      setPortalShown(false);
      setPortalPos({ top: -9999, left: -9999 });
    });

    // Position after paint so dropdown has a measurable size.
    const rafPos = requestAnimationFrame(() => updatePortalPosition());

    const onScrollOrResize = () => updatePortalPosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      cancelAnimationFrame(rafInit);
      cancelAnimationFrame(rafPos);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [openState, portal, updatePortalPosition]);

  useEffect(() => {
    if (!portal) return;
    const raf = requestAnimationFrame(() => {
      setPortalShown(Boolean(openState && portalReady));
    });
    return () => cancelAnimationFrame(raf);
  }, [openState, portal, portalReady]);

  const displayOpen = openState && (!portal || (portalReady && portalShown));
  const dropdownClassName = useMemo(() => (`
    ${portal ? 'fixed' : 'absolute right-0 top-full'}
    mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-99
    origin-top-right
    ${portal ? 'transition-opacity duration-150 ease-out' : 'transition-all duration-200 ease-out'}
    ${displayOpen
      ? `opacity-100 ${portal ? '' : 'scale-100 translate-y-0'} pointer-events-auto`
      : `opacity-0 ${portal ? '' : 'scale-95 -translate-y-1'} pointer-events-none`
    }
    ${portal && (!portalReady || !portalShown) ? 'transition-none' : ''}
    dark:bg-gray-900 dark:border-gray-800 dark:shadow-2xl
  `), [displayOpen, portal, portalReady, portalShown]);

  const dropdown = (
    <div
      ref={dropdownRef}
      className={dropdownClassName}
      style={portal ? (portalPos ? { top: portalPos.top, left: portalPos.left } : { top: -9999, left: -9999 }) : undefined}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={() => {
        clearCloseTimer();
        closeTimerRef.current = setTimeout(() => handleClose(), 250);
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
  );

  return (
    <div className="relative z-80" ref={containerRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
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

      {portal
        ? (typeof document !== 'undefined' ? createPortal(dropdown, document.body) : null)
        : dropdown}
    </div>
  );
};

export default ActionMenu;
