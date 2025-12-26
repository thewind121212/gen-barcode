import { z } from "zod/v4";

// Schema used to validate the getStorageByStoreId request query
export const getStorageByStoreIdSchema = z.object({
  // TODO: Add validation rules
});

// Inferred TypeScript DTO type for codegen / services
export type GetStorageByStoreIdDto = z.infer<typeof getStorageByStoreIdSchema>;
