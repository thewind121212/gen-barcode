import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { suppliers, categories, initialComponents, categoryOptions } from './barcode-generator/constants';
import { calculateCheckDigit } from './barcode-generator/utils';
import toast from 'react-hot-toast';
import { ControlPanel } from './barcode-generator/ControlPanel';
import { PartSelector } from './barcode-generator/PartSelector';
import { ResultPanel } from './barcode-generator/ResultPanel';
import { HistoryModal } from './barcode-generator/HistoryModal';
import { AddPartModal } from './barcode-generator/AddPartModal';
import type { ComponentOptions, Selection, HistoryItem, PartKey, ComponentPart } from './barcode-generator/types';

const Generator = () => {
    // --- STATE ---
    const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0].id);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

    // State quản lý các thành phần có sẵn
    const [componentOptions, setComponentOptions] = useState<ComponentOptions>(initialComponents);

    // State lưu lựa chọn hiện tại của 3 phần
    const [selection, setSelection] = useState<Selection>({
        part1: initialComponents.part1[0], // Mặc định chọn cái đầu
        part2: initialComponents.part2[0],
        part3: initialComponents.part3[0]
    });

    // --- EFFECT: Update options when category changes ---
    useEffect(() => {
        const newOptions = categoryOptions[selectedCategory];
        if (newOptions) {
            setComponentOptions(prev => ({
                ...prev,
                part2: newOptions.part2,
                part3: newOptions.part3
            }));

            setSelection(prev => ({
                ...prev,
                part2: newOptions.part2[0],
                part3: newOptions.part3[0]
            }));
        }
    }, [selectedCategory]);

    const [fullCode, setFullCode] = useState('');
    const [checkDigit, setCheckDigit] = useState(0);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // State cho Modal thêm mới thành phần
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; targetPart: PartKey | null; title: string }>({
        isOpen: false,
        targetPart: null,
        title: ''
    });

    // State cho History Modal
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    // --- CẬP NHẬT MÃ VẠCH ---
    useEffect(() => {
        // Ghép 3 phần lại: X + XX + XX
        const detailCode = `${selection.part1.code}${selection.part2.code}${selection.part3.code}`;

        const rawCode = `${selectedSupplier}${selectedCategory}${detailCode}`;
        const check = calculateCheckDigit(rawCode);

        setCheckDigit(check);
        setFullCode(`${rawCode}${check}`);
    }, [selectedSupplier, selectedCategory, selection]);

    // --- ACTIONS ---
    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullCode);
        toast.success('Copy Thành Công')
    };

    const saveToHistory = () => {
        const supplierName = suppliers.find(s => s.id === selectedSupplier)?.name || '';
        const categoryName = categories.find(c => c.id === selectedCategory)?.name || '';

        // Tên ghép: Name -- Name -- Name
        const compositeName = `${selection.part1.name} -- ${selection.part2.name} -- ${selection.part3.name}`;

        const newItem: HistoryItem = {
            code: fullCode,
            desc: `${categoryName} [${compositeName}]`,
            subDesc: supplierName,
            time: new Date().toLocaleTimeString(),
            compositeName: compositeName
        };

        setHistory([newItem, ...history]);
    };

    // --- XỬ LÝ THÊM ITEM MỚI VÀO LIST ---
    const openAddModal = (partKey: PartKey, title: string) => {
        setModalConfig({ isOpen: true, targetPart: partKey, title });
    };

    const handleAddItem = (name: string, code: string) => {
        if (!name || !code) return alert("Nhập đủ tên và mã!");

        const target = modalConfig.targetPart;
        if (!target) return;

        // Validate độ dài mã tùy theo phần (Phần 1 chỉ 1 số, Phần 2,3 là 2 số)
        const requiredLength = target === 'part1' ? 1 : 2;
        const formattedCode = code.replace(/\D/g, '').padStart(requiredLength, '0').slice(-requiredLength);

        const newItem: ComponentPart = { name: name, code: formattedCode };

        setComponentOptions(prev => ({
            ...prev,
            [target]: [...prev[target], newItem]
        }));

        // Tự động chọn luôn cái vừa tạo
        setSelection(prev => ({ ...prev, [target]: newItem }));
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8 relative">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-2">
                        <BarChart3 className="w-8 h-8" />
                        Hệ Thống Tạo Mã Vạch EAN-13
                    </h1>
                    <p className="text-gray-500">Cấu trúc: NPP (3) + Nhóm (4) + <span className="text-orange-600 font-bold">Dòng(1)-Màu(2)-Size(2)</span> + Check(1)</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* CỘT TRÁI: BỘ ĐIỀU KHIỂN (Chiếm 8 phần) */}
                    <div className="lg:col-span-8 space-y-6">

                        <ControlPanel
                            suppliers={suppliers}
                            categories={categories}
                            selectedSupplier={selectedSupplier}
                            selectedCategory={selectedCategory}
                            onSupplierChange={setSelectedSupplier}
                            onCategoryChange={setSelectedCategory}
                        />

                        {/* Card 3: BỘ LẮP GHÉP BIẾN THỂ (TRỌNG TÂM) */}
                        <PartSelector
                            componentOptions={componentOptions}
                            selection={selection}
                            onSelectionChange={(part, item) => setSelection(prev => ({ ...prev, [part]: item }))}
                            onOpenAddModal={openAddModal}
                        />
                    </div>
                    {/* CỘT PHẢI: KẾT QUẢ & LỊCH SỬ (Chiếm 4 phần) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* KẾT QUẢ HIỂN THỊ */}
                        <ResultPanel
                            fullCode={fullCode}
                            checkDigit={checkDigit}
                            selection={selection}
                            selectedSupplier={selectedSupplier}
                            selectedCategory={selectedCategory}
                            onCopy={copyToClipboard}
                            onSave={saveToHistory}
                            onViewHistory={() => setIsHistoryModalOpen(true)}
                        />
                    </div>
                </div>

                {/* MODAL THÊM PHẦN MỚI */}
                <AddPartModal
                    isOpen={modalConfig.isOpen}
                    title={modalConfig.title}
                    targetPart={modalConfig.targetPart}
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    onAdd={handleAddItem}
                />

                {/* MODAL LỊCH SỬ */}
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    history={history}
                    onClose={() => setIsHistoryModalOpen(false)}
                    onClearHistory={() => {
                        setHistory([]);
                        setIsHistoryModalOpen(false);
                    }}
                />

            </div>
        </div>
    );
};

export default Generator;