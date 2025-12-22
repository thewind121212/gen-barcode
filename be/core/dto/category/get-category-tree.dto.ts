import { z } from "zod/v4";

// Schema used to validate the getCategoryTree request body
export const getCategoryTreeSchema = z.object({
  categoryId: z.uuid("categoryId must be a valid UUID"),
  // TODO: Add validation rules
});

// Inferred TypeScript DTO type for codegen / services
export type GetCategoryTreeDto = z.infer<typeof getCategoryTreeSchema>;
