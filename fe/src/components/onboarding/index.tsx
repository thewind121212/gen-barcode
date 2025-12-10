import { ArrowRight, Box, Check, Layers, Loader2, ScanBarcode, Store, Warehouse } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useCreateStore } from '../../services/store/useQuery';

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isStockroomReady, setIsStockroomReady] = useState(false);
    const navigate = useNavigate();

    // Animation state for the storage builder
    const [stockAnimationStep, setStockAnimationStep] = useState(0);

    const { mutate: createStore, isPending: isLoading } = useCreateStore({
        onSuccess: () => {
            setIsStockroomReady(true);
            setCurrentStep(prev => prev + 1);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            interval = setInterval(() => {
                setStockAnimationStep((prev) => (prev + 1) % 4);
            }, 600);
        } return () => clearInterval(interval);
    }, [isLoading]);

    useEffect(() => {
        if (currentStep !== 2) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStockAnimationStep(0);
        }
    }, [currentStep]);

    const slides = [
        {
            id: 1,
            title: "Bán Lẻ Tinh Gọn",
            description: "Trải nghiệm được thiết kế chuyên biệt cho môi trường bán lẻ. Giao diện tinh giản, tập trung hoàn toàn vào các công cụ bán hàng thiết yếu.",
            icon: <Store className="w-16 h-16 text-indigo-600" />,
            color: "bg-indigo-50"
        },
        {
            id: 2,
            title: "Quản Lý Thông Minh",
            description: "Theo dõi hàng hóa qua mã vạch, danh mục hoặc vị trí kệ. Hệ thống sẽ sắp xếp danh mục số hóa tương thích hoàn toàn với sơ đồ thực tế của cửa hàng.",
            icon: <ScanBarcode className="w-16 h-16 text-purple-600" />,
            color: "bg-purple-50"
        },
        {
            id: 3,
            title: "Thiết Lập Kho Hàng",
            description: "Kho hàng thực tế cần được số hóa chính xác. Chúng tôi sẽ khởi tạo cấu trúc dữ liệu để quản lý toàn bộ hàng tồn kho của quý khách.",
            icon: <Warehouse className="w-16 h-16 text-blue-600" />,
            color: "bg-blue-50"
        },
        {
            id: 4,
            title: "Sẵn Sàng Kinh Doanh",
            description: "Kho hàng đã được thiết lập và khu vực bán hàng đã sẵn sàng để hoạt động.",
            icon: <Check className="w-16 h-16 text-green-600" />,
            color: "bg-green-50"
        }
    ];

    const handleNext = () => {
        if (currentStep === 2 && !isStockroomReady) {
            createStore("Stockroom");
        } else if (currentStep < slides.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            navigate("/generator");
        }
    };

    const handleStepClick = (step: number) => {
        if (isLoading) return;
        if (step === currentStep) return;
        if (step === 2 && !isStockroomReady) return;
        setCurrentStep(step);
    }


    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / slides.length) * 100}%` }}
                    />
                </div>

                <div className="p-8 pb-12 pt-12">
                    {/* Slide Content Area */}
                    <div className="min-h-[340px] flex flex-col items-center text-center justify-center">

                        {/* Animated Icon Container */}
                        <div className={`
              mb-8 p-8 rounded-full transition-colors duration-500 flex items-center justify-center w-32 h-32
              ${slides[currentStep].color}
            `}>
                            {isLoading ? (
                                <StorageBuilderAnimation stockAnimationStep={stockAnimationStep} />
                            ) : (
                                <div className="transform transition-all duration-500 scale-100 animate-in fade-in zoom-in">
                                    {slides[currentStep].icon}
                                </div>
                            )}
                        </div>

                        {/* Typography */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 transition-all duration-300">
                            {isLoading ? "Building Shelves..." : slides[currentStep].title}
                        </h1>

                        <p className="text-gray-500 leading-relaxed text-lg transition-all duration-300">
                            {isLoading ? "Organizing your digital stockroom structure..." : slides[currentStep].description}
                        </p>

                        {/* Step 3 Specific UI: Inventory Badge */}
                        {currentStep === 2 && !isLoading && (
                            <div className="mt-6 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-fade-in">
                                <Layers size={14} />
                                <span>Physical Storage Mapping</span>
                            </div>
                        )}
                    </div>

                    {/* Navigation Controls */}
                    <div className="mt-8 flex flex-col gap-4">
                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className={`
                w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2
                transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg
                ${isLoading
                                    ? 'bg-blue-50 text-blue-600 cursor-wait ring-2 ring-blue-100'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }
              `}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Setting up...
                                </>
                            ) : (
                                <>
                                    {currentStep === slides.length - 1 ? "Open Shop" : (currentStep === 2 ? (isStockroomReady ? "Stockroom is ready" : "Create Stockroom") : "Continue")}
                                    {currentStep !== slides.length - 1 && !isLoading && <ArrowRight size={20} />}
                                </>
                            )}
                        </button>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {slides.map((_, index) => (
                                <div
                                    key={index}
                                    className={`
                    h-2 rounded-full transition-all duration-300
                    ${index === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-200'}
                  `}
                                    onClick={() => handleStepClick(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StorageBuilderAnimation = ({ stockAnimationStep }: { stockAnimationStep: number }) => {
    // Add local state for the progress bar animation
    const [showBase, setShowBase] = useState<boolean>(false);

    useEffect(() => {
        // Trigger the progress bar to fill up when component mounts
        const timer = setTimeout(() => setShowBase(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Base Warehouse Floor */}
            <div className="absolute bottom-0 w-24 h-2 bg-blue-200 rounded-full">
                <div
                    className={`h-full bg-blue-600 rounded-full transition-all ease-linear ${showBase ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        transitionDuration: '1000ms' // Matches the 3000ms timeout in handleNext
                    }}
                />
            </div>

            {/* Left Stack */}
            <div className={`absolute bottom-2 left-2 transition-all duration-500 transform ${stockAnimationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <Box className="w-10 h-10 text-blue-600 fill-blue-100" strokeWidth={1.5} />
            </div>

            <div className={`absolute bottom-5 right-2 transition-all duration-500 transform ${stockAnimationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <Box className="w-10 h-10 text-blue-600 fill-blue-100" strokeWidth={1.5} />
            </div>

            {/* Right Stack */}
            <div className={`absolute bottom-2 right-10 transition-all duration-500 delay-75 transform ${stockAnimationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <Box className="w-10 h-10 text-blue-500 fill-blue-50" strokeWidth={1.5} />
            </div>

            <div className={`absolute bottom-2 left-10 transition-all duration-500 delay-75 transform ${stockAnimationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <Box className="w-10 h-10 text-blue-500 fill-blue-50" strokeWidth={1.5} />
            </div>
            {/* Top Center Stack */}
            <div className={`absolute bottom-10 transition-all duration-500 delay-150 transform ${stockAnimationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <Box className="w-10 h-10 text-indigo-600 fill-indigo-100" strokeWidth={1.5} />
            </div>

            <div className={`absolute bottom-14 right-2 transition-all duration-500 delay-150 transform ${stockAnimationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <Box className="w-10 h-10 text-indigo-600 fill-indigo-100" strokeWidth={1.5} />
            </div>

            {/* Loading Particles */}
            <div className="absolute -top-4 right-0">
                <div className="animate-ping w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
        </div>
    );
};