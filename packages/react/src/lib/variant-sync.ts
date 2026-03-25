import type { SavedVariant } from "../hooks/use-saved-variants";

export interface VariantSyncSnapshot<
  TPreset,
  TVariantKey extends string = string,
> {
  version: number;
  updatedAt: string;
  startupVariantKey: TVariantKey;
  variants: Array<SavedVariant<TPreset>>;
}

export interface VariantSyncComparison {
  status: "in-sync" | "local-only" | "remote-only" | "diverged";
  changedKeys: string[];
  localOnlyKeys: string[];
  orderChanged: boolean;
  remoteOnlyKeys: string[];
  startupChanged: boolean;
}

export interface VariantSyncEntry {
  key: string;
  localLabel?: string;
  localUpdatedAt?: string;
  remoteLabel?: string;
  remoteUpdatedAt?: string;
  state: "changed" | "local-only" | "remote-only";
}

export type VariantSyncSelection = "local" | "none" | "remote";

export interface VariantSyncReviewSelections {
  orderSelection: "local" | "remote";
  startupSelection: "local" | "remote";
  variantSelections: Record<string, VariantSyncSelection>;
}

export function getLatestSavedVariantTimestamp<TPreset>(
  variants: Array<SavedVariant<TPreset>>,
  fallbackTimestamp = new Date().toISOString(),
) {
  const validTimestamps = variants
    .map((variant) => Date.parse(variant.updatedAt))
    .filter((timestamp) => !Number.isNaN(timestamp));

  if (validTimestamps.length === 0) {
    return fallbackTimestamp;
  }

  return new Date(Math.max(...validTimestamps)).toISOString();
}

export function createVariantSyncSnapshot<
  TPreset,
  TVariantKey extends string = string,
>({
  startupVariantKey,
  updatedAt,
  variants,
  version,
}: {
  startupVariantKey: TVariantKey;
  updatedAt?: string;
  variants: Array<SavedVariant<TPreset>>;
  version: number;
}): VariantSyncSnapshot<TPreset, TVariantKey> {
  return {
    startupVariantKey,
    updatedAt: updatedAt ?? getLatestSavedVariantTimestamp(variants),
    variants,
    version,
  };
}

export function areSavedVariantsEqual<TPreset>(
  left: SavedVariant<TPreset>,
  right: SavedVariant<TPreset>,
  comparePreset: (left: TPreset, right: TPreset) => boolean,
) {
  return (
    left.key === right.key &&
    left.label === right.label &&
    left.description === right.description &&
    comparePreset(left.preset, right.preset)
  );
}

export function compareVariantSnapshots<
  TPreset,
  TVariantKey extends string = string,
