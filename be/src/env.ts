import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(9090),
  SUPERTOKENS_CONNECTION_URI: z.string().default("http://localhost:3567"),
  APP_NAME: z.string().default("barcode-generator"),
  API_DOMAIN: z.string().default("http://localhost:9090"),
  WEBSITE_DOMAIN: z.string().default("http://localhost:3000"),
  API_BASE_PATH: z.string().default("/auth"),
  WEBSITE_BASE_PATH: z.string().default("/auth"),
  ERP_BASE_URL: z.string().default("http://localhost:8080"),
  ERP_NEXT_TOKEN: z.string().default("token 558742534b48626:a5ef0b2f64c6be7")
});

try {
  // eslint-disable-next-line node/no-process-env
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
