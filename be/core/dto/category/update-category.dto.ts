import { z } from "zod/v4";

import { createCategorySchema } from "@Ciri/core/dto/category/create-category.dto";

// Schema used to validate the updateCategory request body
export const updateCategorySchema = z.object({
  categoryId: z.uuidv4("categoryId must be a valid UUID"),
  categoryUpdate: createCategorySchema,
});

// Inferred TypeScript DTO type for codegen / services
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
