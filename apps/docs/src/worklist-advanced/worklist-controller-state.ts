import { type DateRangeValue } from "@axiomui/react";

import {
  allWorklistColumnIds,
  type WorklistFilters,
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
  variantPresets,
  worklistPersistenceVersion,
} from "../demo-data";
import {
  isWorklistGroupKey,
  isWorklistVariantKey,
  normalizeOwnerValues,
  normalizeVisibleColumnIds,
} from "./worklist-state";
import { normalizeDateRangeValue, normalizeTimeValue } from "./worklist-utils";

type PersistedWorklistStateCandidate = {
  activeVariant?: unknown;
  version?: unknown;
};

type LegacyWorklistFilters = Partial<WorklistFilters> & {
  owner?: unknown;
  targetDate?: unknown;
  targetDateRange?: unknown;
  targetTime?: unknown;
  targetTimeFrom?: unknown;
};

export function normalizeWorklistControllerFilters(
  filters: LegacyWorklistFilters,
): WorklistFilters {
  const defaultFilters = variantPresets.standard.filters;
  const {
    owner: legacyOwner,
    targetDate,
    targetDateRange,
    targetTime,
    targetTimeFrom,
    ...restFilters
  } = filters;
  const legacyTargetDate = typeof targetDate === "string" ? targetDate : "";

  return {
    ...defaultFilters,
    ...restFilters,
    owners: normalizeOwnerValues(
      Array.isArray(filters.owners)
        ? filters.owners
        : typeof legacyOwner === "string" && legacyOwner.trim()
          ? [legacyOwner]
          : [],
    ),
    keywords: [...(filters.keywords ?? defaultFilters.keywords)],
    targetDateRange:
      targetDateRange && typeof targetDateRange === "object"
        ? normalizeDateRangeValue(targetDateRange as Partial<DateRangeValue>)
        : legacyTargetDate
          ? { end: legacyTargetDate, start: legacyTargetDate }
          : { end: "", start: "" },
    targetTimeFrom: normalizeTimeValue(targetTimeFrom ?? targetTime),
    visibleColumnIds: normalizeVisibleColumnIds(
      filters.visibleColumnIds ?? allWorklistColumnIds,
    ),
  };
}

export function resolveStoredStartupVariantKey(
  storedVariantKey: string | undefined,
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
  fallbackVariantKey: WorklistVariantKey = "standard",
) {
  return isWorklistVariantKey(storedVariantKey, variants)
    ? storedVariantKey
    : fallbackVariantKey;
}

export function resolveStoredWorklistGroupBy(
  {
    storedGroup,
    storedWorklistState,
    variants,
  }: {
    storedGroup: string | undefined;
    storedWorklistState: string | null;
    variants: Record<WorklistVariantKey, WorklistVariantPreset>;
  },
  fallbackGroupBy: WorklistGroupKey | undefined = variantPresets.standard.groupBy,
) {
  if (isWorklistGroupKey(storedGroup)) {
    return storedGroup;
  }

  if (!storedWorklistState) {
    return fallbackGroupBy;
  }

  try {
    const parsedState = JSON.parse(
      storedWorklistState,
    ) as PersistedWorklistStateCandidate;

    if (
      parsedState.version === worklistPersistenceVersion &&
      typeof parsedState.activeVariant === "string" &&
      isWorklistVariantKey(parsedState.activeVariant, variants)
    ) {
      return variants[parsedState.activeVariant].groupBy;
    }
  } catch {
    return fallbackGroupBy;
  }

  return fallbackGroupBy;
}

export function resolveStartupVariantKey(
  startupVariantKey: WorklistVariantKey,
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
  fallbackVariantKey: WorklistVariantKey = "standard",
) {
  return isWorklistVariantKey(startupVariantKey, variants)
    ? startupVariantKey
    : fallbackVariantKey;
}