>(
  localSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>,
  remoteSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>,
  comparePreset: (left: TPreset, right: TPreset) => boolean,
): VariantSyncComparison {
  const localVariantMap = new Map(
    localSnapshot.variants.map((variant) => [variant.key, variant] as const),
  );
  const remoteVariantMap = new Map(
    remoteSnapshot.variants.map((variant) => [variant.key, variant] as const),
  );
  const localOnlyKeys = localSnapshot.variants
    .filter((variant) => !remoteVariantMap.has(variant.key))
    .map((variant) => variant.key);
  const remoteOnlyKeys = remoteSnapshot.variants
    .filter((variant) => !localVariantMap.has(variant.key))
    .map((variant) => variant.key);
  const changedKeys = localSnapshot.variants
    .filter((variant) => remoteVariantMap.has(variant.key))
    .map((variant) => {
      const remoteVariant = remoteVariantMap.get(variant.key);

      return remoteVariant && !areSavedVariantsEqual(variant, remoteVariant, comparePreset)
        ? variant.key
        : undefined;
    })
    .filter((variantKey): variantKey is string => variantKey !== undefined);
  const startupChanged =
    localSnapshot.startupVariantKey !== remoteSnapshot.startupVariantKey;
  const sameVariantSet =
    localSnapshot.variants.length === remoteSnapshot.variants.length &&
    localOnlyKeys.length === 0 &&
    remoteOnlyKeys.length === 0;
  const orderChanged =
    sameVariantSet &&
    localSnapshot.variants.some(
      (variant, index) => variant.key !== remoteSnapshot.variants[index]?.key,
    );

  if (
    localOnlyKeys.length === 0 &&
    remoteOnlyKeys.length === 0 &&
    changedKeys.length === 0 &&
    !startupChanged &&
    !orderChanged
  ) {
    return {
      changedKeys,
      localOnlyKeys,
      orderChanged,
      remoteOnlyKeys,
      startupChanged,
      status: "in-sync",
    };
  }

  if (
    localOnlyKeys.length > 0 &&
    remoteOnlyKeys.length === 0 &&
    changedKeys.length === 0 &&
    !startupChanged &&
    !orderChanged
  ) {
    return {
      changedKeys,
      localOnlyKeys,
      orderChanged,
      remoteOnlyKeys,
      startupChanged,
      status: "local-only",
    };
  }

  if (
    remoteOnlyKeys.length > 0 &&
    localOnlyKeys.length === 0 &&
    changedKeys.length === 0 &&
    !startupChanged &&
    !orderChanged
  ) {
    return {
      changedKeys,
      localOnlyKeys,
      orderChanged,
      remoteOnlyKeys,
      startupChanged,
      status: "remote-only",
    };
  }

  return {
    changedKeys,
    localOnlyKeys,
    orderChanged,
    remoteOnlyKeys,
    startupChanged,
    status: "diverged",
  };
}

export function formatVariantSyncStatus(
  comparison: VariantSyncComparison | undefined,
) {
  if (!comparison) {
    return "No remote link";
  }

  if (comparison.status === "in-sync") {
    return "In sync";
  }
  if (comparison.status === "local-only") {
    return "Local changes only";
  }
  if (comparison.status === "remote-only") {
    return "Remote changes only";
  }

  return "Conflict review";
}

export function buildVariantSyncEntries<
  TPreset,
  TVariantKey extends string = string,
>(
  localSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>,
  remoteSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>,
  comparison: VariantSyncComparison,
) {
  const localVariantMap = new Map(
    localSnapshot.variants.map((variant) => [variant.key, variant] as const),
  );
  const remoteVariantMap = new Map(
    remoteSnapshot.variants.map((variant) => [variant.key, variant] as const),
  );

  function createEntry(
    key: string,
    state: VariantSyncEntry["state"],
  ): VariantSyncEntry {
    const localVariant = localVariantMap.get(key);
    const remoteVariant = remoteVariantMap.get(key);

    return {
      key,
      localLabel: localVariant?.label,
      localUpdatedAt: localVariant?.updatedAt,
      remoteLabel: remoteVariant?.label,
      remoteUpdatedAt: remoteVariant?.updatedAt,
      state,
    };
  }

  return {
    changed: comparison.changedKeys.map((key) => createEntry(key, "changed")),
    localOnly: comparison.localOnlyKeys.map((key) =>
      createEntry(key, "local-only"),
    ),
    remoteOnly: comparison.remoteOnlyKeys.map((key) =>
      createEntry(key, "remote-only"),
    ),
  };
}

export function getVariantSyncEntryFreshness(entry: VariantSyncEntry) {
  const localTimestamp = entry.localUpdatedAt
    ? Date.parse(entry.localUpdatedAt)
    : Number.NaN;
  const remoteTimestamp = entry.remoteUpdatedAt
    ? Date.parse(entry.remoteUpdatedAt)
    : Number.NaN;

  if (Number.isNaN(localTimestamp) || Number.isNaN(remoteTimestamp)) {
    return "Timestamp unavailable";
  }

  if (localTimestamp === remoteTimestamp) {
    return "Same update time";
  }

  return localTimestamp > remoteTimestamp ? "Local newer" : "Remote newer";
}

