import { spawn } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceDir = path.resolve(scriptDir, "..");

function quoteForWindowsCommand(value) {
  if (/[\s"&|<>^]/.test(value)) {
    return `"${value.replaceAll("\"", "\"\"")}"`;
  }

  return value;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function warn(message) {
  console.warn(`Warning: ${message}`);
}

function runCommand(label, command, args, { captureStdout = false, echoOutput = true } = {}) {
  console.log(`\n==> ${label}`);

  const executable =
    process.platform === "win32"
      ? process.env.ComSpec ?? "cmd.exe"
      : command;
  const finalArgs =
    process.platform === "win32"
      ? [
          "/d",
          "/s",
          "/c",
          [command, ...args].map(quoteForWindowsCommand).join(" "),
        ]
      : args;

  return new Promise((resolve, reject) => {
    const child = spawn(executable, finalArgs, {
      cwd: workspaceDir,
      stdio: captureStdout ? ["ignore", "pipe", "pipe"] : "inherit",
    });

    let stdout = "";
    let stderr = "";

    if (captureStdout) {
      child.stdout?.on("data", (chunk) => {
        const value = chunk.toString();
        stdout += value;
        if (echoOutput) {
          process.stdout.write(value);
        }
      });

      child.stderr?.on("data", (chunk) => {
        const value = chunk.toString();
        stderr += value;
        if (echoOutput) {
          process.stderr.write(value);
        }
      });
    }

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error(`${label} failed with exit code ${code ?? "unknown"}.`));
    });
  });
}

async function readJsonFile(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function validatePublishedPackageMetadata(packageJson, expectations) {
  assert(packageJson.name === expectations.name, `Unexpected package name in ${expectations.packageJsonPath}.`);
  assert(packageJson.publishConfig?.access === "public", `${expectations.name} must set publishConfig.access=public.`);
  assert(packageJson.repository?.type === "git", `${expectations.name} must declare repository.type=git.`);
  assert(packageJson.repository?.url === "git+https://github.com/wwsheng009/axiomui.git", `${expectations.name} must declare the canonical repository URL.`);
  assert(packageJson.repository?.directory === expectations.repositoryDirectory, `${expectations.name} must declare repository.directory=${expectations.repositoryDirectory}.`);
  assert(packageJson.bugs?.url === "https://github.com/wwsheng009/axiomui/issues", `${expectations.name} must declare the canonical bugs URL.`);
  assert(packageJson.homepage === expectations.homepage, `${expectations.name} must declare homepage=${expectations.homepage}.`);
  assert(Array.isArray(packageJson.files) && packageJson.files.includes("dist"), `${expectations.name} must publish the dist directory.`);

  if (expectations.typesPath !== undefined) {
    assert(packageJson.types === expectations.typesPath, `${expectations.name} must declare types=${expectations.typesPath}.`);
  }
}

function validatePackResult(packResult, expectations) {
  assert(packResult.name === expectations.name, `pnpm pack returned unexpected package ${packResult.name}.`);

  const fileSet = new Set(packResult.files.map((entry) => entry.path));

  for (const requiredFile of expectations.requiredFiles) {
    assert(fileSet.has(requiredFile), `${expectations.name} tarball is missing required file ${requiredFile}.`);
  }

  if (expectations.requiredFilePrefix !== undefined) {
    const hasMatchingFile = packResult.files.some((entry) =>
      entry.path.startsWith(expectations.requiredFilePrefix),
    );
    assert(hasMatchingFile, `${expectations.name} tarball must contain files under ${expectations.requiredFilePrefix}.`);
  }
}

async function warnOnMissingLicenseMetadata(packageJsons) {
  const licenseCandidates = ["LICENSE", "LICENSE.md", "LICENCE", "LICENCE.md"];
  const hasRootLicenseFile = (
    await Promise.all(
      licenseCandidates.map((filename) => pathExists(path.join(workspaceDir, filename))),
    )
  ).some(Boolean);

  if (!hasRootLicenseFile) {
    warn(
      "Repository root does not contain a LICENSE/LICENCE file. Public npm consumers may expect an explicit project license.",
    );
  }

  for (const packageJson of packageJsons) {
    if (typeof packageJson.license !== "string" || packageJson.license.trim() === "") {
      warn(
        `${packageJson.name} does not declare a package.json license field yet. Decide the license before a long-term public npm release.`,
      );
    }
  }
}

const publishedPackages = [
  {
    name: "@axiomui/tokens",
    packageJsonPath: path.join(workspaceDir, "packages", "tokens", "package.json"),
    repositoryDirectory: "packages/tokens",
    homepage: "https://github.com/wwsheng009/axiomui/tree/main/packages/tokens#readme",
    requiredFiles: ["README.md", "dist/styles.css", "package.json"],
  },
  {
    name: "@axiomui/react",
    packageJsonPath: path.join(workspaceDir, "packages", "react", "package.json"),
    repositoryDirectory: "packages/react",
    homepage: "https://github.com/wwsheng009/axiomui/tree/main/packages/react#readme",
    typesPath: "./dist/types/index.d.ts",
    requiredFiles: ["README.md", "dist/index.js", "dist/style.css", "dist/types/index.d.ts", "package.json"],
    requiredFilePrefix: "dist/types/",
  },
];

const packDir = await mkdtemp(path.join(os.tmpdir(), "axiomui-release-check-"));

try {
  await runCommand("Workspace typecheck", "pnpm", ["typecheck"]);
  await runCommand("Workspace tests", "pnpm", ["test"]);
  await runCommand("Workspace build", "pnpm", ["build"]);
  const tokensPackResult = await runCommand("Pack @axiomui/tokens", "pnpm", [
    "--filter",
    "@axiomui/tokens",
    "pack",
    "--json",
    "--pack-destination",
    packDir,
  ], { captureStdout: true, echoOutput: false });
  const reactPackResult = await runCommand("Pack @axiomui/react", "pnpm", [
    "--filter",
    "@axiomui/react",
    "pack",
    "--json",
    "--pack-destination",
    packDir,
  ], { captureStdout: true, echoOutput: false });

  const tarballs = (await readdir(packDir))
    .filter((entry) => entry.endsWith(".tgz"))
    .sort();

  if (tarballs.length !== 2) {
    throw new Error(
      `Expected 2 release tarballs, but found ${tarballs.length}: ${tarballs.join(", ")}`,
    );
  }

  const tokensPackageJson = await readJsonFile(publishedPackages[0].packageJsonPath);
  const reactPackageJson = await readJsonFile(publishedPackages[1].packageJsonPath);

  validatePublishedPackageMetadata(tokensPackageJson, publishedPackages[0]);
  validatePublishedPackageMetadata(reactPackageJson, publishedPackages[1]);

  const tokensPackManifest = JSON.parse(tokensPackResult.stdout.trim());
  const reactPackManifest = JSON.parse(reactPackResult.stdout.trim());

  validatePackResult(tokensPackManifest, publishedPackages[0]);
  validatePackResult(reactPackManifest, publishedPackages[1]);
  await warnOnMissingLicenseMetadata([tokensPackageJson, reactPackageJson]);

  console.log("\nRelease check completed.");
  console.log(`Verified tarballs: ${tarballs.join(", ")}`);
  console.log("Verified publish metadata and required tarball contents for @axiomui/tokens and @axiomui/react.");
} finally {
  await rm(packDir, { force: true, recursive: true });
}
