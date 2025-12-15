import { z } from "zod/v4";

// Schema used to validate the getUserInfo request body
export const getUserInfoSchema = z.object({
  // TODO: Add validation rules
});

// Inferred TypeScript DTO type for codegen / services
export type GetUserInfoDto = z.infer<typeof getUserInfoSchema>;
