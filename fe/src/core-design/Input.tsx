import { AlertCircle } from 'lucide-react';
import React from 'react';
import type { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps {
    label: string;
    icon?: React.ReactNode;
    error?: string;
    success?: boolean;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>;
    registerOptions?: RegisterOptions<FieldValues, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const Input = ({ label, icon, error, success, className, register, registerOptions, ...props }: InputProps) => {
    return (
        <div className={`relative w-full ${className || ''}`}>

            <input
                {...props}
                placeholder=" " 
                {...register(props.name, { ...registerOptions })}
                className={`
            peer
            w-full
            bg-transparent
            rounded-xl
            border-2
            px-4
            py-4
            outline-none
            transition-all
            duration-200
            placeholder-transparent
            text-slate-900
            dark:text-white
            font-medium
            tracking-wide
            ${error
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]'
                        : success
                            ? 'border-emerald-500 focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.2)]'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]'
                    }
  
            ${icon ? 'pl-12' : ''}
          `}
            />

            {/* Floating Label */}
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
  
            peer-placeholder-shown:top-5
            peer-placeholder-shown:translate-y-0
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:font-medium
            ${icon ? 'peer-placeholder-shown:left-12' : 'peer-placeholder-shown:left-4'}
          `}
            >
                {label}
            </label>

            {/* Leading Icon (Optional) */}
            {icon && (
                <div className={`
            absolute 
            left-4 
            top-4 
            transition-colors 
            duration-200
            ${error
                        ? 'text-red-500'
                        : success
                            ? 'text-emerald-500'
                            : 'text-slate-400 peer-focus:text-indigo-500'
                    }
          `}>
                    {icon}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center mt-1.5 ml-1 text-xs font-medium text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {error}
                </div>
            )}
        </div>
    );
}

export default Input;