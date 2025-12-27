import { env } from "@Ciri/core/env";
import { GeneralLogger, LogLevel, LogType } from "@Ciri/core/utils/logger";
import type { Client as MinioClient } from "minio";

let clientSingleton: MinioClient | null = null;

async function createMinioClient(): Promise<MinioClient> {
  // We keep this as dynamic import so the backend can still compile even if `minio`
  // is not installed in some environments (devs can enable MINIO_ENABLED when ready).
  const minioMod = await import("minio");
  const ClientCtor = minioMod.Client;
  if (!ClientCtor) {
    throw new Error("MinIO Client constructor not found. Please install the `minio` package.");
  }

  return new ClientCtor({
    endPoint: env.MINIO_ENDPOINT,
    port: env.MINIO_PORT,
    useSSL: env.MINIO_USE_SSL,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
  });
}

export async function getMinioClient(): Promise<MinioClient> {
  if (clientSingleton) return clientSingleton;
  clientSingleton = await createMinioClient();
  return clientSingleton;
}

export async function initMinio(): Promise<void> {
  if (env.MINIO_ENABLED !== "true") {
    return;
  }

  const bucket = env.MINIO_BUCKET;
  const region = env.MINIO_REGION;

  const client = await getMinioClient();
  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket, region);
    GeneralLogger(LogType.SERVICE, LogLevel.INFO, `MinIO bucket created: ${bucket}`);
  }

  if (env.MINIO_PUBLIC_READ === "true") {
    const policy = JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    });
    await client.setBucketPolicy(bucket, policy);
  }

  GeneralLogger(
    LogType.SERVICE,
    LogLevel.INFO,
    `MinIO init OK: endpoint=${env.MINIO_ENDPOINT}:${env.MINIO_PORT}, bucket=${bucket}`,
  );
}
