import {
  createLocalStorageVariantPersistenceAdapter,
  createMemoryVariantPersistenceAdapter,
  createSessionStorageVariantPersistenceAdapter,
  withLatencyVariantPersistenceAdapter,
  type DateRangeValue,
  type SavedVariant,
  type TableSort,
} from "@axiomui/react";

import {
  variantPresets,
  worklistGroupStorageKey,
  worklistMockRemoteVariantsStorageKey,
  worklistMockSessionVariantsStorageKey,
  worklistPersistenceStorageKey,
  worklistSavedVariantsVersion,
  worklistStartupVariantStorageKey,
  type RemoteAdapterMode,
  type WorklistFilters,
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "../demo-data";
import {
  resolveStoredStartupVariantKey,
  resolveStoredWorklistGroupBy,
} from "./worklist-controller-state";
import {
  isSortableWorklistColumnId,
  isWorklistGroupKey,
  normalizeOwnerValues,
  normalizeVisibleColumnIds,
} from "./worklist-state";
import { normalizeDateRangeValue, normalizeTimeValue } from "./worklist-utils";

export function readStoredStartupVariant(
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
) {
  if (typeof window === "undefined") {
    return "standard" as WorklistVariantKey;
  }

  try {
    const storedVariant =
      window.localStorage.getItem(worklistStartupVariantStorageKey) ?? undefined;

    return resolveStoredStartupVariantKey(storedVariant, variants);
  } catch {
    return "standard";
  }

  return resolveStoredStartupVariantKey(undefined, variants);
}

export function readStoredWorklistGroupBy(
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
) {
  if (typeof window === "undefined") {
    return variantPresets.standard.groupBy;
  }

  try {
    const storedGroup =
      window.localStorage.getItem(worklistGroupStorageKey) ?? undefined;
    const storedWorklistState = window.localStorage.getItem(worklistPersistenceStorageKey);

    return resolveStoredWorklistGroupBy({
      storedGroup,
      storedWorklistState,
      variants,
    });
  } catch {
    return variantPresets.standard.groupBy;
  }

  return variantPresets.standard.groupBy;
}

export function parseImportedWorklistFilters(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const defaultFilters = variantPresets.standard.filters;
  const candidate = value as Partial<Record<keyof WorklistFilters, unknown>> & {
    owner?: unknown;
    targetDate?: unknown;
    targetDateRange?: unknown;
    targetTime?: unknown;
    targetTimeFrom?: unknown;
  };
  const visibleColumnIds = Array.isArray(candidate.visibleColumnIds)
    ? normalizeVisibleColumnIds(
        candidate.visibleColumnIds.filter(
          (columnId): columnId is string => typeof columnId === "string",
        ),
      )
    : variantPresets.standard.filters.visibleColumnIds;
  const arrayOwners = Array.isArray(candidate.owners)
    ? normalizeOwnerValues(
        candidate.owners.filter((owner): owner is string => typeof owner === "string"),
      )
    : null;
  const owners =
    arrayOwners && arrayOwners.length > 0
      ? arrayOwners
      : typeof candidate.owner === "string" && candidate.owner.trim()
        ? normalizeOwnerValues([candidate.owner])
        : arrayOwners ?? defaultFilters.owners;
  const legacyTargetDate =
    typeof candidate.targetDate === "string" ? candidate.targetDate : "";
  const targetDateRange =
    candidate.targetDateRange && typeof candidate.targetDateRange === "object"
      ? normalizeDateRangeValue(candidate.targetDateRange as Partial<DateRangeValue>)
      : legacyTargetDate
        ? { start: legacyTargetDate, end: legacyTargetDate }
        : { start: "", end: "" };
  const targetTimeFrom = normalizeTimeValue(
    candidate.targetTimeFrom ?? candidate.targetTime,
  );

  return {
    search:
      typeof candidate.search === "string" ? candidate.search : defaultFilters.search,
    keywords: Array.isArray(candidate.keywords)
      ? candidate.keywords.filter(
          (keyword): keyword is string =>
            typeof keyword === "string" && keyword.trim().length > 0,
        )
      : defaultFilters.keywords,
    owners,
    targetDateRange,
    targetTimeFrom,
    priority:
      typeof candidate.priority === "string"
        ? candidate.priority
        : defaultFilters.priority,
    status:
      typeof candidate.status === "string" ? candidate.status : defaultFilters.status,
    wave: typeof candidate.wave === "string" ? candidate.wave : defaultFilters.wave,
    region:
      typeof candidate.region === "string" ? candidate.region : defaultFilters.region,
    visibleColumnIds:
      visibleColumnIds.length > 0
        ? visibleColumnIds
        : defaultFilters.visibleColumnIds,
  } satisfies WorklistFilters;
}

export function parseImportedWorklistSort(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as {
    columnId?: unknown;
    direction?: unknown;
  };

  if (
    typeof candidate.columnId !== "string" ||
    !isSortableWorklistColumnId(candidate.columnId) ||
    (candidate.direction !== "asc" && candidate.direction !== "desc")
  ) {
    return undefined;
  }

  return {
    columnId: candidate.columnId,
    direction: candidate.direction,
  } satisfies TableSort;
}

export function parseImportedWorklistVariantPreset(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    filters?: unknown;
    groupBy?: unknown;
    pageSize?: unknown;
    sort?: unknown;
  };
  const filters = parseImportedWorklistFilters(candidate.filters);

  if (!filters) {
    return null;
  }

  return {
    filters,
    groupBy:
      typeof candidate.groupBy === "string" && isWorklistGroupKey(candidate.groupBy)
        ? candidate.groupBy
        : undefined,
    pageSize:
      typeof candidate.pageSize === "number" && candidate.pageSize > 0
        ? Math.trunc(candidate.pageSize)
        : undefined,
    sort: parseImportedWorklistSort(candidate.sort),
  } satisfies WorklistVariantPreset;
}