export function createVariantSyncReviewSelections(
  comparison: VariantSyncComparison,
): VariantSyncReviewSelections {
  const variantSelections = Object.fromEntries([
    ...comparison.changedKeys.map((key) => [key, "remote"] as const),
    ...comparison.localOnlyKeys.map((key) => [key, "local"] as const),
    ...comparison.remoteOnlyKeys.map((key) => [key, "remote"] as const),
  ]);

  return {
    orderSelection: "local",
    startupSelection: "local",
    variantSelections,
  };
}

export function mergeRemoteVariantsIntoLocal<TPreset>(
  localVariants: Array<SavedVariant<TPreset>>,
  remoteVariants: Array<SavedVariant<TPreset>>,
) {
  const remoteVariantMap = new Map(
    remoteVariants.map((variant) => [variant.key, variant] as const),
  );
  const mergedVariants = localVariants.map((variant) => {
    const remoteVariant = remoteVariantMap.get(variant.key);

    return remoteVariant ?? variant;
  });
  const localVariantKeySet = new Set(localVariants.map((variant) => variant.key));

  remoteVariants.forEach((variant) => {
    if (!localVariantKeySet.has(variant.key)) {
      mergedVariants.push(variant);
    }
  });

  return mergedVariants;
}

export function composeReviewedVariantSnapshot<
  TPreset,
  TVariantKey extends string = string,
>({
  fallbackStartupVariantKey,
  isValidStartupVariantKey,
  localSnapshot,
  remoteSnapshot,
  selections,
  version = localSnapshot.version,
}: {
  fallbackStartupVariantKey: TVariantKey;
  isValidStartupVariantKey?: (
    candidate: string,
    variants: Array<SavedVariant<TPreset>>,
  ) => boolean;
  localSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>;
  remoteSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>;
  selections: VariantSyncReviewSelections;
  version?: number;
}): VariantSyncSnapshot<TPreset, TVariantKey> {
  const localVariantMap = new Map(
    localSnapshot.variants.map((variant) => [variant.key, variant] as const),
  );
  const remoteVariantMap = new Map(
    remoteSnapshot.variants.map((variant) => [variant.key, variant] as const),
  );
  const selectedVariants = new Map<string, SavedVariant<TPreset>>();
  const allVariantKeys = new Set([
    ...localSnapshot.variants.map((variant) => variant.key),
    ...remoteSnapshot.variants.map((variant) => variant.key),
  ]);

  allVariantKeys.forEach((key) => {
    const selection = selections.variantSelections[key];
    const localVariant = localVariantMap.get(key);
    const remoteVariant = remoteVariantMap.get(key);

    if (selection === "none") {
      return;
    }

    if (selection === "remote" && remoteVariant) {
      selectedVariants.set(key, remoteVariant);
      return;
    }

    if (selection === "local" && localVariant) {
      selectedVariants.set(key, localVariant);
      return;
    }

    if (remoteVariant) {
      selectedVariants.set(key, remoteVariant);
      return;
    }

    if (localVariant) {
      selectedVariants.set(key, localVariant);
    }
  });

  const primaryOrder =
    selections.orderSelection === "remote"
      ? remoteSnapshot.variants.map((variant) => variant.key)
      : localSnapshot.variants.map((variant) => variant.key);
  const secondaryOrder =
    selections.orderSelection === "remote"
      ? localSnapshot.variants.map((variant) => variant.key)
      : remoteSnapshot.variants.map((variant) => variant.key);
  const orderedKeys = [...new Set([...primaryOrder, ...secondaryOrder])].filter(
    (key) => selectedVariants.has(key),
  );
  const variants = orderedKeys
    .map((key) => selectedVariants.get(key))
    .filter(
      (variant): variant is SavedVariant<TPreset> => variant !== undefined,
    );
  const candidateStartupVariantKey =
    selections.startupSelection === "remote"
      ? remoteSnapshot.startupVariantKey
      : localSnapshot.startupVariantKey;
  const startupVariantKey =
    isValidStartupVariantKey?.(candidateStartupVariantKey, variants)
      ? (candidateStartupVariantKey as TVariantKey)
      : fallbackStartupVariantKey;

  return createVariantSyncSnapshot({
    startupVariantKey,
    variants,
    version,
  });
}
