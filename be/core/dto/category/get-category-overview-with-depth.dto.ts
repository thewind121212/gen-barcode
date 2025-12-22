import { z } from "zod/v4";

// Schema used to validate the getCategoryOverviewWithDepth request body
export const getCategoryOverviewWithDepthSchema = z.object({
  depth: z.number().min(1).max(5).default(5),
});

// Inferred TypeScript DTO type for codegen / services
export type GetCategoryOverviewWithDepthDto = z.infer<typeof getCategoryOverviewWithDepthSchema>;
