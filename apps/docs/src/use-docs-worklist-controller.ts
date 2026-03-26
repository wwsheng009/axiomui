import { useState } from "react";

import { useDocsVariantDialogController } from "./use-docs-variant-dialog-controller";
import { useDocsWorklistStateController } from "./use-docs-worklist-state-controller";

interface UseDocsWorklistControllerOptions {
  densityLabel: string;
  locale: string;
  localeLabel: string;
  themeLabel: string;
}

export function useDocsWorklistController({
  densityLabel,
  locale,
  localeLabel,
  themeLabel,
}: UseDocsWorklistControllerOptions) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const worklistState = useDocsWorklistStateController();
  const variantDialogs = useDocsVariantDialogController({
    activeGroupBy: worklistState.activeGroupBy,
    activeSavedVariant: worklistState.activeSavedVariant,
    activeVariant: worklistState.activeVariant,
    activeVariantDirty: worklistState.activeVariantDirty,
    activeVariantLabel: worklistState.activeVariantLabel,
    applyVariantSelection: worklistState.applyVariantSelection,
    currentVariantPreset: worklistState.currentVariantPreset,
    removeSavedWorklistVariant: worklistState.removeSavedWorklistVariant,
    replaceSavedWorklistVariants: worklistState.replaceSavedWorklistVariants,
    saveWorklistVariant: worklistState.saveWorklistVariant,
    savedWorklistVariants: worklistState.savedWorklistVariants,
    setStartupVariantKey: worklistState.setStartupVariantKey,
    startupVariantKey: worklistState.startupVariantKey,
    startupVariantLabel: worklistState.startupVariantLabel,
    worklistVariants: worklistState.worklistVariants,
  });

  return {
    closeWorkspaceDraftDialog: () => setDialogOpen(false),
    openWorkspaceDraftDialog: () => setDialogOpen(true),
    selectedRowCount: worklistState.selectedRowCount,
    worklistFilterManagementProps: {
      activeGroupBy: worklistState.activeGroupBy,
      activeRemoteAdapterLabel: variantDialogs.activeRemoteAdapterLabel,
      activeVariant: worklistState.activeVariant,
      activeVariantDirty: worklistState.activeVariantDirty,
      activeVariantLabel: worklistState.activeVariantLabel,
      appliedFilters: worklistState.appliedFilters,
      applyDraftFilters: worklistState.applyDraftFilters,
      densityLabel,
      draftFilters: worklistState.draftFilters,
      filteredItemsCount: worklistState.filteredItems.length,
      locale,
      localeLabel,
      page: worklistState.page,
      pageCount: worklistState.pageCount,
      pageEnd: worklistState.pageEnd,
      pageGroupCount: worklistState.activeGroupBy
        ? worklistState.paginatedGroupedWorkItems.length
        : 0,
      pageStart: worklistState.pageStart,
      remoteSnapshot: variantDialogs.remoteSnapshot,
      remoteSyncStatusLabel: variantDialogs.remoteSyncStatusLabel,
      savedVariantCount: variantDialogs.savedVariantCount,
      startupVariantKey: worklistState.startupVariantKey,
      startupVariantLabel: worklistState.startupVariantLabel,
      tableSort: worklistState.tableSort,
      themeLabel,
      totalItems: worklistState.totalItems,
      variants: variantDialogs.variants,
      onActiveGroupByChange: worklistState.setActiveGroupBy,
      onApplyVariantSelection: worklistState.applyVariantSelection,
      onOpenManageVariants: variantDialogs.openManageVariants,
      onOpenSaveVariant: variantDialogs.openSaveVariantDialog,
      onResetDraftColumnsToVariant: worklistState.resetDraftColumnsToVariant,
      onResetGroupToVariant: worklistState.resetGroupToVariant,
      onResetSortToVariant: worklistState.resetSortToVariant,
      onResetToActiveVariant: () =>
        worklistState.resetWorklistToVariant(worklistState.activeVariant),
      onSetActiveVariantAsStartup: () =>
        worklistState.setStartupVariantKey(worklistState.activeVariant),
      onShowAllDraftColumns: worklistState.showAllDraftColumns,
      onSortChange: worklistState.setSort,
      onUpdateDraftFilter: worklistState.updateDraftFilter,
      onUpdateDraftVisibleColumns: worklistState.updateDraftVisibleColumns,
    },
    worklistResultsProps: {
      activeGroupBy: worklistState.activeGroupBy,
      filteredItemsCount: worklistState.filteredItems.length,
      groups: worklistState.activeGroupBy
        ? worklistState.paginatedGroupedWorkItems
        : undefined,
      page: worklistState.page,
      pageCount: worklistState.pageCount,
      pageEnd: worklistState.pageEnd,
      pageSize: worklistState.pageSize,
      pageSizeOptions: worklistState.pageSizeOptions,
      pageStart: worklistState.pageStart,
      rows: worklistState.paginatedItems,
      selectedRowIds: worklistState.selectedRowIds,
      sort: worklistState.tableSort,
      visibleColumnIds: worklistState.appliedFilters.visibleColumnIds,
      onOpenCreateDialog: () => setDialogOpen(true),
      onPageChange: worklistState.setPage,
      onPageSizeChange: worklistState.setPageSize,
      onSelectionChange: worklistState.setSelectedRowIds,
      onSortChange: worklistState.setSort,
    },
    saveWorklistViewDialogProps: variantDialogs.saveWorklistViewDialogProps,
    manageLocalViewsDialogProps: variantDialogs.manageLocalViewsDialogProps,
    worklistVariantSyncReviewDialogProps:
      variantDialogs.worklistVariantSyncReviewDialogProps,
    renameLocalViewDialogProps: variantDialogs.renameLocalViewDialogProps,
    worklistVariantTransferDialogProps:
      variantDialogs.worklistVariantTransferDialogProps,
    workspaceDraftDialogProps: {
      open: dialogOpen,
      onClose: () => setDialogOpen(false),
    },
  };
}
