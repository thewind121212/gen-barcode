import { ShoppingBag } from "lucide-react"

const appVersion = import.meta.env.VITE_APP_VERSION || null

const SplashScreen = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center overflow-hidden font-sans fixed top-0 left-0 z-9999" >

            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/40 rounded-full blur-[120px] opacity-60 pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-100 dark:bg-purple-900/40 rounded-full blur-[120px] opacity-60 pointer-events-none mix-blend-multiply"></div>

            <div className="z-10 flex flex-col items-center">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-xl opacity-20 animate-pulse scale-110"></div>

                    <div className="relative w-24 h-24 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-500/30 flex items-center justify-center transform transition-transform duration-700 hover:scale-105">
                        <ShoppingBag className="text-white w-10 h-10 drop-shadow-md" strokeWidth={2.5} />

                        <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-linear-to-br from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                </div>
                {/* app version */}
                {
                    appVersion && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {appVersion}
                        </p>
                    )
                }
                {children}
            </div>
        </div>
    )
}

export default SplashScreen;