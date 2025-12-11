import { z } from "zod/v4";

// Schema used to validate the createStore request body
export const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100, "Store name must be less than 100 characters"),
});

// Inferred TypeScript DTO type for codegen / services
export type CreateStoreDto = z.infer<typeof createStoreSchema>;
