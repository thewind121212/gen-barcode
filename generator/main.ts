import fs from "fs";
import path from "path";
import protobuf from "protobufjs";
import { fileURLToPath } from "url";
import { GenerateFileTypeScript } from "./gen-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get folder name from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Error: Please provide a folder name. Usage: npm run gen -- <folder_name>");
  process.exit(1);
}

const packageName = args[0];
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

GenerateFileTypeScript(pkg, packageName, protoDir);

const rootDir = path.resolve(__dirname, "..");
const typesDir = path.join(rootDir, "types");

console.log("\n✨ Generation Complete! ✨");
console.log(`📦 Package: ${packageName}`);
console.log(`📁 Output: ${typesDir}`);
console.log(`✅ TypeScript: ${path.join(typesDir, `${packageName}.d.ts`)}`);
console.log("\n🎉 All files generated successfully!");



