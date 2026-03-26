import type { SavedVariant, TableSort } from "@axiomui/react";

import {
  variantPresets,
  workItems,
  worklistColumnItems,
  worklistGroupIds,
  worklistSortItems,
  type BuiltInWorklistVariantKey,
  type WorkItem,
  type WorklistFilters,
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "../demo-data";
import {
  areDateRangeValuesEqual,
  matchesDateRangeFilter,
  matchesTimeFromFilter,
  normalizeDateRangeValue,
  normalizeTimeValue,
} from "./worklist-utils";

export function normalizeOwnerValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function cloneFilters(filters: WorklistFilters): WorklistFilters {
  return {
    ...filters,
    keywords: [...(filters.keywords ?? [])],
    owners: [...(filters.owners ?? [])],
    targetDateRange: normalizeDateRangeValue(filters.targetDateRange),
    targetTimeFrom: normalizeTimeValue(filters.targetTimeFrom),
    visibleColumnIds: [...(filters.visibleColumnIds ?? [])],
  };
}

export function cloneWorklistVariantPreset(
  preset: WorklistVariantPreset,
): WorklistVariantPreset {
  return {
    filters: cloneFilters(preset.filters),
    sort: preset.sort ? { ...preset.sort } : undefined,
    pageSize: preset.pageSize,
    groupBy: preset.groupBy,
  };
}

export function createWorklistVariantPreset({
  filters,
  groupBy,
  pageSize,
  sort,
}: WorklistVariantPreset): WorklistVariantPreset {
  return {
    filters: cloneFilters(filters),
    groupBy,
    pageSize,
    sort: sort ? { ...sort } : undefined,
  };
}

export function isBuiltInWorklistVariantKey(
  value: string,
): value is BuiltInWorklistVariantKey {
  return Object.prototype.hasOwnProperty.call(variantPresets, value);
}

export function isWorklistVariantKey(
  value: string | undefined,
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
): value is WorklistVariantKey {
  return Boolean(value && Object.prototype.hasOwnProperty.call(variants, value));
}

export function buildWorklistVariantMap(
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  const savedVariantEntries = savedVariants.map((variant) => [
    variant.key,
    cloneWorklistVariantPreset(variant.preset),
  ]);

  return {
    ...variantPresets,
    ...Object.fromEntries(savedVariantEntries),
  } as Record<WorklistVariantKey, WorklistVariantPreset>;
}

function areStringArraysEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function areWorklistFiltersEqual(left: WorklistFilters, right: WorklistFilters) {
  return (
    left.search === right.search &&
    areStringArraysEqual(left.keywords ?? [], right.keywords ?? []) &&
    areStringArraysEqual(left.owners ?? [], right.owners ?? []) &&
    areDateRangeValuesEqual(left.targetDateRange, right.targetDateRange) &&
    left.targetTimeFrom === right.targetTimeFrom &&
    left.priority === right.priority &&
    left.status === right.status &&
    left.wave === right.wave &&
    left.region === right.region &&
    areStringArraysEqual(left.visibleColumnIds, right.visibleColumnIds)
  );
}

function areTableSortEqual(left: TableSort | undefined, right: TableSort | undefined) {
  if (!left && !right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return left.columnId === right.columnId && left.direction === right.direction;
}

export function areWorklistVariantPresetsEqual(
  left: WorklistVariantPreset,
  right: WorklistVariantPreset,
) {
  return (
    areWorklistFiltersEqual(left.filters, right.filters) &&
    areTableSortEqual(left.sort, right.sort) &&
    (left.pageSize ?? undefined) === (right.pageSize ?? undefined) &&
    (left.groupBy ?? undefined) === (right.groupBy ?? undefined)
  );
}

export function normalizeVisibleColumnIds(visibleColumnIds: string[]) {
  const visibleColumnIdSet = new Set(visibleColumnIds);

  return worklistColumnItems
    .filter((item) => item.required || visibleColumnIdSet.has(item.id))
    .map((item) => item.id);
}

function includesFilter(value: string, query: string) {
  if (!query.trim()) {
    return true;
  }

  return value.toLowerCase().includes(query.trim().toLowerCase());
}

function matchesStringArrayFilter(value: string, queries: string[]) {
  if (!queries.length) {
    return true;
  }

  return queries.includes(value);
}

export function getPrioritySortValue(priority: WorkItem["priority"]) {
  if (priority === "Negative") {
    return 4;
  }
  if (priority === "Attention") {
    return 3;
  }
  if (priority === "Information") {
    return 2;
  }

  return 1;
}

export function filterWorkItem(workItem: WorkItem, filters: WorklistFilters) {
  const searchMatch =
    includesFilter(workItem.object, filters.search) ||
    includesFilter(workItem.id, filters.search);
  const combinedSearchText = [
    workItem.object,
    workItem.id,
    workItem.owner,
    workItem.priority,
    workItem.status,
    workItem.targetDate,
    workItem.targetTime,
    workItem.wave,
    workItem.region,
  ]
    .join(" ")
    .toLowerCase();
  const keywordsMatch = (filters.keywords ?? []).every((keyword) =>
    combinedSearchText.includes(keyword.toLowerCase()),
  );

  return (
    searchMatch &&
    keywordsMatch &&
    matchesStringArrayFilter(workItem.owner, filters.owners ?? []) &&
    matchesDateRangeFilter(workItem.targetDate, filters.targetDateRange) &&
    matchesTimeFromFilter(workItem.targetTime, filters.targetTimeFrom) &&
    includesFilter(workItem.priority, filters.priority) &&
    includesFilter(workItem.status, filters.status) &&
    includesFilter(workItem.wave, filters.wave) &&
    includesFilter(workItem.region, filters.region)
  );
}

export function getVisibleColumnIds(filters: WorklistFilters) {
  return filters.visibleColumnIds;
}

export function isSortableWorklistColumnId(value: string) {
  return worklistSortItems.some((item) => item.id === value);
}

export function countWorkItemsForFilters(filters: WorklistFilters) {
  return workItems.filter((workItem) => filterWorkItem(workItem, filters)).length;
}

export function isWorklistGroupKey(value: string | undefined): value is WorklistGroupKey {
  return Boolean(value && worklistGroupIds.includes(value as WorklistGroupKey));
}

function compareWorklistGroupValues(
  groupBy: WorklistGroupKey,
  left: string,
  right: string,
) {
  if (groupBy === "priority") {
    return getPrioritySortValue(left as WorkItem["priority"]) - getPrioritySortValue(
      right as WorkItem["priority"],
    );
  }

  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function groupWorkItems(
  items: WorkItem[],
  groupBy: WorklistGroupKey | undefined,
) {
  if (!groupBy) {
    return [];
  }

  const groups = new Map<string, WorkItem[]>();

  items.forEach((item) => {
    const groupValue = item[groupBy];
    const groupItems = groups.get(groupValue);

    if (groupItems) {
      groupItems.push(item);
      return;
    }

    groups.set(groupValue, [item]);
  });

  return [...groups.entries()]
    .sort(([left], [right]) => compareWorklistGroupValues(groupBy, left, right))
    .map(([key, groupItems]) => ({
      key,
      label: key,
      rows: groupItems,
      count: `${groupItems.length} items`,
    }));
}
