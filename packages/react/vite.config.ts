import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const entryFile = fileURLToPath(new URL("./src/index.ts", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: entryFile,
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});

