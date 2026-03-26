import { describe, expect, it } from "vitest";

import { variantPresets } from "../demo-data";
import {
  mergeSavedWorklistVariants,
  parseImportedSavedWorklistVariant,
  parseImportedWorklistFilters,
  parseImportedWorklistSort,
  parseSavedVariantsImportPayload,
} from "./worklist-persistence";

describe("worklist-persistence", () => {
  it("parses imported filters with legacy owner and target date fields", () => {
    const parsedFilters = parseImportedWorklistFilters({
      owner: " Mia Chen ",
      targetDate: "2026-04-18",
      targetTime: "13:30 ",
      visibleColumnIds: ["status"],
      keywords: ["toolbar", "", 42],
    });

    expect(parsedFilters).toEqual({
      ...variantPresets.standard.filters,
      keywords: ["toolbar"],
      owners: ["Mia Chen"],
      targetDateRange: { end: "2026-04-18", start: "2026-04-18" },
      targetTimeFrom: "13:30",
      visibleColumnIds: ["object", "status"],
    });
  });

  it("keeps standard defaults for omitted fields and falls back to legacy owner", () => {
    const parsedFilters = parseImportedWorklistFilters({
      owner: " Noah Patel ",
      owners: [],
      visibleColumnIds: [],
    });

    expect(parsedFilters).toEqual({
      ...variantPresets.standard.filters,
      owners: ["Noah Patel"],
      visibleColumnIds: ["object"],
    });
  });

  it("accepts only sortable columns and supported directions for imported sort state", () => {
    expect(
      parseImportedWorklistSort({
        columnId: "schedule",
        direction: "desc",
      }),
    ).toEqual({
      columnId: "schedule",
      direction: "desc",
    });
    expect(
      parseImportedWorklistSort({
        columnId: "unknown",
        direction: "desc",
      }),
    ).toBeUndefined();
    expect(
      parseImportedWorklistSort({
        columnId: "status",
        direction: "sideways",
      }),
    ).toBeUndefined();
  });

  it("parses saved variants from import payloads and trims free-form fields", () => {
    const parsedVariant = parseImportedSavedWorklistVariant({
      key: " custom-review ",
      label: " Custom review ",
      description: "  Saved from export  ",
      preset: {
        filters: {
          ...variantPresets.standard.filters,
          owner: "Noah Patel",
        },
        groupBy: "priority",
        pageSize: 5,
        sort: {
          columnId: "schedule",
          direction: "desc",
        },
      },
    });

    expect(parsedVariant).toMatchObject({
      key: "custom-review",
      label: "Custom review",
      description: "Saved from export",
      preset: {
        filters: {
          ...variantPresets.standard.filters,
          owners: ["Noah Patel"],
        },
        groupBy: "priority",
        pageSize: 5,
        sort: {
          columnId: "schedule",
          direction: "desc",
        },
      },
    });
  });

  it("parses saved variants import payloads from both array and object forms", () => {
    const arrayPayload = JSON.stringify([
      {
        key: "review",
        label: "Review",
        preset: {
          filters: variantPresets.standard.filters,
        },
      },
    ]);
    const objectPayload = JSON.stringify({
      startupVariantKey: "review",
      variants: [
        {
          key: "review",
          label: "Review",
          preset: {
            filters: variantPresets.standard.filters,
          },
        },
      ],
    });

    expect(parseSavedVariantsImportPayload(arrayPayload)).toMatchObject({
      variants: [expect.objectContaining({ key: "review" })],
    });
    expect(parseSavedVariantsImportPayload(objectPayload)).toMatchObject({
      startupVariantKey: "review",
      variants: [expect.objectContaining({ key: "review" })],
    });
    expect(parseSavedVariantsImportPayload("{oops")).toEqual({
      error:
        "The import payload is not valid JSON yet. Check commas and quotes, then try again.",
    });
  });

  it("merges imported variants ahead of current variants and replaces same-key entries", () => {
    const currentVariants = [
      {
        key: "alpha",
        label: "Alpha",
        preset: variantPresets.standard,
        createdAt: "2026-03-26T00:00:00.000Z",
        updatedAt: "2026-03-26T00:00:00.000Z",
      },
      {
        key: "beta",
        label: "Beta",
        preset: variantPresets["compact-review"],
        createdAt: "2026-03-26T00:00:00.000Z",
        updatedAt: "2026-03-26T00:00:00.000Z",
      },
    ];
    const importedVariants = [
      {
        key: "beta",
        label: "Beta updated",
        preset: variantPresets["attention-queue"],
        createdAt: "2026-03-27T00:00:00.000Z",
        updatedAt: "2026-03-27T00:00:00.000Z",
      },
      {
        key: "gamma",
        label: "Gamma",
        preset: variantPresets.standard,
        createdAt: "2026-03-27T00:00:00.000Z",
        updatedAt: "2026-03-27T00:00:00.000Z",
      },
    ];

    expect(mergeSavedWorklistVariants(currentVariants, importedVariants)).toEqual([
      expect.objectContaining({ key: "beta", label: "Beta updated" }),
      expect.objectContaining({ key: "gamma" }),
      expect.objectContaining({ key: "alpha" }),
    ]);
  });
});
