import { describe, expect, it } from "vitest";

import type { SavedVariant } from "@axiomui/react";

import {
  type WorklistVariantKey,
  type WorklistVariantPreset,
  variantPresets,
} from "../demo-data";
import {
  moveSavedWorklistVariants,
  renameSavedWorklistVariants,
  resolveDeletedVariantFallbacks,
  resolveImportedSavedVariants,
} from "./worklist-variant-dialog-state";

function createSavedWorklistVariant(
  key: WorklistVariantKey,
  label: string,
  preset: WorklistVariantPreset,
  updatedAt: string,
  description?: string,
): SavedVariant<WorklistVariantPreset> {
  return {
    createdAt: updatedAt,
    description,
    key,
    label,
    preset,
    updatedAt,
  };
}

describe("worklist-variant-dialog-state", () => {
  it("moves saved variants within bounds and ignores invalid moves", () => {
    const variants = [
      createSavedWorklistVariant(
        "alpha",
        "Alpha",
        variantPresets.standard,
        "2026-03-26T08:00:00.000Z",
      ),
      createSavedWorklistVariant(
        "beta",
        "Beta",
        variantPresets["compact-review"],
        "2026-03-26T09:00:00.000Z",
      ),
      createSavedWorklistVariant(
        "gamma",
        "Gamma",
        variantPresets["attention-queue"],
        "2026-03-26T10:00:00.000Z",
      ),
    ];

    expect(
      moveSavedWorklistVariants(variants, "beta", -1).map((variant) => variant.key),
    ).toEqual(["beta", "alpha", "gamma"]);
    expect(
      moveSavedWorklistVariants(variants, "alpha", -1),
    ).toBe(variants);
    expect(
      moveSavedWorklistVariants(variants, "missing", 1),
    ).toBe(variants);
  });

  it("renames saved variants with trimmed metadata and fallback copy", () => {
    const variants = [
      createSavedWorklistVariant(
        "alpha",
        "Alpha",
        variantPresets.standard,
        "2026-03-26T08:00:00.000Z",
        "Initial",
      ),
      createSavedWorklistVariant(
        "beta",
        "Beta",
        variantPresets["compact-review"],
        "2026-03-26T09:00:00.000Z",
      ),
    ];

    expect(
      renameSavedWorklistVariants(variants, {
        description: "  Ready for review  ",
        key: "beta",
        label: "  Review queue  ",
        updatedAt: "2026-03-27T10:00:00.000Z",
      }),
    ).toEqual([
      variants[0],
      expect.objectContaining({
        description: "Ready for review",
        key: "beta",
        label: "Review queue",
        updatedAt: "2026-03-27T10:00:00.000Z",
      }),
    ]);

    expect(
      renameSavedWorklistVariants(variants, {
        description: "   ",
        key: "alpha",
        label: "   ",
        updatedAt: "2026-03-27T11:00:00.000Z",
      })[0],
    ).toMatchObject({
      description: undefined,
      key: "alpha",
      label: "Untitled view",
      updatedAt: "2026-03-27T11:00:00.000Z",
    });
  });

  it("resolves active and startup fallbacks only when deleting the current variant", () => {
    expect(
      resolveDeletedVariantFallbacks("beta", "beta", "gamma"),
    ).toEqual({
      nextActiveVariantKey: "standard",
      nextStartupVariantKey: undefined,
    });
    expect(
      resolveDeletedVariantFallbacks("gamma", "beta", "gamma"),
    ).toEqual({
      nextActiveVariantKey: undefined,
      nextStartupVariantKey: "standard",
    });
    expect(
      resolveDeletedVariantFallbacks("alpha", "beta", "gamma"),
    ).toEqual({
      nextActiveVariantKey: undefined,
      nextStartupVariantKey: undefined,
    });
  });

  it("merges imported variants and keeps startup only when the imported key is valid", () => {
    const currentVariants = [
      createSavedWorklistVariant(
        "alpha",
        "Alpha",
        variantPresets.standard,
        "2026-03-26T08:00:00.000Z",
      ),
      createSavedWorklistVariant(
        "beta",
        "Beta",
        variantPresets["compact-review"],
        "2026-03-26T09:00:00.000Z",
      ),
    ];
    const importedVariants = [
      createSavedWorklistVariant(
        "beta",
        "Beta remote",
        variantPresets["attention-queue"],
        "2026-03-27T10:00:00.000Z",
      ),
      createSavedWorklistVariant(
        "gamma",
        "Gamma",
        variantPresets.standard,
        "2026-03-27T11:00:00.000Z",
      ),
    ];

    expect(
      resolveImportedSavedVariants({
        currentStartupVariantKey: "alpha",
        importedStartupVariantKey: "gamma",
        importedVariants,
        savedVariants: currentVariants,
      }),
    ).toEqual({
      mergedVariants: [
        expect.objectContaining({ key: "beta", label: "Beta remote" }),
        expect.objectContaining({ key: "gamma", label: "Gamma" }),
        expect.objectContaining({ key: "alpha", label: "Alpha" }),
      ],
      nextStartupVariantKey: "gamma",
    });

    expect(
      resolveImportedSavedVariants({
        currentStartupVariantKey: "alpha",
        importedStartupVariantKey: "missing",
        importedVariants,
        savedVariants: currentVariants,
      }).nextStartupVariantKey,
    ).toBe("alpha");
  });
});
