import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@axiomui/react/styles.css",
        replacement: path.resolve(
          projectRoot,
          "../../packages/react/src/styles/index.css",
        ),
      },
      {
        find: "@axiomui/tokens/styles.css",
        replacement: path.resolve(
          projectRoot,
          "../../packages/tokens/src/styles.css",
        ),
      },
      {
        find: "@axiomui/react",
        replacement: path.resolve(projectRoot, "../../packages/react/src/index.ts"),
      },
    ],
  },
});
