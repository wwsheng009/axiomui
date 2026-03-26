import { type SavedVariant } from "@axiomui/react";

import {
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "./demo-data";
import { buildVariantManagerOptions } from "./worklist-advanced/worklist-variant-view-models";
import { useDocsVariantReviewDialogController } from "./use-docs-variant-review-dialog-controller";
import { useDocsSavedViewDialogController } from "./use-docs-saved-view-dialog-controller";
import { useDocsVariantSyncController } from "./use-docs-variant-sync-controller";

interface UseDocsVariantDialogControllerOptions {
  activeGroupBy: WorklistGroupKey | undefined;
  activeSavedVariant:
    | SavedVariant<WorklistVariantPreset>
    | undefined;
  activeVariant: WorklistVariantKey;
  activeVariantDirty: boolean;
  activeVariantLabel: string;
  applyVariantSelection: (variantKey: WorklistVariantKey) => void;
  currentVariantPreset: WorklistVariantPreset;
  replaceSavedWorklistVariants: (
    variants: Array<SavedVariant<WorklistVariantPreset>>,
  ) => void;
  saveWorklistVariant: (variant: {
    description?: string;
    key?: string;
    label: string;
    preset: WorklistVariantPreset;
  }) => string;
  savedWorklistVariants: Array<SavedVariant<WorklistVariantPreset>>;
  setStartupVariantKey: (variantKey: WorklistVariantKey) => void;
  startupVariantKey: WorklistVariantKey;
  startupVariantLabel: string;
  worklistVariants: Record<WorklistVariantKey, WorklistVariantPreset>;
  removeSavedWorklistVariant: (key: string) => void;
}

export function useDocsVariantDialogController({
  activeGroupBy,
  activeSavedVariant,
  activeVariant,
  activeVariantDirty,
  activeVariantLabel,
  applyVariantSelection,
  currentVariantPreset,
  replaceSavedWorklistVariants,
  saveWorklistVariant,
  savedWorklistVariants,
  setStartupVariantKey,
  startupVariantKey,
  startupVariantLabel,
  worklistVariants,
  removeSavedWorklistVariant,
}: UseDocsVariantDialogControllerOptions) {
  const variants = buildVariantManagerOptions({
    activeVariant,
    activeVariantDirty,
    savedVariants: savedWorklistVariants,
  });
  const savedViewDialogs = useDocsSavedViewDialogController({
    activeGroupBy,
    activeSavedVariant,
    activeVariant,
    activeVariantLabel,
    applyVariantSelection,
    currentVariantPreset,
    removeSavedWorklistVariant,
    replaceSavedWorklistVariants,
    saveWorklistVariant,
    savedWorklistVariants,
    setStartupVariantKey,
    startupVariantKey,
    startupVariantLabel,
    worklistVariants,
  });
  const syncController = useDocsVariantSyncController({
    activeGroupBy,
    activeVariant,
    applyVariantSelection,
    currentVariantPreset,
    replaceSavedWorklistVariants,
    savedWorklistVariants,
    setStartupVariantKey,
    startupVariantKey,
    startupVariantLabel,
    worklistVariants,
  });
  const reviewDialogs = useDocsVariantReviewDialogController({
    onCloseManageVariants: savedViewDialogs.closeManageVariants,
    onOpenManageVariants: savedViewDialogs.openManageVariants,
    reviewDialogProps: syncController.reviewDialogProps,
    savedVariants: savedWorklistVariants,
    startupVariantLabel,
  });

  return {
    activeRemoteAdapterLabel: syncController.activeRemoteAdapterLabel,
    remoteSnapshot: syncController.manageDialogSyncProps.remoteSnapshot,
    remoteSyncStatusLabel: syncController.manageDialogSyncProps.syncStatusLabel,
    savedVariantCount: savedWorklistVariants.length,
    variants,
    openManageVariants: savedViewDialogs.openManageVariants,
    openSaveVariantDialog: savedViewDialogs.openSaveVariantDialog,
    saveWorklistViewDialogProps: savedViewDialogs.saveWorklistViewDialogProps,
    manageLocalViewsDialogProps: {
      activeRemoteAdapterLabel: syncController.activeRemoteAdapterLabel,
      activeVariant,
      activeVariantSyncActivities: syncController.activeVariantSyncActivities,
      canSync: syncController.manageDialogSyncProps.syncState.status === "idle",
      localSnapshot: syncController.localVariantSnapshot,
      open: savedViewDialogs.manageSavedViewDialogProps.open,
      remoteAdapterMode: syncController.manageDialogSyncProps.remoteAdapterMode,
      remoteAutoRefreshMs: syncController.manageDialogSyncProps.remoteAutoRefreshMs,
      remoteAutoRefreshOptions:
        syncController.manageDialogSyncProps.remoteAutoRefreshOptions,
      remoteCheckState: syncController.manageDialogSyncProps.remoteCheckState,
      remoteDriftNotice: syncController.manageDialogSyncProps.remoteDriftNotice,
      remoteSnapshot: syncController.manageDialogSyncProps.remoteSnapshot,
      reviewState: reviewDialogs.reviewState,
      savedVariants: savedWorklistVariants,
      startupVariantKey,
      startupVariantLabel,
      syncState: syncController.manageDialogSyncProps.syncState,
      syncStatusLabel: syncController.manageDialogSyncProps.syncStatusLabel,
      onApplyVariant: applyVariantSelection,
      onClearHistory: syncController.manageDialogSyncProps.onClearHistory,
      onClearRemote: syncController.manageDialogSyncProps.onClearRemote,
      onClose: savedViewDialogs.manageSavedViewDialogProps.onClose,
      onDeleteVariant: savedViewDialogs.manageSavedViewDialogProps.onDeleteVariant,
      onDuplicateVariant:
        savedViewDialogs.manageSavedViewDialogProps.onDuplicateVariant,
      onMoveVariant: savedViewDialogs.manageSavedViewDialogProps.onMoveVariant,
      onOpenExport: savedViewDialogs.manageSavedViewDialogProps.onOpenExport,
      onOpenImport: savedViewDialogs.manageSavedViewDialogProps.onOpenImport,
      onPullFromMockCloud: syncController.manageDialogSyncProps.onPullFromMockCloud,
      onPushToMockCloud: syncController.manageDialogSyncProps.onPushToMockCloud,
      onRefreshRemote: syncController.manageDialogSyncProps.onRefreshRemote,
      onRemoteAdapterModeChange:
        syncController.manageDialogSyncProps.onRemoteAdapterModeChange,
      onRemoteAutoRefreshChange:
        syncController.manageDialogSyncProps.onRemoteAutoRefreshChange,
      onRenameVariant: savedViewDialogs.manageSavedViewDialogProps.onRenameVariant,
      onSetStartupVariant:
        savedViewDialogs.manageSavedViewDialogProps.onSetStartupVariant,
      onSimulateRemoteClearDrift:
        syncController.manageDialogSyncProps.onSimulateRemoteClearDrift,
      onSimulateRemoteStartupDrift:
        syncController.manageDialogSyncProps.onSimulateRemoteStartupDrift,
      onSimulateRemoteViewDrift:
        syncController.manageDialogSyncProps.onSimulateRemoteViewDrift,
    },
    worklistVariantSyncReviewDialogProps:
      reviewDialogs.worklistVariantSyncReviewDialogProps,
    renameLocalViewDialogProps: savedViewDialogs.renameLocalViewDialogProps,
    worklistVariantTransferDialogProps:
      savedViewDialogs.worklistVariantTransferDialogProps,
  };
}
