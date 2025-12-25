import { z } from "zod/v4";

const createProductBarcodeSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

const createProductPackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  multiplier: z.number().min(1, "Multiplier is required"),
  sellPrice: z.number().min(0, "Sell price must be greater than 0").optional(),
  exportPrice: z.string().optional(),
  isDefaultSell: z.boolean().optional(),
  barcodes: z.array(createProductBarcodeSchema).optional(),
});

// Schema used to validate the createProduct request body
export const createProductSchema = z.object({
  categoryId: z.uuidv4("categoryId must be a valid UUID").optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
  baseUnitCode: z.string().min(1, "Base unit code is required"),
  sellPrice: z.number().min(0, "Sell price must be greater than 0"),
  barcodes: z.array(createProductBarcodeSchema).optional(),
  packs: z.array(createProductPackSchema).optional(),
});

// Inferred TypeScript DTO type for codegen / services
export type CreateProductDto = z.infer<typeof createProductSchema>;
