import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(9190),
  SUPERTOKENS_CONNECTION_URI: z.string().default("https://auth.simplestore.io.vn"),
  APP_NAME: z.string().default("barcode-generator"),
  API_DOMAIN: z.string().default("http://localhost:9190"),
  WEBSITE_DOMAIN: z.string().default("http://localhost:4140"),
  API_BASE_PATH: z.string().default("/auth"),
  WEBSITE_BASE_PATH: z.string().default("/auth"),
  DISABLE_REGISTER: z.string().default("false"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/postgres?schema=public"),
  ENVIRONMENT: z.string().default("dev"),
  MAX_STORAGE_BY_STORE: z.number().default(5),
  MAX_STORE_BY_USER: z.number().default(3),
});

try {
  envSchema.parse(process.env);
}
catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Missing environment variables:", error.issues.flatMap(issue => issue.path));
  }
  else {
    console.error(error);
  }
  process.exit(1);
}

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
