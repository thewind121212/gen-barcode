import { z } from "zod/v4";

// Schema used to validate the createCategory request body
export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  parentId: z.uuidv4("parentId must be a valid UUID").optional(),
  colorSettings: z.string().trim().min(1).optional(),
  layer: z.string().trim().min(1, "layer is required"),
  description: z.string().trim().optional(),
  storeId: z.uuidv4("storeId must be a valid UUID"),
});

// Inferred TypeScript DTO type for codegen / services
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
