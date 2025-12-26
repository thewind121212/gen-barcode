import { z } from "zod/v4";

// Schema used to validate the getStorageById request query
export const getStorageByIdSchema = z.object({
  storeId: z.uuidv4("storeId must be a valid UUID").optional(),
});

// Inferred TypeScript DTO type for codegen / services
export type GetStorageByIdDto = z.infer<typeof getStorageByIdSchema>;
