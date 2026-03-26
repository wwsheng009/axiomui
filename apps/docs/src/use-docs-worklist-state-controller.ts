import { useEffect, useState } from "react";

import {
  useSavedVariants,
  useWorklistState,
} from "@axiomui/react";

import {
  allWorklistColumnIds,
  type WorkItem,
  type WorklistFilters,
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
  variantPresets,
  workItems,
  worklistGroupStorageKey,
  worklistPageSizeOptions,
  worklistPersistenceStorageKey,
  worklistPersistenceVersion,
  worklistSavedVariantsStorageKey,
  worklistSavedVariantsVersion,
  worklistStartupVariantStorageKey,
} from "./demo-data";
import {
  getWorklistVariantLabel,
  worklistColumns,
} from "./worklist-advanced/worklist-display";
import {
  normalizeWorklistControllerFilters,
  resolveStartupVariantKey,
} from "./worklist-advanced/worklist-controller-state";
import {
  readStoredStartupVariant,
  readStoredWorklistGroupBy,
} from "./worklist-advanced/worklist-persistence";
import {
  areWorklistVariantPresetsEqual,
  buildWorklistVariantMap,
  cloneFilters,
  cloneWorklistVariantPreset,
  createWorklistVariantPreset,
  filterWorkItem,
  getVisibleColumnIds,
  groupWorkItems,
  normalizeVisibleColumnIds,
} from "./worklist-advanced/worklist-state";

export function useDocsWorklistStateController() {
  const {
    getVariant: getSavedWorklistVariant,
    removeVariant: removeSavedWorklistVariant,
    replaceVariants: replaceSavedWorklistVariants,
    saveVariant: saveWorklistVariant,
    variants: savedWorklistVariants,
  } = useSavedVariants<WorklistVariantPreset>({
    clonePreset: cloneWorklistVariantPreset,
    persistence: {
      storageKey: worklistSavedVariantsStorageKey,
      version: worklistSavedVariantsVersion,
    },
  });
  const worklistVariants = buildWorklistVariantMap(savedWorklistVariants);
  const [startupVariantKey, setStartupVariantKey] = useState<WorklistVariantKey>(
    () => readStoredStartupVariant(worklistVariants),
  );
  const [activeGroupBy, setActiveGroupBy] = useState<WorklistGroupKey | undefined>(
    () => readStoredWorklistGroupBy(worklistVariants),
  );
  const {
    activeVariant,
    applyDraftFilters,
    applyVariant,
    appliedFilters,
    draftFilters,
    filteredItems,
    page,
    pageCount,
    pageEnd,
    pageSize,
    pageStart,
    paginatedItems,
    resetToVariant,
    selectedRowIds,
    setDraftFilters,
    setPage,
    setPageSize,
    setSelectedRowIds,
    setSort,
    sort: tableSort,
    totalItems,
    updateDraftFilter,
  } = useWorklistState<WorkItem, WorklistFilters, WorklistVariantKey>({
    cloneFilters,
    columns: worklistColumns,
    defaultPageSize: 3,
    defaultSelectedRowIds: ["AX-1031"],
    filterItem: filterWorkItem,
    getVisibleColumnIds,
    initialVariant: startupVariantKey,
    items: workItems,
    normalizeFilters: normalizeWorklistControllerFilters,
    persistence: {
      storageKey: worklistPersistenceStorageKey,
      version: worklistPersistenceVersion,
    },
    variants: worklistVariants,
  });
  const activeVariantPreset = worklistVariants[activeVariant] ?? variantPresets.standard;
  const activeSavedVariant = getSavedWorklistVariant(activeVariant);
  const currentVariantPreset = createWorklistVariantPreset({
    filters: draftFilters,
    groupBy: activeGroupBy,
    pageSize,
    sort: tableSort,
  });
  const activeVariantDirty = !areWorklistVariantPresetsEqual(
    currentVariantPreset,
    activeVariantPreset,
  );
  const paginatedGroupedWorkItems = groupWorkItems(paginatedItems, activeGroupBy);
  const activeVariantLabel = getWorklistVariantLabel(activeVariant, savedWorklistVariants);
  const startupVariantLabel = getWorklistVariantLabel(
    startupVariantKey,
    savedWorklistVariants,
  );

  function resolveWorklistVariantPreset(variantKey: WorklistVariantKey) {
    return worklistVariants[variantKey] ?? variantPresets.standard;
  }

  function applyVariantSelection(variantKey: WorklistVariantKey) {
    const nextPreset = resolveWorklistVariantPreset(variantKey);

    applyVariant(variantKey);
    setActiveGroupBy(nextPreset.groupBy);
  }

  function updateDraftVisibleColumns(visibleColumnIds: string[]) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      visibleColumnIds: normalizeVisibleColumnIds(visibleColumnIds),
    }));
  }

  function showAllDraftColumns() {
    updateDraftVisibleColumns(allWorklistColumnIds);
  }

  function resetDraftColumnsToVariant() {
    updateDraftVisibleColumns(resolveWorklistVariantPreset(activeVariant).filters.visibleColumnIds);
  }

  function resetSortToVariant() {
    const nextSort = resolveWorklistVariantPreset(activeVariant).sort;

    setSort(nextSort ? { ...nextSort } : undefined);
  }

  function resetGroupToVariant() {
    setActiveGroupBy(resolveWorklistVariantPreset(activeVariant).groupBy);
  }

  function resetWorklistToVariant(variantKey: WorklistVariantKey = activeVariant) {
    const nextPreset = resolveWorklistVariantPreset(variantKey);

    resetToVariant(variantKey);
    setActiveGroupBy(nextPreset.groupBy);
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (activeGroupBy) {
        window.localStorage.setItem(worklistGroupStorageKey, activeGroupBy);
      } else {
        window.localStorage.removeItem(worklistGroupStorageKey);
      }
    } catch {
      // Ignore localStorage write issues for the docs demo.
    }
  }, [activeGroupBy]);

  useEffect(() => {
    const nextStartupVariantKey = resolveStartupVariantKey(
      startupVariantKey,
      worklistVariants,
    );

    if (nextStartupVariantKey === startupVariantKey) {
      return;
    }

    setStartupVariantKey(nextStartupVariantKey);
  }, [startupVariantKey, worklistVariants]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(worklistStartupVariantStorageKey, startupVariantKey);
    } catch {
      // Ignore localStorage write issues for the docs demo.
    }
  }, [startupVariantKey]);

  return {
    activeGroupBy,
    activeSavedVariant,
    activeVariant,
    activeVariantDirty,
    activeVariantLabel,
    applyDraftFilters,
    applyVariantSelection,
    appliedFilters,
    currentVariantPreset,
    draftFilters,
    filteredItems,
    getSavedWorklistVariant,
    page,
    pageCount,
    pageEnd,
    pageSize,
    pageSizeOptions: worklistPageSizeOptions,
    pageStart,
    paginatedGroupedWorkItems,
    paginatedItems,
    removeSavedWorklistVariant,
    replaceSavedWorklistVariants,
    resetDraftColumnsToVariant,
    resetGroupToVariant,
    resetSortToVariant,
    resetWorklistToVariant,
    saveWorklistVariant,
    savedWorklistVariants,
    selectedRowCount: selectedRowIds.length,
    selectedRowIds,
    setActiveGroupBy,
    setPage,
    setPageSize,
    setSelectedRowIds,
    setSort,
    setStartupVariantKey,
    showAllDraftColumns,
    startupVariantKey,
    startupVariantLabel,
    tableSort,
    totalItems,
    updateDraftFilter,
    updateDraftVisibleColumns,
    worklistVariants,
  };
}
