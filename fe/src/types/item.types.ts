// Nested types for Item Detail
export type ItemBarcode = {
  barcode: string;
  barcode_type: string;
  idx?: number;
};

export type UOMConversion = {
  uom: string;
  conversion_factor: number;
  idx: number;
};

export type ItemDefault = {
  company: string;
  income_account: string;
  idx: number;
};

// Main Item Detail type
export type ItemDetail = {
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  disabled: number;
  is_stock_item: number;
  has_variants: number;
  opening_stock: number;
  valuation_rate: number;
  standard_rate: number;
  image?: string;
  description?: string;
  end_of_life: string;
  default_material_request_type: string;
  weight_per_unit: number;
  has_batch_no: number;
  has_expiry_date: number;
  has_serial_no: number;
  is_purchase_item: number;
  lead_time_days: number;
  last_purchase_rate: number;
  is_sales_item: number;
  max_discount: number;
  total_projected_qty: number;
  barcodes: ItemBarcode[];
  uoms: UOMConversion[];
  item_defaults: ItemDefault[];
  supplier_items: any[];
  attributes: any[];
  customer_items: any[];
  reorder_levels: any[];
  taxes: any[];
};

// API Response wrapper
export type ItemDetailResponse = {
  data: ItemDetail;
};

// Interface for Item list response
export type ItemResponse = {
  name: string;
};

export type ItemsApiResponse = {
  data: ItemResponse[];
};
