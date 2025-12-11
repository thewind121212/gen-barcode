import fs from "fs";
import path from "path";
import protobuf from "protobufjs";
import { fileURLToPath } from "url";
import { GenerateFileTypeScript } from "./gen-types";
import { GenerateApi } from "./gen-api";
import { GenerateOpenApi } from "./gen-openapi";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get folder name from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Error: Please provide a folder name. Usage: npm run gen -- <folder_name> [--test]");
  process.exit(1);
}

// Check for test mode flag
const testMode = args.includes("--test");
const packageName = args.find((arg) => !arg.startsWith("--")) as string;

if (!packageName) {
  console.error("Error: Please provide a folder name. Usage: npm run gen -- <folder_name> [--test]");
  process.exit(1);
}

const protoDir = path.resolve(__dirname, "../bff", packageName);
const protoPath = path.join(protoDir, `${packageName}.proto`);

if (!fs.existsSync(protoDir)) {
  console.error(`Error: Folder not found: ${protoDir}`);
  process.exit(1);
}

if (!fs.existsSync(protoPath)) {
  console.error(`Error: Proto file not found: ${protoPath}`);
  process.exit(1);
}

const root = await protobuf.load(protoPath);
const pkg = root.lookup(packageName) as protobuf.Namespace;

function validateProtoSchema(root: protobuf.Root, pkg: protobuf.Namespace, packageName: string) {
  if (!pkg) {
    console.error(`Error: Package "${packageName}" not found in proto file.`);
    process.exit(1);
  }

  const nested = pkg.nestedArray || [];
  const services = nested.filter((n) => n instanceof protobuf.Service) as protobuf.Service[];

  if (services.length === 0) {
    console.error(`Error: No services defined in package "${packageName}". At least one service is required.`);
    process.exit(1);
  }

  try {
    for (const service of services) {
      for (const methodName of Object.keys(service.methods)) {
        const method = service.methods[methodName];

        // Ensure request/response types are resolvable
        root.lookupType(method.requestType);
        root.lookupType(method.responseType);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: Proto schema validation failed - ${message}`);
    process.exit(1);
  }

  console.log("✅ Proto schema validated successfully.");
}

export const OptionsField = "proto3_optional";
export const TypeMapJavaScript: Record<string, string> = {
  string: "string",
  bool: "boolean",
  int32: "number",
  int64: "number",
  uint32: "number",
  uint64: "number",
  sint32: "number",
  sint64: "number",
  fixed32: "number",
  fixed64: "number",
  sfixed32: "number",
  sfixed64: "number",
  float: "number",
  double: "number",
  bytes: "Uint8Array",
};

export const TypeMapGolang: Record<string, string> = {
  string: "string",
  bool: "bool",
  int32: "int32",
  int64: "int64",
  uint32: "uint32",
  uint64: "uint64",
  sint32: "int32",
  sint64: "int64",
  fixed32: "uint32",
  fixed64: "uint64",
  sfixed32: "int32",
  sfixed64: "int64",
  float: "float32",
  double: "float64",
  bytes: "[]byte",
};

if (testMode) {
  console.log("\n🧪 TEST MODE - Output to ./temp folder\n");
}

// Validate the proto file before generating any code
validateProtoSchema(root, pkg, packageName);

// Generate TypeScript types
GenerateFileTypeScript(pkg, packageName, protoDir);

// Generate API files (routes, services, frontend api, hooks)
GenerateApi(pkg, packageName, protoDir, {
  testMode,
  outputDir: testMode ? "./temp" : undefined,
});

// Generate OpenAPI 3.0 (Swagger) specification
GenerateOpenApi(root, pkg, packageName, protoDir, {
  testMode,
  outputDir: testMode ? "./temp" : undefined,
});

const rootDir = path.resolve(__dirname, "..");
const typesDir = path.join(rootDir, "types");
const outputDir = testMode ? path.resolve(rootDir, "./temp") : rootDir;

console.log("\n✨ Generation Complete! ✨");
console.log(`📦 Package: ${packageName}`);
console.log(`📁 Output: ${outputDir}`);
console.log(`✅ TypeScript: ${path.join(typesDir, `${packageName}.d.ts`)}`);
console.log("\n🎉 All files generated successfully!");
