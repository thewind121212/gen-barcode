import type { Supplier, Category, VariantPresets } from './types';

// Dummy data for suppliers
export const suppliers: Supplier[] = [
    { id: '801', name: 'Thiện Trang', color: 'bg-blue-100 text-blue-800' },
    { id: '802', name: 'Hải', color: 'bg-green-100 text-green-800' },
    { id: '803', name: 'Quang Minh', color: 'bg-purple-100 text-purple-800' }
];

// Dummy data for categories
export const categories: Category[] = [
    { id: '0001', name: 'Áo (Các loại)' },
    { id: '0002', name: 'Quần (Jean/Kaki)' },
    { id: '0003', name: 'Balo / Túi' },
    { id: '0004', name: 'Mũ / Nón' },
    { id: '0005', name: 'Khăn quàng', }
];

// Initial variant presets for each category
export const initialVariants: VariantPresets = {
    '0001': [ // Áo
        { label: 'Size S', code: '00001' },
        { label: 'Size M', code: '00002' },
        { label: 'Size L', code: '00003' },
        { label: 'Size XL', code: '00004' },
        { label: 'Size XXL', code: '00005' },
        { label: 'Size S', code: '00005' },
        { label: 'Size M', code: '00006' },
        { label: 'Size L', code: '00007' },
        { label: 'Size XL', code: '00008' },
        { label: 'Size XXL', code: '00009' },
        { label: 'Size S', code: '00001' },
        { label: 'Size M', code: '00002' },
        { label: 'Size L', code: '00003' },
        { label: 'Size XL', code: '00004' },
        { label: 'Size XXL', code: '00005' },
        { label: 'Size S', code: '00005' },
        { label: 'Size M', code: '00006' },
        { label: 'Size L', code: '00007' },
        { label: 'Size XL', code: '00008' },
        { label: 'Size XXL', code: '00009' },
        { label: 'Size S', code: '00001' },
        { label: 'Size M', code: '00002' },
        { label: 'Size L', code: '00003' },
        { label: 'Size XL', code: '00004' },
        { label: 'Size XXL', code: '00005' },
        { label: 'Size S', code: '00005' },
        { label: 'Size M', code: '00006' },
        { label: 'Size L', code: '00007' },
        { label: 'Size XL', code: '00008' },
        { label: 'Size XXL', code: '00009' },
        { label: 'Size S', code: '00001' },
        { label: 'Size M', code: '00002' },
        { label: 'Size L', code: '00003' },
        { label: 'Size XL', code: '00004' },
        { label: 'Size XXL', code: '00005' },
        { label: 'Size S', code: '00005' },
        { label: 'Size M', code: '00006' },
        { label: 'Size L', code: '00007' },
        { label: 'Size XL', code: '00008' },
        { label: 'Size XXL', code: '00009' },
    ],
    '0002': [ // Quần
        { label: 'Size 28', code: '00028' },
        { label: 'Size 29', code: '00029' },
        { label: 'Size 30', code: '00030' },
        { label: 'Size 31', code: '00031' },
        { label: 'Size 32', code: '00032' },
        { label: 'Size 29', code: '00023' },
        { label: 'Size 30', code: '00034' },
        { label: 'Size 31', code: '00011' },
        { label: 'Size 32', code: '00012' },
    ],
    '0003': [ // Balo
        { label: 'Màu Đen', code: '00101' },
        { label: 'Màu Đỏ', code: '00102' },
        { label: 'Màu Xanh', code: '00103' },
        { label: 'Màu Vàng', code: '00104' },
        { label: 'Màu Xám', code: '00105' },
    ],
    '0004': [ // Mũ
        { label: 'Lưỡi trai', code: '00001' },
        { label: 'Snapback', code: '00002' },
        { label: 'Bucket', code: '00003' },
        { label: 'Len', code: '00004' },
        { label: 'Nửa đầu', code: '00005' },
    ],
    '0005': [ // Khăn
        { label: 'Lụa dài', code: '00001' },
        { label: 'Len ấm', code: '00002' },
        { label: 'Vuông', code: '00003' },
        { label: 'Cashmere', code: '00004' },
        { label: 'Cotton', code: '00005' },
    ]
};
