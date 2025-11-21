export interface Supplier {
    id: string;
    name: string;
    color: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface ComponentPart {
    name: string;
    code: string;
}

export interface ComponentOptions {
    part1: ComponentPart[];
    part2: ComponentPart[];
    part3: ComponentPart[];
}

export interface Selection {
    part1: ComponentPart;
    part2: ComponentPart;
    part3: ComponentPart;
}

export interface HistoryItem {
    code: string;
    desc: string;
    subDesc: string | undefined;
    time: string;
    compositeName: string;
}

export type PartKey = 'part1' | 'part2' | 'part3';
