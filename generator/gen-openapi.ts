import fs from "fs";
import path from "path";
import protobuf from "protobufjs";

import { OptionsField } from "./main";
import { extractRpcMethods, RpcMethod } from "./gen-api";

interface GenerateOpenApiOptions {
  title?: string;
  version?: string;
  baseUrl?: string;
  testMode?: boolean;
  outputDir?: string;
}

type OpenApiSchema = Record<string, any>;

const getOptionals = (field: protobuf.Field): boolean => {
  return Boolean(field.toJSON()?.options?.[OptionsField]);
};

const protoFieldToOpenApi = (field: protobuf.Field): { schema: any; isRequired: boolean } => {
  const isOptional = getOptionals(field);
  const isArray = field.repeated;

  const baseType = field.type;

  let schema: any;

  const primitiveMap: Record<
    string,
    {
      type: string;
      format?: string;
    }
  > = {
    string: { type: "string" },
    bool: { type: "boolean" },
    double: { type: "number", format: "double" },
    float: { type: "number", format: "float" },
    int32: { type: "integer", format: "int32" },
    uint32: { type: "integer", format: "int32" },
    sint32: { type: "integer", format: "int32" },
    fixed32: { type: "integer", format: "int32" },
    sfixed32: { type: "integer", format: "int32" },
    int64: { type: "string", format: "int64" },
    uint64: { type: "string", format: "int64" },
    sint64: { type: "string", format: "int64" },
    fixed64: { type: "string", format: "int64" },
    sfixed64: { type: "string", format: "int64" },
    bytes: { type: "string", format: "byte" },
  };

  if (primitiveMap[baseType]) {
    schema = { ...primitiveMap[baseType] };
  } else {
    // Assume a message / enum type
    const refName = baseType.split(".").pop() || baseType;
    schema = { $ref: `#/components/schemas/${refName}` };
  }

  if (isArray) {
    schema = {
      type: "array",
      items: schema,
    };
  }

  return {
    schema,
    isRequired: !isOptional && !isArray,
  };
};

const collectSchemasFromNamespace = (namespace: protobuf.Namespace): OpenApiSchema => {
  const schemas: OpenApiSchema = {};

  namespace.nestedArray.forEach((nested) => {
    if (nested instanceof protobuf.Type) {
      const properties: Record<string, any> = {};
      const required: string[] = [];

      nested.fieldsArray.forEach((field) => {
        const { schema, isRequired } = protoFieldToOpenApi(field);
        properties[field.name] = schema;
        if (isRequired) {
          required.push(field.name);
        }
      });

      schemas[nested.name] = {
        type: "object",
        properties,
        ...(required.length ? { required } : {}),
      };
    } else if (nested instanceof protobuf.Enum) {
      const values = Object.keys(nested.values);
      schemas[nested.name] = {
        type: "string",
        enum: values,
      };
    } else if (nested instanceof protobuf.Namespace) {
      Object.assign(schemas, collectSchemasFromNamespace(nested));
    }
  });

  return schemas;
};

const buildPathsObject = (
  root: protobuf.Root,
  namespace: protobuf.Namespace,
  packageName: string,
  methods: RpcMethod[],
): Record<string, any> => {
  const paths: Record<string, any> = {};

  methods.forEach((method) => {
    const fullPath = `/${packageName}/${method.httpPath}`;

    const operation: any = {
      operationId: method.name,
      summary: method.name,
      tags: [packageName],
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${method.responseType}`,
              },
            },
          },
        },
      },
    };

    if (method.httpMethod === "post") {
      operation.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${method.requestType}`,
            },
          },
        },
      };
    } else {
      // GET: convert requestType fields into query parameters if possible
      try {
        const reqType = root.lookupType(method.requestType) as protobuf.Type;
        if (reqType && reqType.fieldsArray) {
          operation.parameters = reqType.fieldsArray.map((field) => {
            const { schema, isRequired } = protoFieldToOpenApi(field);
            return {
              name: field.name,
              in: "query",
              required: isRequired,
              schema,
            };
          });
        }
      } catch {
        // If lookup fails, just skip query parameter generation
      }
    }

    if (!paths[fullPath]) {
      paths[fullPath] = {};
    }

    paths[fullPath][method.httpMethod] = operation;
  });

  return paths;
};

const createBaseOpenApiDoc = (
  packageName: string,
  options: GenerateOpenApiOptions,
): Record<string, any> => {
  const { title, version, baseUrl } = options;

  return {
    openapi: "3.0.0",
    info: {
      title: title || `${packageName} API`,
      version: version || "1.0.0",
    },
    servers: [
      {
        url: baseUrl || "http://localhost:3000",
      },
    ],
    paths: {},
    components: {
      schemas: {},
    },
  };
};

export const GenerateOpenApi = (
  root: protobuf.Root,
  pkg: protobuf.Namespace,
  packageName: string,
  protoDir: string,
  options: GenerateOpenApiOptions = {},
) => {
  const { testMode = false, outputDir } = options;

  const methods = extractRpcMethods(pkg, packageName);
  if (methods.length === 0) {
    console.log("⚠️  No RPC methods found in the proto file for OpenAPI generation");
    return;
  }

  const schemas = collectSchemasFromNamespace(pkg);
  const paths = buildPathsObject(root, pkg, packageName, methods);

  const rootDir = outputDir
    ? path.resolve(protoDir, "..", "..", outputDir)
    : path.resolve(protoDir, "..", "..");

  const openApiDir = path.join(rootDir, "openapi");
  if (!fs.existsSync(openApiDir)) {
    fs.mkdirSync(openApiDir, { recursive: true });
  }

  const filePath = path.join(openApiDir, `${packageName}.openapi.json`);

  let existingDoc: Record<string, any> | null = null;
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      existingDoc = JSON.parse(content);
    } catch {
      existingDoc = null;
    }
  }

  const baseDoc =
    existingDoc && typeof existingDoc === "object"
      ? existingDoc
      : createBaseOpenApiDoc(packageName, options);

  baseDoc.paths = paths;
  baseDoc.components = baseDoc.components || {};
  baseDoc.components.schemas = schemas;

  fs.writeFileSync(filePath, JSON.stringify(baseDoc, null, 2), "utf8");

  const modeLabel = testMode ? " (test mode)" : "";
  console.log(`✅ OpenAPI 3.0 spec generated${modeLabel}: ${filePath}`);
};

