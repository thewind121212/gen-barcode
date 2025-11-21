import type { Supplier, Category, ComponentOptions, ComponentPart } from './types';

export const suppliers: Supplier[] = [
    { id: '801', name: 'Thiện Trang', color: 'bg-blue-100 text-blue-800' },
    { id: '802', name: 'Hải', color: 'bg-green-100 text-green-800' },
    { id: '803', name: 'Quang Minh', color: 'bg-purple-100 text-purple-800' }
];

export const categories: Category[] = [
    { id: '0001', name: 'Áo (Các loại)', icon: '👕' },
    { id: '0002', name: 'Quần (Jean/Kaki)', icon: '👖' },
    { id: '0003', name: 'Balo / Túi', icon: '🎒' },
    { id: '0004', name: 'Mũ / Nón', icon: '🧢' },
    { id: '0005', name: 'Khăn quàng', icon: '🧣' }
];

export const sex: ComponentPart[] = [
    { name: 'Cơ bản', code: '1' },
    { name: 'Cao cấp', code: '2' },
    { name: 'Limited', code: '3' },
    { name: 'Nam', code: '8' },
    { name: 'Nữ', code: '9' },
]

export const initialComponents: ComponentOptions = {
    part1: sex,
    part2: [ // 2 số (00-99) - Màu sắc/Họa tiết
        { name: 'Đen Tuyền', code: '01' },
        { name: 'Trắng Sứ', code: '02' },
        { name: 'Đỏ Đô', code: '03' },
        { name: 'Xanh Navy', code: '04' },
        { name: 'Vàng Chanh', code: '05' },
        { name: 'Kẻ Sọc', code: '10' },
        { name: 'Caro', code: '11' },
    ],
    part3: [ // 2 số (00-99) - Size/Kích thước
        { name: 'Size S', code: '01' },
        { name: 'Size M', code: '02' },
        { name: 'Size L', code: '03' },
        { name: 'Size XL', code: '04' },
        { name: 'Free Size', code: '00' },
        { name: 'Size 29', code: '29' },
        { name: 'Size 30', code: '30' },
    ]
};
