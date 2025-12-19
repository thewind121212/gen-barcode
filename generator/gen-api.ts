import fs from "fs";
import path from "path";
import protobuf from "protobufjs";

export interface RpcMethod {
  name: string;
  requestType: string;
  responseType: string;
  httpMethod: "post" | "get" | "put" | "patch";
  httpPath: string;
}

interface ApiVersionConfig {
  enumName: string;
  values: Record<string, number>;
}

/**
 * Try to load API version configuration from a shared `config.proto` file.
 * This lets us generate a version enum + prefix into the frontend API.
 */
const loadApiVersionConfig = (protoDir: string): ApiVersionConfig | null => {
  try {
    // `protoDir` is `<root>/bff/<packageName>`, so config lives one level up
    const rootDir = path.resolve(protoDir, "..");
    const configProtoPath = path.join(rootDir, "config.proto");

    if (!fs.existsSync(configProtoPath)) {
      return null;
    }

    const root = protobuf.loadSync(configProtoPath);
    const apiVersionEnum = root.lookupEnum("config.ApiVersion") as protobuf.Enum | null;

    if (!apiVersionEnum) {
      return null;
    }

    return {
      enumName: apiVersionEnum.name,
      values: apiVersionEnum.values,
    };
  } catch {
    // If anything goes wrong we just skip version-aware generation
    return null;
  }
};

export const extractRpcMethods = (namespace: protobuf.Namespace, packageName: string): RpcMethod[] => {
  const methods: RpcMethod[] = [];

  namespace.nestedArray.forEach((nested) => {
    if (nested instanceof protobuf.Service) {
      nested.methodsArray.forEach((method) => {
        // Parse HTTP options from the method
        const json = typeof method.toJSON === "function" ? method.toJSON() : {};
        const options = (json as any).options || {};

        let httpOption: { post?: string; get?: string; put?: string; patch?: string } = {};

        if (Array.isArray((json as any).parsedOptions)) {
          for (const entry of (json as any).parsedOptions as any[]) {
            if (entry["(google.api.http)"]) {
              httpOption = entry["(google.api.http)"];
              break;
            }
          }
        }

        // Fallback: reconstruct from flattened option keys if parsedOptions is missing
        if (!httpOption.post && !httpOption.get) {
          const flatPost = options["(google.api.http).post"];
          const flatGet = options["(google.api.http).get"];
          if (flatPost) {
            httpOption.post = flatPost;
          }
          if (flatGet) {
            httpOption.get = flatGet;
          }
        }

        let httpMethod: "post" | "get" | "put" | "patch" = "post";
        let httpPath = `/${packageName}/${method.name}`;

        if (httpOption.post) {
          httpMethod = "post";
          httpPath = httpOption.post;
        } else if (httpOption.get) {
          httpMethod = "get";
          httpPath = httpOption.get;
        } else if (httpOption.put) {
          httpMethod = "put";
          httpPath = httpOption.put;
        } else if (httpOption.patch) {
          httpMethod = "patch";
          httpPath = httpOption.patch;
        }

        // Clean up the path - extract the endpoint part
        const pathParts = httpPath.split("/").filter(Boolean);
        const endpoint = pathParts[pathParts.length - 1] || method.name;

        methods.push({
          name: method.name,
          requestType: method.requestType,
          responseType: method.responseType,
          httpMethod,
          httpPath: endpoint,
        });
      });
    }
  });

  return methods;
};

// Convert PascalCase to camelCase
const toCamelCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

// Convert PascalCase / camelCase to kebab-case
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

