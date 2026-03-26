import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SavedVariant } from "../hooks/use-saved-variants";
import { createVariantSyncSnapshot } from "./variant-sync";
import {
  createLocalStorageVariantPersistenceAdapter,
  createMemoryVariantPersistenceAdapter,
  createSessionStorageVariantPersistenceAdapter,
  parseVariantSyncSnapshot,
  withLatencyVariantPersistenceAdapter,
} from "./variant-persistence";

interface DemoPreset {
  scope: string;
}

function createSavedVariant(
  key: string,
  scope: string,
  updatedAt: string,
  label = key,
): SavedVariant<DemoPreset> {
  return {
    createdAt: updatedAt,
    key,
    label,
    preset: { scope },
    updatedAt,
  };
}

function parseVariant(value: unknown): SavedVariant<DemoPreset> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SavedVariant<DemoPreset>> & {
    preset?: { scope?: unknown };
  };

  if (
    typeof candidate.key !== "string" ||
    typeof candidate.label !== "string" ||
    typeof candidate.createdAt !== "string" ||
    typeof candidate.updatedAt !== "string" ||
    !candidate.preset ||
    typeof candidate.preset.scope !== "string"
  ) {
    return null;
  }

  return {
    createdAt: candidate.createdAt,
    key: candidate.key,
    label: candidate.label,
    preset: { scope: candidate.preset.scope },
    updatedAt: candidate.updatedAt,
  };
}

