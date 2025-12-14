import { z } from "zod/v4";

// Schema used to validate the getCategory request body
export const getCategorySchema = z.object({
  categoryId: z.uuidv4("categoryId must be a valid UUID"),
  storeId: z.uuidv4("storeId must be a valid UUID"),
});

// Inferred TypeScript DTO type for codegen / services
export type GetCategoryDto = z.infer<typeof getCategorySchema>;