// Generate Frontend API file
const generateFrontendApi = (
  methods: RpcMethod[],
  packageName: string,
  apiVersionConfig: ApiVersionConfig | null,
): string => {
  const imports = new Set<string>();
  methods.forEach((method) => {
    imports.add(method.requestType);
    imports.add(method.responseType);
  });

  const importTypes = Array.from(imports).sort().join(", ");

  let output = `//==== This is code generated
import Session from "supertokens-auth-react/recipe/session";
import type { ${importTypes} } from "@Jade/types/${packageName}.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildHeaders = (storeId?: string) => ({
  "Content-Type": "application/json",
  ...(storeId ? { "x-store-id": storeId } : {}),
});

`;

  if (apiVersionConfig) {
    const entries = Object.entries(apiVersionConfig.values);

    // Build enum body
    const enumBody = entries
      .map(([name, value]) => `  ${name} = ${value},`)
      .join("\n");

    // Prefer a concrete version (e.g. API_VERSION_V1) as default
    let defaultKey = "API_VERSION_V1";
    if (!(defaultKey in apiVersionConfig.values)) {
      const preferred = entries
        .map(([name]) => name)
        .filter((name) => !name.endsWith("_UNSPECIFIED"))[0];
      defaultKey = preferred || entries[0]?.[0] || "API_VERSION_UNSPECIFIED";
    }

    // Map enum -> URL path segment (API_VERSION_V1 -> "v1")
    const pathMappings = entries
      .map(([name]) => {
        if (name.endsWith("_UNSPECIFIED")) {
          return `  [ApiVersion.${name}]: "",`;
        }
        const suffix = name.split("_").pop() ?? "1";
        const normalized = suffix.replace(/^V/i, "");
        const segment = `v${normalized}`.toLowerCase();
        return `  [ApiVersion.${name}]: "${segment}",`;
      })
      .join("\n");

    output += `
export enum ApiVersion {
${enumBody}
}

// Change this to switch between API versions
export const API_VERSION: ApiVersion = ApiVersion.${defaultKey};

const API_VERSION_PATHS: Record<ApiVersion, string> = {
${pathMappings}
};

const API_VERSION_PREFIX = API_VERSION_PATHS[API_VERSION];

`;
  }

  methods.forEach((method) => {
    const funcName = toCamelCase(method.name);

    if (method.httpMethod === "get") {
      const urlTemplate = apiVersionConfig
        ? `\`\${API_BASE_URL}/\${API_VERSION_PREFIX}/${packageName}/${method.httpPath}?\${params}\``
        : `\`\${API_BASE_URL}/${packageName}/${method.httpPath}?\${params}\``;

      output += `export const ${funcName} = async (request: ${method.requestType}, storeId?: string): Promise<${method.responseType}> => {
  const params = new URLSearchParams(request as unknown as Record<string, string>).toString();
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(${urlTemplate}, {
    method: "GET",
    headers: buildHeaders(resolvedStoreId),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

`;
    } else {
      const urlTemplate = apiVersionConfig
        ? `\`\${API_BASE_URL}/\${API_VERSION_PREFIX}/${packageName}/${method.httpPath}\``
        : `\`\${API_BASE_URL}/${packageName}/${method.httpPath}\``;
      const httpVerb = method.httpMethod.toUpperCase();

      output += `export const ${funcName} = async (request: ${method.requestType}, storeId?: string): Promise<${method.responseType}> => {
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(${urlTemplate}, {
    method: "${httpVerb}",
    headers: buildHeaders(resolvedStoreId),
    credentials: "include",
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

`;
    }
  });

  return output;
};