function createStorageMock() {
  const values = new Map<string, string>();

  return {
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    key(index: number) {
      return [...values.keys()][index] ?? null;
    },
    get length() {
      return values.size;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  } satisfies Storage;
}

describe("variant-persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("parses snapshots, filters invalid variants, and falls back to a valid startup key", () => {
    const snapshot = parseVariantSyncSnapshot(
      {
        startupVariantKey: "missing",
        variants: [
          createSavedVariant("alpha", "local-alpha", "2026-03-26T08:00:00.000Z", "Alpha"),
          { key: "broken", label: "Broken" },
        ],
        version: 4,
      },
      {
        fallbackStartupVariantKey: "standard",
        parseVariant,
        validateStartupVariantKey: (candidate, variants) =>
          variants.some((variant) => variant.key === candidate),
      },
    );

    expect(snapshot).toEqual({
      startupVariantKey: "standard",
      updatedAt: "2026-03-26T08:00:00.000Z",
      variants: [
        expect.objectContaining({
          key: "alpha",
          label: "Alpha",
        }),
      ],
      version: 4,
    });
  });

  it("reads, writes, and clears snapshots through the local storage adapter", () => {
    const storage = createStorageMock();
    const adapter = createLocalStorageVariantPersistenceAdapter<DemoPreset, string>({
      fallbackStartupVariantKey: "standard",
      getStorage: () => storage,
      parseVariant,
      storageKey: "axiom-local-test",
      validateStartupVariantKey: (candidate, variants) =>
        variants.some((variant) => variant.key === candidate),
      version: 2,
    });
    const snapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [
        createSavedVariant("alpha", "local-alpha", "2026-03-26T08:00:00.000Z", "Alpha"),
      ],
      version: 2,
    });

    adapter.writeSnapshot(snapshot);

    expect(storage.getItem("axiom-local-test")).toContain("\"startupVariantKey\":\"alpha\"");
    expect(adapter.readSnapshot()).toEqual(snapshot);

    adapter.clearSnapshot?.();

    expect(storage.getItem("axiom-local-test")).toBeNull();
    expect(adapter.readSnapshot()).toBeNull();
  });

  it("handles unavailable or malformed storage gracefully", () => {
    const unavailableAdapter = createLocalStorageVariantPersistenceAdapter<DemoPreset, string>({
      fallbackStartupVariantKey: "standard",
      getStorage: () => null,
      parseVariant,
      storageKey: "axiom-unavailable-test",
    });
    const malformedStorage = createStorageMock();
    malformedStorage.setItem("axiom-malformed-test", "{oops");
    const malformedAdapter = createLocalStorageVariantPersistenceAdapter<DemoPreset, string>({
      fallbackStartupVariantKey: "standard",
      getStorage: () => malformedStorage,
      parseVariant,
      storageKey: "axiom-malformed-test",
    });

    expect(unavailableAdapter.readSnapshot()).toBeNull();
    expect(() =>
      unavailableAdapter.writeSnapshot(
        createVariantSyncSnapshot({
          startupVariantKey: "standard",
          variants: [],
          version: 1,
        }),
      ),
    ).toThrow("Storage is unavailable for variant persistence.");
    expect(() => unavailableAdapter.clearSnapshot?.()).toThrow(
      "Storage is unavailable for variant persistence.",
    );
    expect(malformedAdapter.readSnapshot()).toBeNull();
  });

  it("uses session storage through the session adapter wrapper", () => {
    const adapter = createSessionStorageVariantPersistenceAdapter<DemoPreset, string>({
      fallbackStartupVariantKey: "standard",
      parseVariant,
      storageKey: "axiom-session-test",
    });
    const snapshot = createVariantSyncSnapshot({
      startupVariantKey: "beta",
      variants: [
        createSavedVariant("beta", "remote-beta", "2026-03-26T09:00:00.000Z", "Beta"),
      ],
      version: 1,
    });

    adapter.writeSnapshot(snapshot);

    expect(window.sessionStorage.getItem("axiom-session-test")).toContain(
      "\"startupVariantKey\":\"beta\"",
    );
    expect(adapter.readSnapshot()).toEqual(snapshot);
  });

  it("stores snapshots in memory and clears them without touching browser storage", () => {
    const initialSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [
        createSavedVariant("alpha", "local-alpha", "2026-03-26T08:00:00.000Z", "Alpha"),
      ],
      version: 1,
    });
    const adapter = createMemoryVariantPersistenceAdapter<DemoPreset, string>({
      initialSnapshot,
    });
    const nextSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "beta",
      variants: [
        createSavedVariant("beta", "remote-beta", "2026-03-26T10:00:00.000Z", "Beta"),
      ],
      version: 1,
    });

    expect(adapter.readSnapshot()).toEqual(initialSnapshot);

    adapter.writeSnapshot(nextSnapshot);
    expect(adapter.readSnapshot()).toEqual(nextSnapshot);

    adapter.clearSnapshot?.();
    expect(adapter.readSnapshot()).toBeNull();
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });

  it("applies latency to read, write, and clear operations", async () => {
    vi.useFakeTimers();

    const baseAdapter = {
      clearSnapshot: vi.fn(async () => undefined),
      readSnapshot: vi.fn(async () =>
        createVariantSyncSnapshot<DemoPreset, string>({
          startupVariantKey: "alpha",
          variants: [
            createSavedVariant(
              "alpha",
              "local-alpha",
              "2026-03-26T08:00:00.000Z",
              "Alpha",
            ),
          ],
          version: 1,
        }),
      ),
      writeSnapshot: vi.fn(async () => undefined),
    };
    const adapter = withLatencyVariantPersistenceAdapter(baseAdapter, {
      readDelayMs: 120,
      writeDelayMs: 80,
    });
    const nextSnapshot = createVariantSyncSnapshot<DemoPreset, string>({
      startupVariantKey: "beta",
      variants: [
        createSavedVariant("beta", "remote-beta", "2026-03-26T09:00:00.000Z", "Beta"),
      ],
      version: 1,
    });

    const readPromise = adapter.readSnapshot();
    await vi.advanceTimersByTimeAsync(119);
    expect(baseAdapter.readSnapshot).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await expect(readPromise).resolves.toMatchObject({
      startupVariantKey: "alpha",
    });
    expect(baseAdapter.readSnapshot).toHaveBeenCalledTimes(1);

    const writePromise = adapter.writeSnapshot(nextSnapshot);
    await vi.advanceTimersByTimeAsync(79);
    expect(baseAdapter.writeSnapshot).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await writePromise;
    expect(baseAdapter.writeSnapshot).toHaveBeenCalledWith(nextSnapshot);

    const clearPromise = adapter.clearSnapshot?.();
    await vi.advanceTimersByTimeAsync(79);
    expect(baseAdapter.clearSnapshot).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await clearPromise;
    expect(baseAdapter.clearSnapshot).toHaveBeenCalledTimes(1);
  });
});
