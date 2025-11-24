import React from 'react';
import { Truck } from 'lucide-react';
import { LoaderCircleIcon, LaughIcon, RefreshCw } from 'lucide-react'
import { useSuppliers } from '../../hooks/useSupplier';

interface SupplierSelectorProps {
    selectedSupplier: string;
    onSelect: (supplierId: string) => void;

}

type supplierRender = {
    id: string;
    name: string;
    color: string;
}

export const SupplierSelector: React.FC<SupplierSelectorProps> = ({
    selectedSupplier,
    onSelect
}) => {
    const { data: suppliersData, isLoading, isError, refetch } = useSuppliers();

    const suppliersRender = (): supplierRender[] => {
        const sr: supplierRender[] = []
        if (suppliersData === undefined) return []
        for (const s of suppliersData || []) {
            const id = s.supplier_details?.split(':')?.[1]
            const color = s.supplier_details?.split(':')?.[2]
            if (id !== undefined && id.length === 3) {
                sr.push(
                    {
                        id: id || '000',
                        name: s.supplier_name,
                        color: color || ''
                    }
                )
            }

        }

        return sr

    }



    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <Truck className="w-5 h-5 text-blue-500" />
                1. Nhà Phân Phối (3 số đầu)
            </h2>
            {isLoading && (<LoaderCircleIcon className="w-10 h-10 text-blue-500 animate-spin m-auto" />)}
            {
                isError && (
                    <div className='flex flex-col items-center gap-2'>
                        <RefreshCw
                            onClick={() => refetch()}
                            className="w-10 h-10 text-blue-500 m-auto cursor-pointer" />
                        <span className='font-bold'>Error! Try Again</span>
                    </div>
                )
            }
            {
                !isLoading && !isError && suppliersData && suppliersData.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {suppliersRender().map((s) => (
                                <button
                                    key={s.id + s.name}
                                    onClick={() => onSelect(s.id)}
                                    className={`p-3 rounded-lg border text-left flex flex-col justify-center items-center transition-all ${selectedSupplier === s.id
                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                        : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="font-medium">{s.name}</span>
                                    <span className={`text-xs px-2 py-1 mt-1 rounded font-bold`}
                                    style={{ backgroundColor: s.color }} 
                                    >{s.id}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )
            }

            {
                !isLoading && !isError && suppliersData && suppliersData.length === 0 && (
                    <div className='flex flex-col items-center gap-2'>
                        <LaughIcon className="w-10 h-10 text-yellow-400 m-auto" />
                        <span className='font-bold text-gray-500'>Chưa có nhà phân phối nào. Vui lòng thêm nhà phân phối.</span>
                    </div>
                )
            }
        </div>
    );
};
