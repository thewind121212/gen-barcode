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
    { name: 'Unisex', code: '1' },
    { name: 'Nam', code: '2' },
    { name: 'Nữ', code: '3' },
]

export const initialComponents: ComponentOptions = {
    part1: sex,
    part2: [
        { name: 'Đen Tuyền', code: '01' },
        { name: 'Trắng Sứ', code: '02' },
        { name: 'Đỏ Đô', code: '03' },
        { name: 'Xanh Navy', code: '04' },
        { name: 'Vàng Chanh', code: '05' },
        { name: 'Kẻ Sọc', code: '10' },
        { name: 'Caro', code: '11' },
    ],
    part3: [
        { name: 'Size S', code: '01' },
        { name: 'Size M', code: '02' },
        { name: 'Size L', code: '03' },
        { name: 'Size XL', code: '04' },
        { name: 'Free Size', code: '00' },
    ]
};

export const categoryOptions: Record<string, { part2: ComponentPart[], part3: ComponentPart[] }> = {
    '0001': { // Áo
        part2: [
            { name: 'Đen Tuyền', code: '01' },
            { name: 'Trắng Sứ', code: '02' },
            { name: 'Đỏ Đô', code: '03' },
            { name: 'Xanh Navy', code: '04' },
            { name: 'Vàng Chanh', code: '05' },
            { name: 'Kẻ Sọc', code: '10' },
            { name: 'Caro', code: '11' },
        ],
        part3: [
            { name: 'Size S', code: '01' },
            { name: 'Size M', code: '02' },
            { name: 'Size L', code: '03' },
            { name: 'Size XL', code: '04' },
            { name: 'Free Size', code: '00' },
        ]
    },
    '0002': { // Quần
        part2: [
            { name: 'Đen Tuyền', code: '01' },
            { name: 'Xanh Jean', code: '02' },
            { name: 'Xanh Navy', code: '04' },
            { name: 'Kaki', code: '06' },
            { name: 'Xám', code: '07' },
        ],
        part3: [
            { name: 'Size 28', code: '28' },
            { name: 'Size 29', code: '29' },
            { name: 'Size 30', code: '30' },
            { name: 'Size 31', code: '31' },
            { name: 'Size 32', code: '32' },
            { name: 'Size 33', code: '33' },
        ]
    },
    '0003': { // Balo / Túi
        part2: [
            { name: 'Đen', code: '01' },
            { name: 'Nâu', code: '08' },
            { name: 'Xám', code: '07' },
            { name: 'Hồng', code: '09' },
        ],
        part3: [
            { name: 'Free Size', code: '00' },
            { name: 'Mini', code: '01' },
            { name: 'Lớn', code: '02' },
        ]
    },
    '0004': { // Mũ / Nón
        part2: [
            { name: 'Đen', code: '01' },
            { name: 'Trắng', code: '02' },
            { name: 'Đỏ', code: '03' },
        ],
        part3: [
            { name: 'Free Size', code: '00' },
        ]
    },
    '0005': { // Khăn quàng
        part2: [
            { name: 'Đa sắc', code: '99' },
            { name: 'Đỏ', code: '03' },
            { name: 'Len', code: '12' },
        ],
        part3: [
            { name: 'Dài', code: '01' },
            { name: 'Vuông', code: '02' },
        ]
    }
};
