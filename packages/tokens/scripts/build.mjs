import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(scriptDir, "..");
const srcFile = path.join(packageDir, "src", "styles.css");
const distDir = path.join(packageDir, "dist");
const distFile = path.join(distDir, "styles.css");

await mkdir(distDir, { recursive: true });
await cp(srcFile, distFile);

console.log("Built @axiomui/tokens");

