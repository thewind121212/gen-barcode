import { useGetUserInfo } from '@Jade/services/store/useQuery';
import { setIsAppInitialized, setStoreInfo, setUserId, setUserInfo } from '@Jade/store/app.store';
import type { RootState } from '@Jade/store/global.store';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@Jade/components/loading/SplashScreen';

export default function LoadingScreen() {
    const MIN_STAGE_GAP_MS = 100;
    const FINAL_STAGE_DELAY_MS = 120;
    const [progress, setProgress] = useState(0);
    const context = useSessionContext();
    const dispatch = useDispatch();
    const isAppInitialized = useSelector((state: RootState) => state.app.isAppInitialized);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const clearAllTimeouts = () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
    };


    const schedule = (fn: () => void, delay: number) => {
        const id = setTimeout(fn, delay);
        timeoutsRef.current.push(id);
    };

    const { mutate: getUserInfo } = useGetUserInfo({
        onSuccess: (response) => {
            if (!response || !response.success) {
                setErrorMessage('Không thể kết nối đến server');
                return;
            }
            const data = response.data;
            if (!data) {
                setErrorMessage('Không thể lấy thông tin người dùng');
                return;
            }
            clearAllTimeouts();
            let delayCursor = MIN_STAGE_GAP_MS;
            if (data.email) {
                dispatch(setUserInfo({ email: data.email }));
                schedule(() => setProgress(60), delayCursor);
                delayCursor += MIN_STAGE_GAP_MS;
            }
            const storeInfo = data.storeInfos?.[0];
            if (storeInfo) {
                dispatch(setStoreInfo(storeInfo));
                schedule(() => setProgress(90), delayCursor);
                delayCursor += MIN_STAGE_GAP_MS;
            }
            schedule(() => {
                setProgress(100);
                dispatch(setIsAppInitialized(true));
            }, delayCursor + FINAL_STAGE_DELAY_MS);
            if (!storeInfo) {
                    navigate('/onboarding');
            }
        },
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });

    const handlerFetchUserInfo = useCallback(() => {
        if (context.loading) return;
        const contextUserId = context.userId;
        setErrorMessage(null);
        dispatch(setUserId(contextUserId));
        setProgress(30);
        getUserInfo({ userId: contextUserId });
    }, [context, dispatch, getUserInfo]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handlerFetchUserInfo();
        }, 0);
        return () => clearTimeout(timer);
    }, [handlerFetchUserInfo]);

    useEffect(() => clearAllTimeouts, []);

    const loadingText = useMemo(() => {
        if (progress > 30 && progress < 60) return 'Tải Dữ Liệu Người Dùng';
        if (progress >= 60 && progress < 90) return 'Cập Nhật Danh Mục';
        if (progress >= 90) return 'Hoàn Thành';
        return 'Chào Mừng Bạn ';
    }, [progress]);
    return (
        !isAppInitialized ? (
            <SplashScreen>
                {!errorMessage ? (
                    <div className="flex flex-col items-center gap-4 w-64">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight animate-fade-in transition-all duration-300">
                            {loadingText}
                            <span className="animate-pulse">...</span>
                        </h2>

                        <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_12px_rgba(99,102,241,0.35)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <div className="flex items-center gap-2 text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-900/40 px-4 py-2 rounded-full border border-red-100 dark:border-red-800/60">
                            <AlertCircle size={18} />
                            <span className="text-sm font-medium">Unable to connect</span>
                        </div>

                        <button
                            onClick={handlerFetchUserInfo}
                            className="group flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        >
                            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span>Try Again</span>
                        </button>
                    </div>
                )}
            </SplashScreen>
        ) : (
            <>
            </>
        )
    );
}