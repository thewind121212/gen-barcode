import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-2">
                <BarChart3 className="w-8 h-8" />
                Hệ Thống Tạo Mã Vạch EAN-13
            </h1>
            <p className="text-gray-500">Quản lý kho hàng nội bộ - Chuẩn hóa quy trình</p>
        </header>
    );
};
