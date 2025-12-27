declare module "minio" {
  export type ClientOptions = {
    endPoint: string;
    port?: number;
    useSSL?: boolean;
    accessKey: string;
    secretKey: string;
    region?: string;
  };

  export class Client {
    constructor(options: ClientOptions);
    bucketExists(bucket: string): Promise<boolean>;
    makeBucket(bucket: string, region?: string): Promise<void>;
    setBucketPolicy(bucket: string, policy: string): Promise<void>;
  }
}


