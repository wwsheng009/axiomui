import { describe, expect, it } from "vitest";

import { variantPresets, workItems } from "../demo-data";
import {
  buildWorklistVariantMap,
  cloneWorklistVariantPreset,
  countWorkItemsForFilters,
  filterWorkItem,
  groupWorkItems,
  normalizeVisibleColumnIds,
} from "./worklist-state";

describe("worklist-state", () => {
  it("clones presets deeply and normalizes filter values", () => {
    const sourcePreset = {
      filters: {
        ...variantPresets.standard.filters,
        keywords: ["toolbar"],
        owners: [" Mia Chen ", "", "Mia Chen"],
        targetDateRange: { end: "", start: "2026-04-01" },
        targetTimeFrom: "13:30 ",
        visibleColumnIds: ["status", "owner"],
      },
      sort: { columnId: "status", direction: "asc" as const },
    };

    const clonedPreset = cloneWorklistVariantPreset(sourcePreset);

    sourcePreset.filters.keywords.push("mutated");
    sourcePreset.filters.owners.push("Noah Patel");
    sourcePreset.filters.visibleColumnIds.push("priority");

    expect(clonedPreset.filters.keywords).toEqual(["toolbar"]);
    expect(clonedPreset.filters.owners).toEqual([" Mia Chen ", "", "Mia Chen"]);
    expect(clonedPreset.filters.targetDateRange).toEqual({
      end: "",
      start: "2026-04-01",
    });
    expect(clonedPreset.filters.targetTimeFrom).toBe("13:30");
    expect(clonedPreset.filters.visibleColumnIds).toEqual(["status", "owner"]);
  });

  it("merges saved variants into the built-in map without sharing preset references", () => {
    const savedVariants = [
      {
        key: "custom-review",
        label: "Custom review",
        preset: cloneWorklistVariantPreset(variantPresets["compact-review"]),
        createdAt: "2026-03-26T00:00:00.000Z",
        updatedAt: "2026-03-26T00:00:00.000Z",
      },
    ];

    const variantMap = buildWorklistVariantMap(savedVariants);

    variantMap["custom-review"].filters.owners.push("Noah Patel");

    expect(variantMap.standard).toBeDefined();
    expect(variantMap["custom-review"]).toBeDefined();
    expect(savedVariants[0].preset.filters.owners).toEqual(["Avery Kim"]);
  });

  it("applies combined keyword, range and time filters consistently", () => {
    const filters = {
      ...variantPresets.standard.filters,
      keywords: ["toolbar"],
      targetDateRange: { start: "2026-04-01", end: "2026-04-30" },
      targetTimeFrom: "13:00",
      wave: "Q2 2026",
    };

    const matchingItems = workItems.filter((item) => filterWorkItem(item, filters));

    expect(matchingItems.map((item) => item.id)).toEqual(["AX-1031"]);
    expect(countWorkItemsForFilters(filters)).toBe(1);
  });

  it("keeps required columns when normalizing visible column ids", () => {
    expect(normalizeVisibleColumnIds(["status", "owner"])).toEqual([
      "object",
      "owner",
      "status",
    ]);
  });

  it("groups work items and sorts priority groups semantically", () => {
    const groups = groupWorkItems(workItems, "priority");

    expect(groups.map((group) => group.key)).toEqual([
      "Positive",
      "Information",
      "Attention",
      "Negative",
    ]);
    expect(groups[0]?.count).toBe("1 items");
    expect(groups[1]?.rows.map((row) => row.id)).toEqual(["AX-1024", "AX-1057"]);
  });
});
