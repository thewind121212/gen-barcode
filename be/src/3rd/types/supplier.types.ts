export interface Supplier {
    name: string;
    supplier_name: string;
    supplier_group: string;
    tax_id?: string;
    email_id?: string;
    supplier_details?: string;
}

export interface SupplierResponse {
    data: Supplier;
}

export interface SuppliersApiResponse {
    data: Supplier[];
}
