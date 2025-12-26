import { z } from "zod/v4";

// Schema used to validate the getStorageByStoreIdOverview request query
export const getStorageByStoreIdOverviewSchema = z.object({
  // TODO: Add validation rules
});

// Inferred TypeScript DTO type for codegen / services
export type GetStorageByStoreIdOverviewDto = z.infer<typeof getStorageByStoreIdOverviewSchema>;
