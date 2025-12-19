import { useState, useEffect, useRef } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { signOut } from "supertokens-auth-react/recipe/session";

const appVersion = import.meta.env.VITE_APP_VERSION || null

export default function UserMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleSignOut = async () => {
        try {
            setIsMenuOpen(false);
            await signOut();
            window.location.href = "/auth";
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node | null;
            if (menuRef.current && target && !menuRef.current.contains(target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen((open) => !open);

    return (
        <div className="relative" ref={menuRef}>
            <div
                className={`
            absolute bottom-full left-0 mb-3 w-64 z-50
            bg-white dark:bg-slate-900 rounded-xl shadow-2xl shadow-black/20 
            border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all duration-200 origin-bottom-left
            ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
          `}
            >
                <div className="py-1">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">Jane Doe</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">jane.doe@example.com</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-3 transition-colors"
                    >
                        <Settings size={18} />
                        <span>Account Settings</span>
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 flex items-center gap-3 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                    {
                        appVersion && (
                            <div className="w-full text-left px-1 py-2.5 pl-4 text-xs text-slate-700 dark:text-slate-100 flex items-center gap-3 transition-colors cursor-default">
                                {appVersion}
                            </div>
                        )
                    }
                </div>
            </div>

            <button
                onClick={toggleMenu}
                className={`
            relative w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center
            ${isMenuOpen ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-slate-900'}
          `}
            >
                <div className="w-full h-full rounded-full bg-linear-to-tr from-blue-500 to-purple-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 border-2 border-transparent overflow-hidden">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </button>
        </div>
    );
}