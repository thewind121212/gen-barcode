import { BarChart3, LogOut, Menu, Loader } from "lucide-react"
import { useState } from "react";
import { signOut, } from "supertokens-auth-react/recipe/emailpassword";
import { useNavigate } from "react-router-dom";


export default function Nav() {
    const [activeTab, setActiveTab] = useState('create'); // State để demo navigation
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [signOutLoading, setSignOutLoading] = useState<boolean>(false)
    const navigate = useNavigate();

    const handlerSignOut = async () => {
        setSignOutLoading(true)
        await signOut();
        setSignOutLoading(false)
        window.location.href = "/auth";
    }
    const handleNavigateToGenerator = () => {
        navigate("/generator");
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left Side */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-sm">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-xl text-blue-900 tracking-tight">BarCode<span className="text-orange-500">Gen</span></span>
                        </div>
                        <div className="hidden md:ml-8 md:flex md:space-x-6">
                            <button
                                onClick={handleNavigateToGenerator}
                                className={`${activeTab === 'create' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors`}
                            >
                                Tạo Mã Vạch
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`${activeTab === 'inventory' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                            >
                                In BarCode
                            </button>
                            <button
                                onClick={() => setActiveTab('report')}
                                className={`${activeTab === 'report' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                            >
                                Kiểm Tra Máy In
                            </button>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white cursor-pointer">Xu</div>
                            <button onClick={handlerSignOut} className="ml-2 p-2 bg-gray-50 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100 group" title="Đăng xuất">
                                {!signOutLoading && <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                {signOutLoading && <Loader className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>

                        <div className="flex items-center md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <button onClick={() => setActiveTab('create')} className={`block w-full text-left pl-3 pr-4 py-2 text-base font-medium ${activeTab === 'create' ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50'}`}>Tạo Mã Vạch</button>
                        <button onClick={() => setActiveTab('inventory')} className={`block w-full text-left pl-3 pr-4 py-2 text-base font-medium ${activeTab === 'inventory' ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50'}`}>Quản Lý Kho</button>
                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">AD</div>
                                <span className="text-sm font-medium text-gray-700">Admin Kho</span>
                            </div>
                            <button onClick={handlerSignOut} className="text-sm text-red-600 font-medium">Đăng xuất</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>

    )
}

