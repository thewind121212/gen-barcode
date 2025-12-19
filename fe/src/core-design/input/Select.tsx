import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface SelectProps {
  label?: string;
  options?: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
  success?: boolean;
  expandOnError?: boolean;
  className?: string;
  name: string;
  floatingLabel?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  registerOptions?: RegisterOptions<FieldValues, string>;
  disabled?: boolean;
}

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  icon: Icon,
  error,
  success,
  expandOnError = true,
  className,
  disabled,
  name,
  register,
  floatingLabel = true,
  registerOptions,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const registeredField = register ? register(name, registerOptions) : undefined;

  const selectedOption = options.find(opt => opt.value === value);

  const closeDropdown = useCallback(() => {
    if (!isOpen) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  }, [isOpen]);

  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) closeDropdown();
    else setIsOpen(true);
  };

  const handleSelect = (optionValue: string | number) => {
    if (registeredField?.onChange) {
      registeredField.onChange({
        target: {
          name,
          value: optionValue,
        },
        type: 'change',
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    onChange?.(optionValue);
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  return (
    <div className={`relative w-full ${!expandOnError ? 'mb-6' : ''} ${className || ''}`} ref={containerRef}>

      {/* Hidden input for react-hook-form integration */}
      {register && (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          ref={registeredField?.ref}
          disabled={disabled}
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 outline-none
          disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800
          ${isOpen
            ? 'ring-2 ring-indigo-500/20 border-indigo-500'
            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
          }
          bg-white text-slate-900 dark:bg-slate-900 dark:text-white
          ${error ? 'border-red-500 ring-red-500/20' : ''}
          ${success ? 'border-emerald-500 ring-emerald-500/20' : ''}
        `}
        disabled={disabled}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {Icon && (
            <Icon size={18} className="text-slate-400 dark:text-slate-500" />
          )}
          {selectedOption ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`
            transition-transform duration-300
            ${isOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400 dark:text-slate-500'}
          `}
        />
      </button>

      {/* Floating Label (like CommonInput, not static above) */}
      {label && (
            <label
            className={`
        absolute
        left-4
        top-1
        z-10
        origin-left,
        -translate-y-3
        scale-75
        transform
        cursor-text
        select-none
        px-1
        text-sm
        font-semibold
        transition-all
        duration-200
        pointer-events-none
        bg-white dark:bg-slate-900
        ${error
                    ? 'text-red-500'
                    : success
                        ? 'text-emerald-500'
                        : 'text-slate-400 peer-placeholder-shown:text-slate-500 peer-focus:text-indigo-500'
                }

        ${floatingLabel ? 'peer-placeholder-shown:top-5 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:font-medium' : ''}
        ${Icon ? 'peer-placeholder-shown:left-12' : 'peer-placeholder-shown:left-4'}
      `}
        >
            {label}
        </label>
      )}

      {/* Error Message */}
      {expandOnError ? (
        error && (
          <div className="flex items-center mt-1.5 ml-1 text-xs font-medium text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            {error}
          </div>
        )
      ) : (
        <div className="absolute left-0 bottom-[-24px] min-h-[20px]">
          {error && (
            <div className="flex items-center text-xs font-medium text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Dropdown Menu */}
      {(isOpen || isClosing) && (
        <div
          className={`
            absolute z-50 w-full mt-2 rounded-xl shadow-2xl overflow-hidden border
            ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}
            bg-white border-gray-100 dark:bg-slate-900 dark:border-slate-800
          `}
        >
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {options.map((option) => {
              const isSelected = value === option.value;
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left
                    ${isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'
                    }
                  `}
                  disabled={option.disabled}
                >
                  <div className="flex items-center gap-3">
                    {OptionIcon && (
                      <OptionIcon
                        size={16}
                        className={isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}
                      />
                    )}
                    <span className="font-medium">{option.label}</span>
                  </div>

                  {isSelected && <Check size={16} />}
                </button>
              );
            })}

            {options.length === 0 && (
              <div className="px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No options available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation + scrollbar styles */}
      <style>{`
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scale-out {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.95) translateY(-10px); }
        }
        .animate-scale-in { animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-out { animation: scale-out 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
};

export default Select;
