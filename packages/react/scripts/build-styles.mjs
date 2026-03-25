import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(scriptDir, "..");
const srcDir = path.join(packageDir, "src");
const componentsDir = path.join(srcDir, "components");
const stylesEntryFile = path.join(srcDir, "styles", "index.css");
const distDir = path.join(packageDir, "dist");
const distComponentsDir = path.join(distDir, "components");
const distStyleFile = path.join(distDir, "style.css");

async function copyCssTree(sourceDir, targetDir) {
  const entries = await readdir(sourceDir, { withFileTypes: true });

  await mkdir(targetDir, { recursive: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await copyCssTree(sourcePath, targetPath);
        return;
      }

      if (entry.isFile() && entry.name.endsWith(".css")) {
        await cp(sourcePath, targetPath);
      }
    }),
  );
}

await rm(distComponentsDir, { force: true, recursive: true });
await copyCssTree(componentsDir, distComponentsDir);

const stylesEntry = await readFile(stylesEntryFile, "utf8");
const rewrittenStylesEntry = stylesEntry.replaceAll("../components/", "./components/");

await mkdir(distDir, { recursive: true });
await writeFile(distStyleFile, rewrittenStylesEntry, "utf8");

console.log("Built @axiomui/react styles");
