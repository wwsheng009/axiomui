import { createWriteStream } from "node:fs";
import { access, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const ACTIONLINT_VERSION = "1.7.11";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceDir = path.resolve(scriptDir, "..");

function resolveActionlintTarget() {
  const platformMap = {
    darwin: "darwin",
    linux: "linux",
    win32: "windows",
  };
  const archMap = {
    arm64: "arm64",
    ia32: "386",
    x64: "amd64",
  };

  const platform = platformMap[process.platform];
  const arch = archMap[process.arch];

  if (!platform || !arch) {
    throw new Error(
      `Unsupported platform for actionlint: ${process.platform}/${process.arch}`,
    );
  }

  return { platform, arch };
}

async function fileExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function downloadFile(url, targetPath) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "axiomui-workflow-lint",
    },
  });

  if (!response.ok || response.body === null) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(targetPath));
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function downloadFileWithRetry(url, targetPath, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await downloadFile(url, targetPath);
      return;
    } catch (error) {
      lastError = error;
      await rm(targetPath, { force: true });

      if (attempt === attempts) {
        break;
      }

      console.warn(
        `Download failed (${attempt}/${attempts}). Retrying actionlint download...`,
      );
      await sleep(1000 * attempt);
    }
  }

  throw lastError;
}

function runCommand(command, args, cwd = workspaceDir) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}.`));
    });
  });
}

async function ensureActionlintBinary() {
  const { platform, arch } = resolveActionlintTarget();
  const extension = platform === "windows" ? "zip" : "tar.gz";
  const archiveName = `actionlint_${ACTIONLINT_VERSION}_${platform}_${arch}.${extension}`;
  const binaryName = platform === "windows" ? "actionlint.exe" : "actionlint";
  const cacheDir = path.join(
    os.tmpdir(),
    "axiomui-actionlint",
    ACTIONLINT_VERSION,
    `${platform}-${arch}`,
  );
  const archivePath = path.join(cacheDir, archiveName);
  const binaryPath = path.join(cacheDir, binaryName);

  if (await fileExists(binaryPath)) {
    return binaryPath;
  }

  await mkdir(cacheDir, { recursive: true });

  const downloadUrl =
    `https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/${archiveName}`;

  console.log(`Downloading actionlint v${ACTIONLINT_VERSION}...`);
  await downloadFileWithRetry(downloadUrl, archivePath);

  if (platform === "windows") {
    await runCommand("pwsh", [
      "-NoLogo",
      "-NoProfile",
      "-Command",
      `Expand-Archive -Path '${archivePath.replaceAll("'", "''")}' -DestinationPath '${cacheDir.replaceAll("'", "''")}' -Force`,
    ]);
  } else {
    await runCommand("tar", ["-xzf", archivePath, "-C", cacheDir]);
  }

  await rm(archivePath, { force: true });

  if (!(await fileExists(binaryPath))) {
    throw new Error(`actionlint binary was not found after extraction: ${binaryPath}`);
  }

  return binaryPath;
}

const binaryPath = await ensureActionlintBinary();
const args = process.argv.slice(2);

await runCommand(binaryPath, args);
