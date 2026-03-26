import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createMemoryVariantPersistenceAdapter } from "../lib/variant-persistence";
import { createVariantSyncSnapshot } from "../lib/variant-sync";
import type { SavedVariant } from "./use-saved-variants";
import { useVariantSync } from "./use-variant-sync";

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

function comparePreset(left: DemoPreset, right: DemoPreset) {
  return left.scope === right.scope;
}

describe("useVariantSync", () => {
  it("opens a push review when the remote snapshot has conflicting changes", async () => {
    const localSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [
        createSavedVariant("alpha", "local-alpha", "2026-03-26T08:00:00.000Z", "Alpha"),
        createSavedVariant("beta", "local-beta", "2026-03-26T09:00:00.000Z", "Beta local"),
      ],
      version: 1,
    });
    const remoteSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [
        createSavedVariant("alpha", "local-alpha", "2026-03-26T08:00:00.000Z", "Alpha"),
        createSavedVariant("beta", "remote-beta", "2026-03-26T10:00:00.000Z", "Beta remote"),
      ],
      version: 1,
    });
    const adapter = createMemoryVariantPersistenceAdapter<DemoPreset, string>({
      initialSnapshot: remoteSnapshot,
    });
    const handleApplyLocalSnapshot = vi.fn();
    const { result } = renderHook(() =>
      useVariantSync<DemoPreset, string>({
        activityPersistence: {
          storage: null,
          storageKey: "variant-sync-hook-test-review",
        },
        adapter,
        comparePreset,
        fallbackStartupVariantKey: "alpha",
        localSnapshot,
        onApplyLocalSnapshot: handleApplyLocalSnapshot,
        sourceLabel: "mock cloud",
      }),
    );

    await waitFor(() => {
      expect(result.current.remoteSnapshot).toMatchObject({
        startupVariantKey: "alpha",
      });
    });

    await act(async () => {
      await result.current.pushSnapshot();
    });

    await waitFor(() => {
      expect(result.current.reviewState?.direction).toBe("push");
    });

    expect(result.current.reviewState?.comparison).toMatchObject({
      changedKeys: ["beta"],
      localOnlyKeys: [],
      remoteOnlyKeys: [],
      status: "diverged",
    });
    expect(result.current.reviewEntries.changed.map((entry) => entry.key)).toEqual([
      "beta",
    ]);
    expect(result.current.syncState.status).toBe("idle");
    expect(result.current.syncState.message).toContain("need review");
    expect(handleApplyLocalSnapshot).not.toHaveBeenCalled();
    expect((await adapter.readSnapshot())?.variants).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "Beta remote" })]),
    );
    expect(result.current.activities[0]).toMatchObject({
      kind: "review",
      title: "Review needed before push",
      tone: "warning",
    });
  });

  it("pulls a remote-only snapshot directly into the local workspace", async () => {
    const localSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [
        createSavedVariant("alpha", "shared-alpha", "2026-03-26T08:00:00.000Z", "Alpha"),
      ],
      version: 1,
    });
    const remoteSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [
        createSavedVariant("alpha", "shared-alpha", "2026-03-26T08:00:00.000Z", "Alpha"),
        createSavedVariant("gamma", "remote-gamma", "2026-03-26T11:00:00.000Z", "Gamma"),
      ],
      version: 1,
    });
    const adapter = createMemoryVariantPersistenceAdapter<DemoPreset, string>({
      initialSnapshot: remoteSnapshot,
    });
    const handleApplyLocalSnapshot = vi.fn();
    const { result } = renderHook(() =>
      useVariantSync<DemoPreset, string>({
        activityPersistence: {
          storage: null,
          storageKey: "variant-sync-hook-test-pull",
        },
        adapter,
        comparePreset,
        fallbackStartupVariantKey: "alpha",
        localSnapshot,
        onApplyLocalSnapshot: handleApplyLocalSnapshot,
        sourceLabel: "mock cloud",
      }),
    );

    await waitFor(() => {
      expect(result.current.remoteSnapshot?.variants).toHaveLength(2);
    });

    await act(async () => {
      await result.current.pullSnapshot();
    });

    await waitFor(() => {
      expect(handleApplyLocalSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({
          startupVariantKey: "alpha",
          variants: [
            expect.objectContaining({ key: "alpha" }),
            expect.objectContaining({ key: "gamma" }),
          ],
        }),
      );
    });

    expect(result.current.reviewState).toBeNull();
    expect(result.current.syncState.status).toBe("idle");
    expect(result.current.syncState.message).toContain("Pulled 2 views from mock cloud");
    expect(result.current.activities[0]).toMatchObject({
      kind: "pull",
      title: "Remote snapshot pulled",
      tone: "success",
    });
  });
});
