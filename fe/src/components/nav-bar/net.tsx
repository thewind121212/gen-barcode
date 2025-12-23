import ThemeToggle from "@Jade/theme/ThemeToggle";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Menu,
    Package,
    Printer,
    ScanBarcode,
    Settings,
    SquareChartGantt
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import UserMenu from '@Jade/components/nav-bar/user';
import i18n, { handleChangeLanguage } from "@Jade/i18n";

interface SidebarProps {
    setActiveTab: (tab: string) => void;
    onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    onSignOut
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [language, setLanguage] = useState(i18n.language || 'en');

    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'home', label: 'Trang Chủ', icon: Home, url: '/' },
        { id: 'inventory', label: 'Quản Lý Kho', icon: Package, url: '/inventory' },
        { id: 'create', label: 'Tạo Mã Vạch', icon: ScanBarcode, url: '/barcode-generator' },
        { id: 'printer', label: 'Kiểm Tra Máy In', icon: Printer, url: '/printer' },
        { id: 'settings', label: 'Cài Đặt', icon: Settings, url: '/settings' },
        { id: 'category', label: 'Danh Mục', icon: SquareChartGantt, url: '/categories' },
    ];

    const isActiveTab = (tab: string) => {
        return location.pathname === tab;
    };

    // Click outside handler to auto-collapse sidebar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                if (isExpanded) {
                    setIsExpanded(false);
                }
            }
        };

        // Only add listener if sidebar is expanded
        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    useEffect(() => {
        const listener = (lng: string) => setLanguage(lng);
        i18n.on('languageChanged', listener);
        return () => {
            i18n.off('languageChanged', listener);
        };
    }, []);

    return (
        <aside
            ref={sidebarRef}
            className={`
        fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-2xl md:shadow-none
        transform transition-all duration-300 ease-in-out
        md:translate-x-0 md:static flex flex-col
        ${isExpanded ? "md:w-60" : "md:w-20"}
      `}
            style={{
                position: "fixed"
            }}
        >

            {/* Logo Area */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 duration-300">
                <div className="flex items-center gap-3 cursor-pointer overflow-hidden">
                    <div className="rounded-xl text-white shrink-0 shadow-2xl shadow-blue-500/30 transform transition-transform duration-300">
                        <img src="/logo.webp" alt="Simple Store" className="w-11 h-11" />
                    </div>
                    {(isExpanded) && (
                        <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-xl text-gray-800 dark:text-gray-50 leading-none tracking-tight">
                                Simply<span className="text-blue-600">Store</span>
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-200 font-medium tracking-wider uppercase mt-1">Inventory System</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button (Desktop Only) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:flex absolute -right-3 top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-md dark:shadow-none hover:shadow-lg transition-all text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 z-10"
            >
                {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-8 px-3 space-y-2">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`transition-all cursor-pointer ${isExpanded && 'duration-0!'} duration-300`}
                        style={{
                            width: isExpanded ? '200px' : '52px'
                        }}
                    >
                        <div
                            onClick={() => {
                                navigate(item.url);
                            }}
                            className={`
                group flex items-center ${isExpanded ? 'justify-between px-4' : 'justify-center px-2'} py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                ${isActiveTab(item.url)
                                    ? "bg-blue-50/80 text-blue-700 shadow-sm ring-1 ring-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/40"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-50"}
              `}
                        >
                            <div className={`flex items-center ${isExpanded ? 'gap-3' : 'gap-0'}`}>
                                <item.icon className={`w-5 h-5 transition-colors ${isActiveTab(item.url) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"}`} />
                                {isExpanded && <span>{item.label}</span>}
                            </div>
                            {isActiveTab(item.url) && (isExpanded) && (
                                <ChevronRight className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`
                    flex w-full mb-4 px-3
                    transition-all duration-300
                    ${isExpanded ? "justify-start" : "justify-center"}
                `}
            >
                <div className={`flex items-center gap-2 transition-transform duration-300 ${isExpanded ? '' : 'flex-col'}`}>
                    <button
                        onClick={handleChangeLanguage}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
                        title="Change language"
                    >
                        <div className="w-4 h-4">
                            {language?.toUpperCase() || 'EN'}
                        </div>
                    </button>
                    <div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className={`p-3 border-t border-gray-100 dark:border-gray-800 ${!isExpanded ? 'flex justify-center' : ''}`}>
                {(isExpanded) ? (
                    <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 p-[2px] shadow-sm dark:shadow-none shrink-0">
                                <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                    <span className="font-bold text-transparent bg-clip-text bg-linear-to-tr from-blue-500 to-purple-500">AD</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">Admin Kho</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@system.com</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={onSignOut}
                        className="p-3"
                        title="Đăng xuất"
                    >
                        <UserMenu />
                    </div>
                )}
            </div>
        </aside>
    );
};