export function parseImportedSavedWorklistVariant(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    key?: unknown;
    label?: unknown;
    description?: unknown;
    preset?: unknown;
    createdAt?: unknown;
    updatedAt?: unknown;
  };
  const preset = parseImportedWorklistVariantPreset(candidate.preset);

  if (
    typeof candidate.key !== "string" ||
    !candidate.key.trim() ||
    typeof candidate.label !== "string" ||
    !candidate.label.trim() ||
    !preset
  ) {
    return null;
  }

  const timestamp = new Date().toISOString();

  return {
    key: candidate.key.trim(),
    label: candidate.label.trim(),
    description:
      typeof candidate.description === "string" && candidate.description.trim()
        ? candidate.description.trim()
        : undefined,
    preset,
    createdAt:
      typeof candidate.createdAt === "string" ? candidate.createdAt : timestamp,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : timestamp,
  } satisfies SavedVariant<WorklistVariantPreset>;
}

const mockRemoteVariantStorageAdapter =
  createLocalStorageVariantPersistenceAdapter<WorklistVariantPreset, WorklistVariantKey>(
    {
      fallbackStartupVariantKey: "standard",
      parseVariant: parseImportedSavedWorklistVariant,
      storageKey: worklistMockRemoteVariantsStorageKey,
      version: worklistSavedVariantsVersion,
    },
  );

const mockRemoteSessionVariantStorageAdapter =
  createSessionStorageVariantPersistenceAdapter<
    WorklistVariantPreset,
    WorklistVariantKey
  >({
    fallbackStartupVariantKey: "standard",
    parseVariant: parseImportedSavedWorklistVariant,
    storageKey: worklistMockSessionVariantsStorageKey,
    version: worklistSavedVariantsVersion,
  });

const mockRemoteMemoryVariantStorageAdapter =
  createMemoryVariantPersistenceAdapter<WorklistVariantPreset, WorklistVariantKey>();

export const mockRemoteVariantAdapter = withLatencyVariantPersistenceAdapter(
  mockRemoteVariantStorageAdapter,
  {
    readDelayMs: 210,
    writeDelayMs: 210,
  },
);

export const mockRemoteSessionVariantAdapter = withLatencyVariantPersistenceAdapter(
  mockRemoteSessionVariantStorageAdapter,
  {
    readDelayMs: 210,
    writeDelayMs: 210,
  },
);

export const mockRemoteMemoryVariantAdapter = withLatencyVariantPersistenceAdapter(
  mockRemoteMemoryVariantStorageAdapter,
  {
    readDelayMs: 210,
    writeDelayMs: 210,
  },
);

export const remoteAdapterLabels: Record<RemoteAdapterMode, string> = {
  "local-storage": "localStorage mock cloud",
  "session-storage": "sessionStorage mock cloud",
  memory: "in-memory mock cloud",
};

export function mergeSavedWorklistVariants(
  currentVariants: Array<SavedVariant<WorklistVariantPreset>>,
  importedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  const mergedVariants = new Map(
    currentVariants.map((variant) => [variant.key, variant] as const),
  );

  importedVariants.forEach((variant) => {
    mergedVariants.set(variant.key, variant);
  });

  return [
    ...new Set([
      ...importedVariants.map((variant) => variant.key),
      ...currentVariants.map((variant) => variant.key),
    ]),
  ]
    .map((variantKey) => mergedVariants.get(variantKey))
    .filter(
      (
        variant,
      ): variant is SavedVariant<WorklistVariantPreset> => variant !== undefined,
    );
}

export function createSavedVariantsExportPayload(
  startupVariantKey: WorklistVariantKey,
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  return JSON.stringify(
    {
      version: worklistSavedVariantsVersion,
      exportedAt: new Date().toISOString(),
      startupVariantKey,
      variants: savedVariants,
    },
    null,
    2,
  );
}

export function parseSavedVariantsImportPayload(rawValue: string) {
  try {
    const parsedValue = JSON.parse(rawValue) as
      | {
          startupVariantKey?: unknown;
          variants?: unknown;
        }
      | unknown[];
    const variantSource = Array.isArray(parsedValue)
      ? parsedValue
      : Array.isArray(parsedValue?.variants)
        ? parsedValue.variants
        : null;

    if (!variantSource) {
      return {
        error: "JSON must be an array of saved views or an object with a variants array.",
      };
    }

    const importedVariants = variantSource.flatMap((variant) => {
      const parsedVariant = parseImportedSavedWorklistVariant(variant);

      return parsedVariant ? [parsedVariant] : [];
    });

    if (importedVariants.length === 0) {
      return {
        error: "No valid saved views were found in the imported JSON payload.",
      };
    }

    return {
      startupVariantKey:
        !Array.isArray(parsedValue) &&
        typeof parsedValue.startupVariantKey === "string"
          ? parsedValue.startupVariantKey
          : undefined,
      variants: importedVariants,
    };
  } catch {
    return {
      error: "The import payload is not valid JSON yet. Check commas and quotes, then try again.",
    };
  }
}