// Generate Frontend useQuery file
const generateFrontendUseQuery = (methods: RpcMethod[], packageName: string): string => {
  const imports = new Set<string>();
  const apiImports: string[] = [];

  methods.forEach((method) => {
    imports.add(method.requestType);
    imports.add(method.responseType);
    apiImports.push(toCamelCase(method.name));
  });

  const importTypes = Array.from(imports).sort().join(", ");
  // check the method is get or others and import right for react query
  const hasMutation = methods.some((method) => method.httpMethod !== "get");
  const hasQuery = methods.some((method) => method.httpMethod === "get");
  const reactQueryImports = [
    hasMutation ? "useMutation" : null,
    hasQuery ? "useQuery, type UseQueryOptions" : null,
  ]
    .filter(Boolean)
    .join(", ");

  let output = `// this is code generated usequery for api
import { ${reactQueryImports} } from "@tanstack/react-query";
import type { ${importTypes} } from "@Jade/types/${packageName}.d";
import {
    ${apiImports.join(",\n    ")},
} from "./api";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

`;

  methods.forEach((method) => {
    const funcName = toCamelCase(method.name);
    const hookName = `use${method.name}`;

    if (method.httpMethod === "get") {
      output += `export const ${hookName} = (request: ${method.requestType}, options?: UseQueryOptions<ApiSuccessResponse<${method.responseType}>, Error, ${method.requestType}>) => {
    return useQuery<ApiSuccessResponse<${method.responseType}>, Error, ${method.requestType}>({
        queryKey: ["${packageName}", "${method.name}", request],
        queryFn: () => ${funcName}(request, (request as any)?.storeId) as unknown as ApiSuccessResponse<${method.responseType}>,
        ...options,
    });
};

`;
    } else {
      output += `export const ${hookName} = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<${method.responseType}>) => void, onError?: (error: Error) => void }) => {
    return useMutation<${method.responseType}, Error, ${method.requestType}>({
        mutationFn: (request: ${method.requestType}) => ${funcName}(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<${method.responseType}>),
        onError: (error) => onError?.(error),
    });
};

`;
    }
  });

  return output;
};

// Generate Backend Routes file
const generateBackendRoutes = (methods: RpcMethod[], packageName: string): string => {
  // Capitalize first letter for service class name
  const serviceName = packageName.charAt(0).toUpperCase() + packageName.slice(1) + "Service";
  const serviceFileName = `${packageName}.service`;

  const hasBodyMethods = methods.some((m) => m.httpMethod !== "get");

  // Collect all response types (GET handlers don't need request types here)
  const responseTypes = methods.map((m) => m.responseType);
  const typeImports = Array.from(new Set([...responseTypes])).sort();

  let output = "";

  if (hasBodyMethods) {
    output += `import type { z } from "zod";

import express from "express";

import type { ${typeImports.join(", ")} } from "@Ciri/types/${packageName}";
`;
  } else {
    output += `import express from "express";

import type { ${typeImports.join(", ")} } from "@Ciri/types/${packageName}";
`;
  }

  // Import each schema from its own DTO file (non-GET only)
  methods
    .filter((method) => method.httpMethod !== "get")
    .forEach((method) => {
      const schemaName = `${toCamelCase(method.name)}Schema`;
      const dtoImportPath = `@Ciri/core/dto/${packageName}/${toKebabCase(method.name)}.dto`;
      output += `
import { ${schemaName} } from "${dtoImportPath}";
`;
    });

  output += `import { getContext } from "@Ciri/core/middlewares";
import { ${serviceName} } from "@Ciri/core/services/${serviceFileName}";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody } from "@Ciri/core/utils/validation";

const router = express.Router();
const ${toCamelCase(serviceName)} = new ${serviceName}();

`;

  // Add type definitions for each method
  methods.forEach((method) => {
    let responseServicesName = `${toCamelCase(method.name)}ResponseServices`;
    responseServicesName = responseServicesName.charAt(0).toUpperCase() + responseServicesName.slice(1);

    if (method.httpMethod !== "get") {
      const schemaName = `${toCamelCase(method.name)}Schema`;
      const typeName = `${method.name}RequestBody`;
      output += `export type ${typeName} = z.infer<typeof ${schemaName}>;\n`;
    }

    output += `export type ${responseServicesName} = {
      resData: ${method.responseType} | null;
      error: string | null;
    };\n`;
  });

  output += "\n";

  // Add routes for each method
  methods.forEach((method) => {
    const serviceMethod = method.name;

    if (method.httpMethod === "get") {
      output += `router.get(
  "/${method.httpPath}",
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const response = await ${toCamelCase(serviceName)}.${serviceMethod}(ctx);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<${method.responseType}>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "${packageName.charAt(0).toUpperCase() + packageName.slice(1)} ${serviceMethod}:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

`;
    } else {
      const schemaName = `${toCamelCase(method.name)}Schema`;
      const typeName = `${method.name}RequestBody`;
      output += `router.${method.httpMethod}(
  "/${method.httpPath}",
  validateBody<${typeName}>(${schemaName}),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<${typeName}>(req);
      const response = await ${toCamelCase(serviceName)}.${serviceMethod}(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<${method.responseType}>(res, ${method.httpMethod === "post" ? "201" : "200"}, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "${packageName.charAt(0).toUpperCase() + packageName.slice(1)} ${serviceMethod}:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

`;
    }
  });

  output += "export default router;\n";

  return output;
};

