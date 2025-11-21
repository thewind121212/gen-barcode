import { useState, useEffect } from 'react';
import { Header } from './generator/Header';
import { SupplierSelector } from './generator/SupplierSelector';
import { CategorySelector } from './generator/CategorySelector';
import { VariantSelector } from './generator/VariantSelector';
import { BarcodeResult } from './generator/BarcodeResult';
import { HistoryList } from './generator/HistoryList';
import { AddVariantModal } from './generator/AddVariantModal';
import { suppliers, categories, initialVariants } from './generator/data';
import { calculateCheckDigit, generateRandomDetail, copyToClipboard } from './generator/utils';
import type { HistoryItem, VariantPresets } from './generator/types';

const Generator = () => {
    // --- STATE ---
    const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0].id);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
    const [variantPresets, setVariantPresets] = useState<VariantPresets>(initialVariants);
    const [productDetail, setProductDetail] = useState('00001');
    const [fullCode, setFullCode] = useState('');
    const [checkDigit, setCheckDigit] = useState(0);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVariantName, setNewVariantName] = useState('');
    const [newVariantCode, setNewVariantCode] = useState('');

    // --- UPDATE BARCODE WHEN INPUTS CHANGE ---
    useEffect(() => {
        const formattedDetail = productDetail.padEnd(5, '0').substring(0, 5);
        const rawCode = `${selectedSupplier}${selectedCategory}${formattedDetail}`;
        const check = calculateCheckDigit(rawCode);
        setCheckDigit(check);
        setFullCode(`${rawCode}${check}`);
    }, [selectedSupplier, selectedCategory, productDetail]);

    // --- EVENT HANDLERS ---
    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
        const firstVariant = variantPresets[categoryId]?.[0]?.code || '00001';
        setProductDetail(firstVariant);
    };

    const handleRandomGenerate = () => {
        setProductDetail(generateRandomDetail());
    };

    const handleCopyToClipboard = () => {
        copyToClipboard(fullCode);
    };

    const handleSaveToHistory = () => {
        const supplierName = suppliers.find(s => s.id === selectedSupplier)?.name;
        const categoryName = categories.find(c => c.id === selectedCategory)?.name;

        const currentVariants = variantPresets[selectedCategory] || [];
        const matchedVariant = currentVariants.find(v => v.code === productDetail);
        const variantLabel = matchedVariant ? `(${matchedVariant.label})` : '';

        const newItem: HistoryItem = {
            code: fullCode,
            desc: `${categoryName} ${variantLabel} - ${supplierName}`,
            time: new Date().toLocaleTimeString(),
            supplierId: selectedSupplier,
            categoryId: selectedCategory,
            productId: productDetail
        };

        setHistory([newItem, ...history]);
    };

    const handleAddNewVariant = () => {
        if (!newVariantName || !newVariantCode) {
            alert("Vui lòng nhập tên và mã số!");
            return;
        }

        const formattedCode = newVariantCode.replace(/\D/g, '').padEnd(5, '0').slice(0, 5);

        const newVariant = {
            label: newVariantName,
            code: formattedCode
        };

        setVariantPresets(prev => ({
            ...prev,
            [selectedCategory]: [...(prev[selectedCategory] || []), newVariant]
        }));

        setNewVariantName('');
        setNewVariantCode('');
        setIsModalOpen(false);
        setProductDetail(formattedCode);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8 relative">
            <div className="max-w-5xl mx-auto">
                <Header />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: CONTROLS */}
                    <div className="lg:col-span-7 space-y-6">
                        <SupplierSelector
                            suppliers={suppliers}
                            selectedSupplier={selectedSupplier}
                            onSelect={setSelectedSupplier}
                        />

                        <CategorySelector
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelect={handleCategorySelect}
                        />

                        <VariantSelector
                            variants={variantPresets[selectedCategory] || []}
                            selectedVariant={productDetail}
                            onSelectVariant={setProductDetail}
                            onManualInput={setProductDetail}
                            onRandomGenerate={handleRandomGenerate}
                            onOpenModal={() => setIsModalOpen(true)}
                        />
                    </div>

                    {/* RIGHT COLUMN: RESULT & HISTORY */}
                    <div className="lg:col-span-5 space-y-6">
                        <BarcodeResult
                            fullCode={fullCode}
                            selectedSupplier={selectedSupplier}
                            selectedCategory={selectedCategory}
                            productDetail={productDetail}
                            checkDigit={checkDigit}
                            onCopy={handleCopyToClipboard}
                            onSave={handleSaveToHistory}
                        />

                        <HistoryList
                            history={history}
                            onClear={() => setHistory([])}
                        />
                    </div>
                </div>

                {/* MODAL */}
                <AddVariantModal
                    isOpen={isModalOpen}
                    newVariantName={newVariantName}
                    newVariantCode={newVariantCode}
                    onNameChange={setNewVariantName}
                    onCodeChange={setNewVariantCode}
                    onAdd={handleAddNewVariant}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default Generator;