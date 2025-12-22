import { z } from "zod/v4";

// Schema used to validate the getCategoryOverview request query
export const getCategoryOverviewSchema = z.object({
  // TODO: Add validation rules
});

// Inferred TypeScript DTO type for codegen / services
export type GetCategoryOverviewDto = z.infer<typeof getCategoryOverviewSchema>;