interface GenerateApiOptions {
  testMode?: boolean;
  outputDir?: string;
}

export const GenerateApi = (
  pkg: protobuf.Namespace,
  packageName: string,
  protoDir: string,
  options: GenerateApiOptions = {},
) => {
  const { testMode = false, outputDir } = options;
  const methods = extractRpcMethods(pkg, packageName);
  const apiVersionConfig = loadApiVersionConfig(protoDir);

  if (methods.length === 0) {
    console.log("⚠️  No RPC methods found in the proto file");
    return;
  }

  const rootDir = outputDir
    ? path.resolve(protoDir, "..", "..", outputDir)
    : path.resolve(protoDir, "..", "..");

  // Frontend paths
  const feServicesDir = path.join(rootDir, "fe", "src", "services", packageName);
  const feApiPath = path.join(feServicesDir, "api.ts");
  const feUseQueryPath = path.join(feServicesDir, "useQuery.ts");

  // Backend paths
  const beRoutesDir = path.join(rootDir, "be", "core", "api", packageName);
  const beRoutesPath = path.join(beRoutesDir, `${packageName}.routes.ts`);
  const beDtoDir = path.join(rootDir, "be", "core", "dto", packageName);

  // Ensure directories exist
  if (!fs.existsSync(feServicesDir)) {
    fs.mkdirSync(feServicesDir, { recursive: true });
  }
  if (!fs.existsSync(beRoutesDir)) {
    fs.mkdirSync(beRoutesDir, { recursive: true });
  }
  if (!fs.existsSync(beDtoDir)) {
    fs.mkdirSync(beDtoDir, { recursive: true });
  }

  // Generate and write frontend files (always replace)
  const feApiContent = generateFrontendApi(methods, packageName, apiVersionConfig);
  const feUseQueryContent = generateFrontendUseQuery(methods, packageName);

  fs.writeFileSync(feApiPath, feApiContent);
  fs.writeFileSync(feUseQueryPath, feUseQueryContent);

  // Generate and write backend files (always replace)
  const beRoutesContent = generateBackendRoutes(methods, packageName);
  fs.writeFileSync(beRoutesPath, beRoutesContent);

  // Generate one DTO file per RPC method.
  // If a DTO file already exists for a method, we DO NOT overwrite it.
  // If the method is a get method, we DO NOT generate a DTO file.
  methods.forEach((method) => {
    if (method.httpMethod === "get") {
      return;
    }
    const schemaName = `${toCamelCase(method.name)}Schema`;
    const dtoName = `${method.name}Dto`;
    const dtoFileName = `${toKebabCase(method.name)}.dto.ts`;
    const dtoPath = path.join(beDtoDir, dtoFileName);

    const dtoContent = `import { z } from "zod/v4";

// Schema used to validate the ${toCamelCase(method.name)} request body
export const ${schemaName} = z.object({
  // TODO: Add validation rules
});

// Inferred TypeScript DTO type for codegen / services
export type ${dtoName} = z.infer<typeof ${schemaName}>;
`;

    if (!fs.existsSync(dtoPath)) {
      fs.writeFileSync(dtoPath, dtoContent);
    }
  });

  console.log("\n📡 API Generation:");
  console.log(`✅ Frontend API: ${feApiPath}`);
  console.log(`✅ Frontend Hooks: ${feUseQueryPath}`);
  console.log(`✅ Backend Routes: ${beRoutesPath}`);
  console.log(`✅ Backend DTOs dir: ${beDtoDir}`);
};
