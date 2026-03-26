import { describe, expect, it } from "vitest";

import type { SavedVariant } from "../hooks/use-saved-variants";
import {
  compareVariantSnapshots,
  composeReviewedVariantSnapshot,
  createVariantSyncReviewSelections,
  createVariantSyncSnapshot,
  getVariantSyncEntryFreshness,
} from "./variant-sync";

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

describe("variant-sync", () => {
  it("classifies local-only, remote-only and diverged snapshots", () => {
    const alpha = createSavedVariant("alpha", "local-alpha", "2026-03-26T08:00:00.000Z");
    const beta = createSavedVariant("beta", "local-beta", "2026-03-26T09:00:00.000Z");
    const gamma = createSavedVariant("gamma", "remote-gamma", "2026-03-26T10:00:00.000Z");
    const localSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [alpha, beta],
      version: 1,
    });

    expect(
      compareVariantSnapshots(
        localSnapshot,
        createVariantSyncSnapshot({
          startupVariantKey: "alpha",
          variants: [alpha],
          version: 1,
        }),
        comparePreset,
      ),
    ).toMatchObject({
      localOnlyKeys: ["beta"],
      remoteOnlyKeys: [],
      status: "local-only",
    });

    expect(
      compareVariantSnapshots(
        createVariantSyncSnapshot({
          startupVariantKey: "alpha",
          variants: [alpha],
          version: 1,
        }),
        createVariantSyncSnapshot({
          startupVariantKey: "alpha",
          variants: [alpha, gamma],
          version: 1,
        }),
        comparePreset,
      ),
    ).toMatchObject({
      localOnlyKeys: [],
      remoteOnlyKeys: ["gamma"],
      status: "remote-only",
    });

    expect(
      compareVariantSnapshots(
        localSnapshot,
        createVariantSyncSnapshot({
          startupVariantKey: "beta",
          variants: [
            createSavedVariant("beta", "remote-beta", "2026-03-26T11:00:00.000Z"),
            alpha,
          ],
          version: 1,
        }),
        comparePreset,
      ),
    ).toMatchObject({
      changedKeys: ["beta"],
      orderChanged: true,
      startupChanged: true,
      status: "diverged",
    });
  });

  it("creates review selections that favor keeping remote differences", () => {
    expect(
      createVariantSyncReviewSelections({
        changedKeys: ["beta"],
        localOnlyKeys: ["alpha"],
        orderChanged: true,
        remoteOnlyKeys: ["gamma"],
        startupChanged: true,
        status: "diverged",
      }),
    ).toEqual({
      orderSelection: "local",
      startupSelection: "local",
      variantSelections: {
        alpha: "local",
        beta: "remote",
        gamma: "remote",
      },
    });
  });

  it("composes reviewed snapshots using the selected side, order and startup", () => {
    const localAlpha = createSavedVariant(
      "alpha",
      "local-alpha",
      "2026-03-26T08:00:00.000Z",
      "Alpha local",
    );
    const localBeta = createSavedVariant(
      "beta",
      "local-beta",
      "2026-03-26T09:00:00.000Z",
      "Beta local",
    );
    const remoteBeta = createSavedVariant(
      "beta",
      "remote-beta",
      "2026-03-26T11:00:00.000Z",
      "Beta remote",
    );
    const remoteGamma = createSavedVariant(
      "gamma",
      "remote-gamma",
      "2026-03-26T12:00:00.000Z",
      "Gamma remote",
    );
    const localSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [localAlpha, localBeta],
      version: 1,
    });
    const remoteSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "gamma",
      variants: [remoteBeta, remoteGamma],
      version: 1,
    });

    const mergedSnapshot = composeReviewedVariantSnapshot({
      fallbackStartupVariantKey: "alpha",
      isValidStartupVariantKey: (candidate, variants) =>
        variants.some((variant) => variant.key === candidate),
      localSnapshot,
      remoteSnapshot,
      selections: {
        orderSelection: "remote",
        startupSelection: "remote",
        variantSelections: {
          alpha: "local",
          beta: "remote",
          gamma: "remote",
        },
      },
    });

    expect(mergedSnapshot.startupVariantKey).toBe("gamma");
    expect(mergedSnapshot.variants.map((variant) => variant.key)).toEqual([
      "beta",
      "gamma",
      "alpha",
    ]);
    expect(mergedSnapshot.variants[0]).toMatchObject({
      key: "beta",
      label: "Beta remote",
      preset: { scope: "remote-beta" },
    });
    expect(mergedSnapshot.updatedAt).toBe("2026-03-26T12:00:00.000Z");
  });

  it("falls back to the provided startup key when the chosen startup is no longer valid", () => {
    const localAlpha = createSavedVariant(
      "alpha",
      "local-alpha",
      "2026-03-26T08:00:00.000Z",
      "Alpha local",
    );
    const localSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "alpha",
      variants: [localAlpha],
      version: 1,
    });
    const remoteSnapshot = createVariantSyncSnapshot({
      startupVariantKey: "gamma",
      variants: [
        createSavedVariant(
          "gamma",
          "remote-gamma",
          "2026-03-26T12:00:00.000Z",
          "Gamma remote",
        ),
      ],
      version: 1,
    });

    const mergedSnapshot = composeReviewedVariantSnapshot({
      fallbackStartupVariantKey: "alpha",
      isValidStartupVariantKey: (candidate, variants) =>
        variants.some((variant) => variant.key === candidate),
      localSnapshot,
      remoteSnapshot,
      selections: {
        orderSelection: "remote",
        startupSelection: "remote",
        variantSelections: {
          alpha: "local",
          gamma: "none",
        },
      },
    });

    expect(mergedSnapshot.startupVariantKey).toBe("alpha");
    expect(mergedSnapshot.variants.map((variant) => variant.key)).toEqual(["alpha"]);
  });

  it("reports freshness labels from local and remote timestamps", () => {
    expect(
      getVariantSyncEntryFreshness({
        key: "beta",
        localUpdatedAt: "2026-03-26T12:00:00.000Z",
        remoteUpdatedAt: "2026-03-26T11:00:00.000Z",
        state: "changed",
      }),
    ).toBe("Local newer");
    expect(
      getVariantSyncEntryFreshness({
        key: "gamma",
        localUpdatedAt: "invalid",
        remoteUpdatedAt: "2026-03-26T11:00:00.000Z",
        state: "changed",
      }),
    ).toBe("Timestamp unavailable");
  });
});
