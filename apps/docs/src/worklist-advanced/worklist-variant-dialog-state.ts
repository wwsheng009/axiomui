import { type SavedVariant } from "@axiomui/react";

import {
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "../demo-data";
import { mergeSavedWorklistVariants } from "./worklist-persistence";
import { buildWorklistVariantMap, isWorklistVariantKey } from "./worklist-state";

export function moveSavedWorklistVariants(
  variants: Array<SavedVariant<WorklistVariantPreset>>,
  variantKey: string,
  direction: -1 | 1,
) {
  const currentIndex = variants.findIndex((variant) => variant.key === variantKey);

  if (currentIndex === -1) {
    return variants;
  }

  const nextIndex = currentIndex + direction;

  if (nextIndex < 0 || nextIndex >= variants.length) {
    return variants;
  }

  const nextVariants = [...variants];
  const [movedVariant] = nextVariants.splice(currentIndex, 1);

  nextVariants.splice(nextIndex, 0, movedVariant);

  return nextVariants;
}

export function renameSavedWorklistVariants(
  variants: Array<SavedVariant<WorklistVariantPreset>>,
  {
    description,
    key,
    label,
    updatedAt,
  }: {
    description: string;
    key: string;
    label: string;
    updatedAt: string;
  },
) {
  const trimmedLabel = label.trim() || "Untitled view";
  const trimmedDescription = description.trim() || undefined;

  return variants.map((variant) =>
    variant.key === key
      ? {
          ...variant,
          description: trimmedDescription,
          label: trimmedLabel,
          updatedAt,
        }
      : variant,
  );
}

export function resolveDeletedVariantFallbacks(
  deletedVariantKey: string,
  activeVariant: WorklistVariantKey,
  startupVariantKey: WorklistVariantKey,
  fallbackVariantKey: WorklistVariantKey = "standard",
) {
  return {
    nextActiveVariantKey:
      deletedVariantKey === activeVariant ? fallbackVariantKey : undefined,
    nextStartupVariantKey:
      deletedVariantKey === startupVariantKey ? fallbackVariantKey : undefined,
  };
}

export function resolveImportedSavedVariants({
  currentStartupVariantKey,
  importedStartupVariantKey,
  importedVariants,
  savedVariants,
}: {
  currentStartupVariantKey: WorklistVariantKey;
  importedStartupVariantKey: string | undefined;
  importedVariants: Array<SavedVariant<WorklistVariantPreset>>;
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>;
}) {
  const mergedVariants = mergeSavedWorklistVariants(savedVariants, importedVariants);
  const mergedVariantMap = buildWorklistVariantMap(mergedVariants);
  const nextStartupVariantKey: WorklistVariantKey = isWorklistVariantKey(
    importedStartupVariantKey,
    mergedVariantMap,
  )
    ? importedStartupVariantKey
    : currentStartupVariantKey;

  return {
    mergedVariants,
    nextStartupVariantKey,
  };
}
