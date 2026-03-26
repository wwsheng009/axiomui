import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(scriptDir, "..");
const distTypesDir = path.join(packageDir, "dist", "types");

function runTypeBuild() {
  const command =
    process.platform === "win32"
      ? process.env.ComSpec ?? "cmd.exe"
      : "tsc";
  const args =
    process.platform === "win32"
      ? ["/d", "/s", "/c", "tsc -p tsconfig.build.json"]
      : ["-p", "tsconfig.build.json"];

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: packageDir,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Type build failed with exit code ${code ?? "unknown"}.`));
    });
  });
}

await rm(distTypesDir, { force: true, recursive: true });
await runTypeBuild();

console.log("Built @axiomui/react types");
