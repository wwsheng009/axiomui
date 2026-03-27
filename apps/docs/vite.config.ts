import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const reactSourceRoot = path.resolve(projectRoot, "../../packages/react/src");
const docsSourceRoot = path.resolve(projectRoot, "./src");

function normalizePath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function pathIncludes(filePath: string, segments: string[]) {
  return segments.some((segment) => filePath.includes(segment));
}

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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = normalizePath(id);
          const normalizedReactRoot = normalizePath(reactSourceRoot);
          const normalizedDocsRoot = normalizePath(docsSourceRoot);

          if (normalizedId.endsWith(".css")) {
            return undefined;
          }

          if (
            pathIncludes(normalizedId, [
              "/node_modules/react/",
              "/node_modules/react-dom/",
              "/node_modules/scheduler/",
            ])
          ) {
            return "vendor-react";
          }

          if (normalizedId.startsWith(normalizedDocsRoot)) {
            if (
              pathIncludes(normalizedId, [
                "/src/worklist-advanced/",
                "/src/use-docs-",
                "/src/demo-data.ts",
                "/src/docs-operations-section-set.tsx",
              ])
            ) {
              return "docs-worklist";
            }

            if (
              pathIncludes(normalizedId, [
                "/src/chart-lab/",
                "/src/chart-primitives-sections.tsx",
                "/src/docs-chart-section-set.tsx",
              ])
            ) {
              return "docs-charts";
            }

            if (
              pathIncludes(normalizedId, [
                "/src/shell-page-sections.tsx",
                "/src/docs-shell-section-set.tsx",
              ])
            ) {
              return "docs-shell";
            }

            if (
              pathIncludes(normalizedId, [
                "/src/foundation-demo-sections.tsx",
                "/src/overlay-demo-sections.tsx",
                "/src/docs-hero-section.tsx",
                "/src/docs-app-config.ts",
              ])
            ) {
              return "docs-foundation";
            }
          }

          if (normalizedId.startsWith(normalizedReactRoot)) {
            if (
              pathIncludes(normalizedId, [
                "/components/microchart/",
                "/components/kpi-card/",
              ])
            ) {
              return "axiomui-charts";
            }

            if (
              pathIncludes(normalizedId, [
                "/components/navigation-list/",
                "/components/side-navigation/",
                "/components/tool-header/",
                "/components/tool-page/",
                "/components/flexible-column-layout/",
                "/components/breadcrumbs/",
                "/components/avatar/",
                "/components/object-status/",
                "/components/object-identifier/",
                "/components/object-page-header/",
                "/components/object-page-layout/",
                "/components/object-page-nav/",
                "/components/dynamic-page/",
                "/components/split-layout/",
                "/components/app-shell/",
                "/components/toolbar/",
                "/components/page-section/",
              ])
            ) {
              return "axiomui-shell";
            }

            if (
              pathIncludes(normalizedId, [
                "/components/input/",
                "/components/select/",
                "/components/combo-box/",
                "/components/multi-input/",
                "/components/multi-combo-box/",
                "/components/calendar-panel/",
                "/components/date-picker/",
                "/components/date-range-picker/",
                "/components/time-picker/",
                "/components/form-grid/",
                "/components/filter-bar/",
                "/components/tabs/",
                "/components/data-table/",
                "/components/pagination/",
                "/components/column-manager/",
                "/components/group-manager/",
                "/components/sort-manager/",
                "/components/variant-manager/",
                "/components/variant-sync/",
              ])
            ) {
              return "axiomui-forms";
            }

            if (
              pathIncludes(normalizedId, [
                "/components/dialog/",
                "/components/popover/",
                "/components/responsive-popover/",
                "/components/menu/",
                "/components/message-popover/",
                "/components/notification-list/",
                "/components/message-page/",
                "/components/overlay/",
              ])
            ) {
              return "axiomui-overlays";
            }

            if (
              pathIncludes(normalizedId, [
                "/providers/",
                "/lib/",
                "/index.ts",
                "/components/button/",
                "/components/card/",
                "/components/icon/",
              ])
            ) {
              return "axiomui-core";
            }
          }

          return undefined;
        },
      },
    },
  },
});
