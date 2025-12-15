import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const CommonButton: React.FC<CommonButtonProps> = ({
    children,
    type = 'button',
    loading = false,
    icon,
    iconPosition = 'right',
    className = '',
    disabled,
    ...rest
}) => {

    return (
        <button
            type={type}
            disabled={disabled}
            className={`
                w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2
                transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg
                ${loading
                    ? 'bg-blue-50 text-blue-600 cursor-wait ring-2 ring-blue-100 dark:bg-blue-500/20 dark:text-blue-200 dark:ring-blue-500/40'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400'
                }
                ${disabled ? 'cursor-not-allowed bg-gray-200! dark:bg-gray-700! text-gray-500! dark:text-gray-300!' : ''}
                ${className}
            `}
            {...rest}
        >
            {loading && (
                <Loader2 className="animate-spin" size={20} />
            )}

            {!loading && icon && iconPosition === 'left' && icon}

            <span>
                {children}
            </span>

            {!loading && icon && iconPosition === 'right' && icon}
        </button>
    );
};

export default CommonButton;


