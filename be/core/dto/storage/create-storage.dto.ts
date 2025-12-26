import { z } from "zod/v4";

// Schema used to validate the createStorage request body
export const createStorageSchema = z.object({
  // `storeId` is usually provided via `x-store-id` header by middleware,
  // but we also allow it in body for flexibility.
  storeId: z.uuidv4("storeId must be a valid UUID").optional(),
  name: z.string().trim().min(1, "name is required").optional(),
  address: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  icon: z.string().trim().min(1).optional(),
  active: z.boolean().optional(),
  isPrimary: z.boolean().optional().default(false),
});

// Inferred TypeScript DTO type for codegen / services
export type CreateStorageDto = z.infer<typeof createStorageSchema>;
