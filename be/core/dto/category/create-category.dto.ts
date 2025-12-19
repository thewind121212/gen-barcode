import { z } from "zod/v4";
import { NIL as NIL_UUID } from "uuid";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  parentId: z.union([
    z.uuidv4("parentId must be a valid UUID"),
    z.literal(NIL_UUID),
  ]).optional(),
  colorSettings: z.string().trim().min(1).optional(),
  layer: z.string().trim().min(1, "layer is required"),
  description: z.string().trim().optional(),
  storeId: z.uuidv4("storeId must be a valid UUID"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
});

// Inferred TypeScript DTO type for codegen / services
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
