import { z } from "zod/v4";

// Schema used to validate the removeStorage request body
export const removeStorageSchema = z.object({
  storageId: z.uuidv4("storageId must be a valid UUID"),
});

// Inferred TypeScript DTO type for codegen / services
export type RemoveStorageDto = z.infer<typeof removeStorageSchema>;
