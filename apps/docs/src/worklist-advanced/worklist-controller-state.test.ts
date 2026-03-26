import { describe, expect, it } from "vitest";

import {
  variantPresets,
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "../demo-data";
import { buildWorklistVariantMap } from "./worklist-state";
import {
  normalizeWorklistControllerFilters,
  resolveStartupVariantKey,
  resolveStoredStartupVariantKey,
  resolveStoredWorklistGroupBy,
} from "./worklist-controller-state";

function createVariantMap() {
  return buildWorklistVariantMap([
    {
      createdAt: "2026-03-26T08:00:00.000Z",
      key: "saved-review",
      label: "Saved review",
      preset: {
        ...variantPresets.standard,
        groupBy: "status",
      },
      updatedAt: "2026-03-26T08:00:00.000Z",
    },
  ]);
}

describe("worklist-controller-state", () => {
  it("normalizes controller filters from legacy and partial state", () => {
    expect(
      normalizeWorklistControllerFilters({
        keywords: ["toolbar"],
        owner: " Mia Chen ",
        targetDate: "2026-04-18",
        targetTime: "13:30 ",
        visibleColumnIds: ["status"],
      }),
    ).toEqual({
      ...variantPresets.standard.filters,
      keywords: ["toolbar"],
      owners: ["Mia Chen"],
      targetDateRange: {
        end: "2026-04-18",
        start: "2026-04-18",
      },
      targetTimeFrom: "13:30",
      visibleColumnIds: ["object", "status"],
    });

    expect(
      normalizeWorklistControllerFilters({
        owners: [" Noah Patel ", "", "Noah Patel"],
        targetDateRange: {
          end: "",
          start: "2026-04-01",
        },
        visibleColumnIds: undefined,
      }),
    ).toEqual({
      ...variantPresets.standard.filters,
      owners: ["Noah Patel"],
      targetDateRange: {
        end: "",
        start: "2026-04-01",
      },
      visibleColumnIds: ["object", "owner", "schedule", "priority", "status"],
    });
  });

  it("resolves stored startup variants against the current variant map", () => {
    const variants = createVariantMap();

    expect(resolveStoredStartupVariantKey("saved-review", variants)).toBe("saved-review");
    expect(resolveStoredStartupVariantKey("missing", variants)).toBe("standard");
  });

  it("resolves stored worklist grouping from direct storage or persisted state", () => {
    const variants = createVariantMap();

    expect(
      resolveStoredWorklistGroupBy({
        storedGroup: "owner",
        storedWorklistState: null,
        variants,
      }),
    ).toBe("owner");

    expect(
      resolveStoredWorklistGroupBy({
        storedGroup: "invalid",
        storedWorklistState: JSON.stringify({
          activeVariant: "saved-review",
          version: 1,
        }),
        variants,
      }),
    ).toBe("status");

    expect(
      resolveStoredWorklistGroupBy({
        storedGroup: "invalid",
        storedWorklistState: JSON.stringify({
          activeVariant: "saved-review",
          version: 99,
        }),
        variants,
      }),
    ).toBeUndefined();
  });

  it("falls back to the default startup variant when the active startup key disappears", () => {
    const variants = createVariantMap();

    expect(resolveStartupVariantKey("saved-review", variants)).toBe("saved-review");
    expect(
      resolveStartupVariantKey(
        "missing" as WorklistVariantKey,
        variants as Record<WorklistVariantKey, WorklistVariantPreset>,
      ),
    ).toBe("standard");
  });
});
