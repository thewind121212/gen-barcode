import { z } from "zod/v4";

// Schema used to validate the removeCategory request body
export const removeCategorySchema = z.object({
  categoryIds: z.array(z.uuidv4("categoryId must be a valid UUID")).min(1, "at least one id is required"),
  storeId: z.uuidv4("storeId must be a valid UUID"),
});

// Inferred TypeScript DTO type for codegen / services
export type RemoveCategoryDto = z.infer<typeof removeCategorySchema>;
