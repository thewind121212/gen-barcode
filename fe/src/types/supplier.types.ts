export type Supplier = {
  name: string;
  supplier_name: string;
  supplier_group: string;
  tax_id?: string;
  email_id?: string;
  supplier_details?: string;
};

export type SupplierResponse = {
  data: Supplier;
};

export type SuppliersApiResponse = {
  data: Supplier[];
};
