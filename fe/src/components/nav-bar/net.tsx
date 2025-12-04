import {
    BarChart3,
    LogOut,
    Loader,
    Package,
    Printer,
    ScanBarcode,
    ChevronRight,
    Settings,
    ChevronLeft,
    Home,
    Menu
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
    setActiveTab: (tab: string) => void;
    onSignOut: () => void;
    isSigningOut: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
    onSignOut,
    isSigningOut
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'home', label: 'Trang Chủ', icon: Home, url: '/' },
        { id: 'inventory', label: 'Quản Lý Kho', icon: Package, url: '/inventory' },
        { id: 'create', label: 'Tạo Mã Vạch', icon: ScanBarcode, url: '/barcode-generator' },
        { id: 'printer', label: 'Kiểm Tra Máy In', icon: Printer, url: '/printer' },
        { id: 'settings', label: 'Cài Đặt', icon: Settings, url: '/settings' },
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

    return (
        <aside
            ref={sidebarRef}
            className={`
        fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-100 shadow-2xl md:shadow-none
        transform transition-all duration-300 ease-in-out
        md:translate-x-0 md:static flex flex-col
        ${isExpanded ? "md:w-60" : "md:w-20"}
      `}
            style={{
                position: "fixed"
            }}
        >

            {/* Logo Area */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-gray-50">
                <div className="flex items-center gap-3 cursor-pointer overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-blue-200 shadow-lg flex-shrink-0">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    {(isExpanded) && (
                        <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-xl text-gray-800 leading-none tracking-tight">
                                Simply<span className="text-blue-600">Store</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-1">Inventory System</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button (Desktop Only) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:flex absolute -right-3 top-24 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all text-gray-600 hover:text-blue-600 z-10"
            >
                {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-8 px-3 space-y-2">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`transition-all cursor-pointer ${isExpanded && '!duration-0'} duration-200`}
                        style={{
                            width: isExpanded ? '200px' : '52px'
                        }}
                    >
                        <div
                            onClick={() => {
                                navigate(item.url);
                            }}
                            className={`
                group flex items-center ${isExpanded ? 'justify-between px-4' : 'justify-center px-2'} py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActiveTab(item.url)
                                    ? "bg-blue-50/80 text-blue-700 shadow-sm ring-1 ring-blue-100"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
              `}
                        >
                            <div className={`flex items-center ${isExpanded ? 'gap-3' : 'gap-0'}`}>
                                <item.icon className={`w-5 h-5 transition-colors ${isActiveTab(item.url) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                                {isExpanded && <span>{item.label}</span>}
                            </div>
                            {isActiveTab(item.url) && (isExpanded) && (
                                <ChevronRight className="w-4 h-4 text-blue-400" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* User Footer */}
            <div className={`p-3 border-t border-gray-100 ${!isExpanded ? 'flex justify-center' : ''}`}>
                {(isExpanded) ? (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shadow-sm flex-shrink-0">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-purple-500">AD</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">Admin Kho</p>
                                <p className="text-xs text-gray-500 truncate">admin@system.com</p>
                            </div>
                        </div>

                        <button
                            onClick={onSignOut}
                            disabled={isSigningOut}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm group"
                        >
                            {isSigningOut ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Signing out...</span>
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    <span>Đăng xuất</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onSignOut}
                        disabled={isSigningOut}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm group"
                        title="Đăng xuất"
                    >
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-purple-500">AD</span>
                    </button>
                )}
            </div>
        </aside>
    );
};