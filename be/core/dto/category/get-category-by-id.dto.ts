import { z } from "zod/v4";

// Schema used to validate the getCategoryById request body
export const getCategoryByIdSchema = z.object({
  // TODO: Add validation rules
  categoryId: z.uuidv4("categoryId must be a valid UUID"),
});

// Inferred TypeScript DTO type for codegen / services
export type GetCategoryByIdDto = z.infer<typeof getCategoryByIdSchema>;
