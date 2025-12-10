import fs from "fs";
import path from "path";
import protobuf from "protobufjs";

interface RpcMethod {
  name: string;
  requestType: string;
  responseType: string;
  httpMethod: "post" | "get";
  httpPath: string;
}

const extractRpcMethods = (namespace: protobuf.Namespace, packageName: string): RpcMethod[] => {
  const methods: RpcMethod[] = [];

  namespace.nestedArray.forEach((nested) => {
    if (nested instanceof protobuf.Service) {
      nested.methodsArray.forEach((method) => {
        // Parse HTTP options from the method
        const options = method.toJSON()?.options || {};
        const httpOption = options["(google.api.http)"] || {};

        let httpMethod: "post" | "get" = "post";
        let httpPath = `/${packageName}/${method.name}`;

        if (httpOption.post) {
          httpMethod = "post";
          httpPath = httpOption.post;
        } else if (httpOption.get) {
          httpMethod = "get";
          httpPath = httpOption.get;
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

// Generate Frontend API file
const generateFrontendApi = (methods: RpcMethod[], packageName: string): string => {
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

`;

  methods.forEach((method) => {
    const funcName = toCamelCase(method.name);

    if (method.httpMethod === "post") {
      output += `export const ${funcName} = async (request: ${method.requestType}): Promise<${method.responseType}> => {
  const response = await fetch(\`\${API_BASE_URL}/${packageName}/${method.httpPath}\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    } else {
      // GET method
      output += `export const ${funcName} = async (request: ${method.requestType}): Promise<${method.responseType}> => {
  const params = new URLSearchParams(request as Record<string, string>).toString();
  const response = await fetch(\`\${API_BASE_URL}/${packageName}/${method.httpPath}?\${params}\`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
  // check the method is get or post and import right for react query
  const hasMutation = methods.some((method) => method.httpMethod !== "get");
  const hasQuery = methods.some((method) => method.httpMethod === "get");
  const reactQueryImports = [
    hasMutation ? "useMutation" : null,
    hasQuery ? "useQuery" : null,
  ]
    .filter(Boolean)
    .join(", ");

  console.log(reactQueryImports);

  let output = `// this is code generated usequery for api
import { ${reactQueryImports} } from "@tanstack/react-query";
import type { ${importTypes} } from "@Jade/types/${packageName}.d";
import {
    ${apiImports.join(",\n    ")},
} from "./api";

`;

  methods.forEach((method) => {
    const funcName = toCamelCase(method.name);
    const hookName = `use${method.name}`;

    if (method.httpMethod === "post") {
      output += `export const ${hookName} = ({ onSuccess, onError }: { onSuccess?: (data: ${method.responseType}) => void, onError?: (error: Error) => void }) => {
    return useMutation<${method.responseType}, Error, ${method.requestType}>({
        mutationFn: (request: ${method.requestType}) => ${funcName}(request),
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    });
};

`;
    } else {
      // GET method - use useQuery
      output += `export const ${hookName} = (request: ${method.requestType}, options?: { enabled?: boolean }) => {
    return useQuery<${method.responseType}, Error>({
        queryKey: ["${packageName}", "${method.name}", request],
        queryFn: () => ${funcName}(request),
        enabled: options?.enabled ?? true,
    });
};

`;
    }
  });

  return output;
};

// Generate Backend DTO file
const generateBackendDto = (methods: RpcMethod[], packageName: string): string => {
  let output = `import { z } from "zod/v4";

`;

  methods.forEach((method) => {
    const schemaName = `${toCamelCase(method.name)}Schema`;
    const dtoName = `${method.name}Dto`;

    output += `// Schema used to validate the ${toCamelCase(method.name)} request body
export const ${schemaName} = z.object({
  // TODO: Add validation rules
});

// Inferred TypeScript DTO type for codegen / services
export type ${dtoName} = z.infer<typeof ${schemaName}>;

`;
  });

  return output;
};

// Generate Backend Routes file
const generateBackendRoutes = (methods: RpcMethod[], packageName: string): string => {
  // Capitalize first letter for service class name
  const serviceName = packageName.charAt(0).toUpperCase() + packageName.slice(1) + "Service";
  const serviceFileName = `${packageName}.service`;

  // Collect all response types and schema imports
  const responseTypes = methods.map((m) => m.responseType);
  const schemaImports = methods.map((m) => `${toCamelCase(m.name)}Schema`);

  let output = `import type { z } from "zod";

import express from "express";

import type { ${responseTypes.join(", ")} } from "@Ciri/types/${packageName}";

import { ${schemaImports.join(", ")} } from "@Ciri/core/dto/${packageName}.dto";
import { getContext } from "@Ciri/core/middlewares";
import { ${serviceName} } from "@Ciri/core/services/${serviceFileName}";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody } from "@Ciri/core/utils/validation";

const router = express.Router();
const ${toCamelCase(serviceName)} = new ${serviceName}();

`;

  // Add type definitions for each method
  methods.forEach((method) => {
    const schemaName = `${toCamelCase(method.name)}Schema`;
    const typeName = `${method.name}RequestBody`;
    output += `type ${typeName} = z.infer<typeof ${schemaName}>;\n`;
  });

  output += "\n";

  // Add routes for each method
  methods.forEach((method) => {
    const schemaName = `${toCamelCase(method.name)}Schema`;
    const typeName = `${method.name}RequestBody`;
    const serviceMethod = method.name;

    if (method.httpMethod === "post") {
      output += `router.post(
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
      sendSuccessResponse<${method.responseType}>(res, 201, response);
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
      // GET method
      output += `router.get(
  "/${method.httpPath}",
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const response = await ${toCamelCase(serviceName)}.${serviceMethod}(ctx, req.query as ${typeName});
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      sendSuccessResponse<${method.responseType}>(res, 200, response);
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
  const beDtoPath = path.join(rootDir, "be", "core", "dto", `${packageName}.dto.ts`);

  // Ensure directories exist
  if (!fs.existsSync(feServicesDir)) {
    fs.mkdirSync(feServicesDir, { recursive: true });
  }
  if (!fs.existsSync(beRoutesDir)) {
    fs.mkdirSync(beRoutesDir, { recursive: true });
  }
  const dtoDir = path.dirname(beDtoPath);
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir, { recursive: true });
  }

  // Generate and write frontend files (always replace)
  const feApiContent = generateFrontendApi(methods, packageName);
  const feUseQueryContent = generateFrontendUseQuery(methods, packageName);

  fs.writeFileSync(feApiPath, feApiContent);
  fs.writeFileSync(feUseQueryPath, feUseQueryContent);

  // Generate and write backend files (always replace)
  const beRoutesContent = generateBackendRoutes(methods, packageName);
  const beDtoContent = generateBackendDto(methods, packageName);

  fs.writeFileSync(beRoutesPath, beRoutesContent);

  console.log("\n📡 API Generation:");
  console.log(`✅ Frontend API: ${feApiPath}`);
  console.log(`✅ Frontend Hooks: ${feUseQueryPath}`);
  console.log(`✅ Backend Routes: ${beRoutesPath}`);
  if (fs.existsSync(beDtoPath)) {
    console.log(`↩️ Backend DTO exists, not overwritten: ${beDtoPath}`);
  }
  else {
    fs.writeFileSync(beDtoPath, beDtoContent);
    console.log(`✅ Backend DTO: ${beDtoPath}`);
  }
};
