import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const pendingAnimationFrames = new Set<number>();

function clearPendingAnimationFrames() {
  for (const handle of pendingAnimationFrames) {
    window.clearTimeout(handle);
  }

  pendingAnimationFrames.clear();
}

afterEach(() => {
  cleanup();

  if (typeof window !== "undefined") {
    clearPendingAnimationFrames();
  }
});

if (typeof window !== "undefined") {
  vi.stubGlobal(
    "requestAnimationFrame",
    (callback: FrameRequestCallback) => {
      const handle = window.setTimeout(() => {
        pendingAnimationFrames.delete(handle);
        callback(performance.now());
      }, 0);

      pendingAnimationFrames.add(handle);
      return handle;
    },
  );

  vi.stubGlobal("cancelAnimationFrame", (handle: number) => {
    pendingAnimationFrames.delete(handle);
    window.clearTimeout(handle);
  });
}
