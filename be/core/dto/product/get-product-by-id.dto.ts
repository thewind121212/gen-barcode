import { z } from "zod/v4";

// Schema used to validate the getProductById request query
export const getProductByIdSchema = z.object({
  productId: z.uuidv4("productId must be a valid UUID"),
});

// Inferred TypeScript DTO type for codegen / services
export type GetProductByIdDto = z.infer<typeof getProductByIdSchema>;
