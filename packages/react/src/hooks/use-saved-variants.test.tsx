import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSavedVariants, type SavedVariant } from "./use-saved-variants";

interface DemoPreset {
  scope: string;
  tags: string[];
}

function clonePreset(preset: DemoPreset): DemoPreset {
  return {
    ...preset,
    tags: [...preset.tags],
  };
}

function createSavedVariant(
  key: string,
  label: string,
  preset: DemoPreset,
  updatedAt: string,
  description?: string,
): SavedVariant<DemoPreset> {
  return {
    createdAt: updatedAt,
    description,
    key,
    label,
    preset,
    updatedAt,
  };
}

function readPersistedVariants(storageKey: string) {
  const rawState = window.localStorage.getItem(storageKey);

  return rawState
    ? (JSON.parse(rawState) as {
        variants: Array<SavedVariant<DemoPreset>>;
        version: number;
      })
    : null;
}

describe("useSavedVariants", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("hydrates from persisted storage, ignores invalid entries, and fills missing timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-30T10:00:00.000Z"));

    window.localStorage.setItem(
      "saved-variants-hydrate",
      JSON.stringify({
        variants: [
          {
            description: 42,
            key: "saved-review",
            label: "Saved review",
            preset: {
              scope: "review",
              tags: ["triage"],
            },
          },
          {
            key: "broken",
            preset: {
              scope: "broken",
              tags: [],
            },
          },
        ],
        version: 3,
      }),
    );

    const { result } = renderHook(() =>
      useSavedVariants<DemoPreset>({
        clonePreset,
        persistence: {
          storageKey: "saved-variants-hydrate",
          version: 3,
        },
      }),
    );

    expect(result.current.variants).toEqual([
      {
        createdAt: "2026-03-30T10:00:00.000Z",
        description: undefined,
        key: "saved-review",
        label: "Saved review",
        preset: {
          scope: "review",
          tags: ["triage"],
        },
        updatedAt: "2026-03-30T10:00:00.000Z",
      },
    ]);
  });

  it("falls back to cloned initial variants when persisted state is incompatible", () => {
    const initialVariants = [
      createSavedVariant(
        "saved-release",
        "Release queue",
        {
          scope: "release",
          tags: ["ship"],
        },
        "2026-03-26T08:00:00.000Z",
        "Existing",
      ),
    ];

    window.localStorage.setItem(
      "saved-variants-fallback",
      JSON.stringify({
        variants: [createSavedVariant(
          "saved-old",
          "Old",
          {
            scope: "old",
            tags: ["legacy"],
          },
          "2026-03-25T08:00:00.000Z",
        )],
        version: 99,
      }),
    );

    const { result } = renderHook(() =>
      useSavedVariants<DemoPreset>({
        clonePreset,
        initialVariants,
        persistence: {
          storageKey: "saved-variants-fallback",
          version: 1,
        },
      }),
    );

    expect(result.current.variants).toEqual(initialVariants);
    expect(result.current.variants[0]).not.toBe(initialVariants[0]);
    expect(result.current.variants[0].preset).not.toBe(initialVariants[0].preset);

    initialVariants[0].preset.tags.push("mutated");

    expect(result.current.variants[0].preset.tags).toEqual(["ship"]);
  });

  it("creates trimmed variants with unique generated keys and persists them", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-31T09:15:00.000Z"));

    const { result } = renderHook(() =>
      useSavedVariants<DemoPreset>({
        clonePreset,
        initialVariants: [
          createSavedVariant(
            "saved-release-queue",
            "Release queue",
            {
              scope: "existing",
              tags: ["ops"],
            },
            "2026-03-26T08:00:00.000Z",
          ),
        ],
        persistence: {
          storageKey: "saved-variants-create",
          version: 1,
        },
      }),
    );

    let nextKey = "";

    act(() => {
      nextKey = result.current.saveVariant({
        description: "  Ready for review  ",
        label: " Release Queue ",
        preset: {
          scope: "review",
          tags: ["triage"],
        },
      });
    });

    expect(nextKey).toBe("saved-release-queue-2");
    expect(result.current.variants[0]).toMatchObject({
      createdAt: "2026-03-31T09:15:00.000Z",
      description: "Ready for review",
      key: "saved-release-queue-2",
      label: "Release Queue",
      preset: {
        scope: "review",
        tags: ["triage"],
      },
      updatedAt: "2026-03-31T09:15:00.000Z",
    });

    expect(readPersistedVariants("saved-variants-create")).toEqual({
      variants: expect.arrayContaining([
        expect.objectContaining({
          key: "saved-release-queue-2",
          label: "Release Queue",
        }),
      ]),
      version: 1,
    });
  });

  it("updates existing variants, preserves createdAt, and supports replace/remove flows", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T11:30:00.000Z"));

    const inputPreset: DemoPreset = {
      scope: "updated",
      tags: ["focus"],
    };
    const replacementVariants = [
      createSavedVariant(
        "saved-beta",
        "Beta",
        {
          scope: "beta",
          tags: ["ops"],
        },
        "2026-03-28T09:00:00.000Z",
      ),
      createSavedVariant(
        "saved-gamma",
        "Gamma",
        {
          scope: "gamma",
          tags: ["review"],
        },
        "2026-03-28T10:00:00.000Z",
      ),
    ];
    const { result } = renderHook(() =>
      useSavedVariants<DemoPreset>({
        clonePreset,
        initialVariants: [
          createSavedVariant(
            "saved-alpha",
            "Alpha",
            {
              scope: "alpha",
              tags: ["seed"],
            },
            "2026-03-26T08:00:00.000Z",
            "Original",
          ),
        ],
        persistence: {
          storageKey: "saved-variants-update",
          version: 2,
        },
      }),
    );

    let updatedKey = "";

    act(() => {
      updatedKey = result.current.saveVariant({
        description: "  Updated notes  ",
        key: "saved-alpha",
        label: "  Alpha refreshed  ",
        preset: inputPreset,
      });
    });

    expect(updatedKey).toBe("saved-alpha");
    expect(result.current.getVariant("saved-alpha")).toMatchObject({
      createdAt: "2026-03-26T08:00:00.000Z",
      description: "Updated notes",
      key: "saved-alpha",
      label: "Alpha refreshed",
      preset: {
        scope: "updated",
        tags: ["focus"],
      },
      updatedAt: "2026-04-01T11:30:00.000Z",
    });
    expect(result.current.getVariant("saved-alpha")?.preset).not.toBe(inputPreset);

    act(() => {
      result.current.replaceVariants(replacementVariants);
    });

    replacementVariants[0].preset.tags.push("mutated");

    expect(result.current.variants.map((variant) => variant.key)).toEqual([
      "saved-beta",
      "saved-gamma",
    ]);
    expect(result.current.variants[0].preset.tags).toEqual(["ops"]);

    act(() => {
      result.current.removeVariant("saved-beta");
    });

    expect(result.current.variants.map((variant) => variant.key)).toEqual(["saved-gamma"]);

    expect(readPersistedVariants("saved-variants-update")).toEqual({
      variants: [expect.objectContaining({ key: "saved-gamma" })],
      version: 2,
    });
  });
});
