import { z } from "zod/v4";

// Schema used to validate the updateStorage request body
export const updateStorageSchema = z.object({
  storageId: z.uuidv4("storageId must be a valid UUID"),
  name: z.string().trim().min(1, "name is required"),
  address: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  icon: z.string().trim().min(1).optional(),
  active: z.boolean().optional(),
});

// Inferred TypeScript DTO type for codegen / services
export type UpdateStorageDto = z.infer<typeof updateStorageSchema>;
