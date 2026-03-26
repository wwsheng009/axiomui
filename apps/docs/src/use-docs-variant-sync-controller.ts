import { useEffect, useState } from "react";

import {
  createVariantSyncSnapshot,
  useVariantSync,
  type SavedVariant,
} from "@axiomui/react";

import {
  remoteAutoRefreshOptions,
  type MockRemoteVariantSnapshot,
  type RemoteAdapterMode,
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
  worklistSavedVariantsVersion,
  worklistSyncActivityStorageKeys,
  worklistSyncActivityVersion,
} from "./demo-data";
import {
  mockRemoteMemoryVariantAdapter,
  mockRemoteSessionVariantAdapter,
  mockRemoteVariantAdapter,
  remoteAdapterLabels,
} from "./worklist-advanced/worklist-persistence";
import {
  areWorklistVariantPresetsEqual,
  buildWorklistVariantMap,
  cloneFilters,
  cloneWorklistVariantPreset,
  createWorklistVariantPreset,
  isWorklistVariantKey,
} from "./worklist-advanced/worklist-state";
import {
  buildVariantSyncSections,
  buildVariantSyncWorkspaceCards,
} from "./worklist-advanced/worklist-variant-view-models";

interface UseDocsVariantSyncControllerOptions {
  activeGroupBy: WorklistGroupKey | undefined;
  activeVariant: WorklistVariantKey;
  applyVariantSelection: (variantKey: WorklistVariantKey) => void;
  currentVariantPreset: WorklistVariantPreset;
  replaceSavedWorklistVariants: (
    variants: Array<SavedVariant<WorklistVariantPreset>>,
  ) => void;
  savedWorklistVariants: Array<SavedVariant<WorklistVariantPreset>>;
  setStartupVariantKey: (variantKey: WorklistVariantKey) => void;
  startupVariantKey: WorklistVariantKey;
  startupVariantLabel: string;
  worklistVariants: Record<WorklistVariantKey, WorklistVariantPreset>;
}

export function useDocsVariantSyncController({
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
}: UseDocsVariantSyncControllerOptions) {
  const [remoteAdapterMode, setRemoteAdapterMode] =
    useState<RemoteAdapterMode>("local-storage");
  const [remoteAutoRefreshMs, setRemoteAutoRefreshMs] = useState(0);
  const [remoteDriftNotice, setRemoteDriftNotice] = useState<string | undefined>(
    undefined,
  );
  const [pendingVariantSelection, setPendingVariantSelection] = useState<
    string | undefined
  >(undefined);
  const localVariantSnapshot = createVariantSyncSnapshot({
    startupVariantKey,
    variants: savedWorklistVariants,
    version: worklistSavedVariantsVersion,
  });
  const activeRemoteAdapterLabel = remoteAdapterLabels[remoteAdapterMode];
  const activeSyncActivityStorageKey =
    worklistSyncActivityStorageKeys[remoteAdapterMode];
  const activeMockRemoteAdapter =
    remoteAdapterMode === "session-storage"
      ? mockRemoteSessionVariantAdapter
      : remoteAdapterMode === "memory"
        ? mockRemoteMemoryVariantAdapter
        : mockRemoteVariantAdapter;

  function applyLocalVariantSnapshot(nextSnapshot: MockRemoteVariantSnapshot) {
    const nextVariantMap = buildWorklistVariantMap(nextSnapshot.variants);
    const nextStartupVariantKey = isWorklistVariantKey(
      nextSnapshot.startupVariantKey,
      nextVariantMap,
    )
      ? nextSnapshot.startupVariantKey
      : "standard";
    const nextActiveVariantKey = isWorklistVariantKey(activeVariant, nextVariantMap)
      ? activeVariant
      : nextStartupVariantKey;

    replaceSavedWorklistVariants(nextSnapshot.variants);
    setStartupVariantKey(nextStartupVariantKey);
    setPendingVariantSelection(nextActiveVariantKey);
  }

  const {
    activities: variantSyncActivities,
    applyReviewedMerge: applyVariantSyncReviewedMerge,
    clearActivities: clearVariantSyncActivities,
    clearRemoteSnapshot: clearVariantSyncRemoteSnapshot,
    closeReview: closeVariantSyncReview,
    overwriteRemoteSnapshot: overwriteVariantSyncRemoteSnapshot,
    pullSnapshot: pullSavedVariantsFromMockCloud,
    pushSnapshot: pushSavedVariantsToMockCloud,
    refreshRemoteSnapshot: refreshSavedVariantsFromMockCloud,
    remoteCheckState: variantSyncRemoteCheckState,
    remoteSnapshot: remoteVariantSnapshot,
    replaceLocalSnapshot: replaceVariantSyncLocalSnapshot,
    reviewEntries: variantSyncEntries,
    reviewState: variantSyncReviewState,
    syncState: variantSyncState,
    syncStatusLabel: remoteSyncStatusLabel,
    updateReviewSelection: updateVariantSyncReviewSelection,
    updateReviewWorkspaceSelection: updateVariantSyncReviewWorkspaceSelection,
  } = useVariantSync<WorklistVariantPreset, WorklistVariantKey>({
    adapter: activeMockRemoteAdapter,
    activityPersistence: {
      storageKey: activeSyncActivityStorageKey,
      version: worklistSyncActivityVersion,
    },
    autoRefreshIntervalMs: remoteAutoRefreshMs,
    comparePreset: areWorklistVariantPresetsEqual,
    fallbackStartupVariantKey: "standard",
    isValidStartupVariantKey: (candidate, variants) =>
      isWorklistVariantKey(candidate, buildWorklistVariantMap(variants)),
    localSnapshot: localVariantSnapshot,
    onApplyLocalSnapshot: applyLocalVariantSnapshot,
    sourceLabel: activeRemoteAdapterLabel,
  });
  const activeVariantSyncActivities = variantSyncActivities.filter(
    (activity) => activity.sourceLabel === activeRemoteAdapterLabel,
  );

  function cloneRemoteSnapshotVariant(variant: SavedVariant<WorklistVariantPreset>) {
    return {
      ...variant,
      preset: cloneWorklistVariantPreset(variant.preset),
    };
  }

  function createRemoteDriftVariant(index: number) {
    const timestamp = new Date().toISOString();
    const driftPreset = createWorklistVariantPreset({
      filters: {
        ...cloneFilters(currentVariantPreset.filters),
        priority:
          currentVariantPreset.filters.priority === "Attention"
            ? "Information"
            : "Attention",
      },
      groupBy: activeGroupBy ?? "priority",
      pageSize: currentVariantPreset.pageSize ?? 3,
      sort: currentVariantPreset.sort ?? { columnId: "priority", direction: "desc" },
    });

    return {
      createdAt: timestamp,
      description: "Simulated remote-only change used to validate watch and refresh flows.",
      key: `remote-drift-${timestamp.replace(/\D/g, "")}-${index + 1}`,
      label: `Remote drift ${index + 1}`,
      preset: driftPreset,
      updatedAt: timestamp,
    } satisfies SavedVariant<WorklistVariantPreset>;
  }

  async function simulateRemoteViewDrift() {
    try {
      const baseSnapshot =
        (await activeMockRemoteAdapter.readSnapshot()) ?? localVariantSnapshot;
      const nextVariants = [
        ...baseSnapshot.variants.map(cloneRemoteSnapshotVariant),
        createRemoteDriftVariant(baseSnapshot.variants.length),
      ];
      const nextVariantMap = buildWorklistVariantMap(nextVariants);
      const nextStartupVariantKey = isWorklistVariantKey(
        baseSnapshot.startupVariantKey,
        nextVariantMap,
      )
        ? baseSnapshot.startupVariantKey
        : nextVariants[0]?.key ?? "standard";

      await activeMockRemoteAdapter.writeSnapshot(
        createVariantSyncSnapshot({
          startupVariantKey: nextStartupVariantKey,
          updatedAt: new Date().toISOString(),
          variants: nextVariants,
          version: baseSnapshot.version,
        }),
      );
      setRemoteDriftNotice(
        `Simulated a remote-only view in ${activeRemoteAdapterLabel}. Use Refresh remote or Watch to detect the drift.`,
      );
    } catch {
      setRemoteDriftNotice(
        `Remote drift simulation failed for ${activeRemoteAdapterLabel}.`,
      );
    }
  }

  async function simulateRemoteStartupDrift() {
    try {
      const baseSnapshot =
        (await activeMockRemoteAdapter.readSnapshot()) ?? localVariantSnapshot;
      const nextVariants =
        baseSnapshot.variants.length > 0
          ? baseSnapshot.variants.map(cloneRemoteSnapshotVariant)
          : [createRemoteDriftVariant(0)];
      const currentStartupVariantKey = baseSnapshot.startupVariantKey;
      const nextStartupVariantKey =
        nextVariants.find((variant) => variant.key !== currentStartupVariantKey)?.key ??
        nextVariants[0]?.key ??
        "standard";

      await activeMockRemoteAdapter.writeSnapshot(
        createVariantSyncSnapshot({
          startupVariantKey: nextStartupVariantKey,
          updatedAt: new Date().toISOString(),
          variants: nextVariants,
          version: baseSnapshot.version,
        }),
      );
      setRemoteDriftNotice(
        `Simulated a remote startup switch in ${activeRemoteAdapterLabel}. Refresh or Watch will surface the change.`,
      );
    } catch {
      setRemoteDriftNotice(
        `Remote startup drift simulation failed for ${activeRemoteAdapterLabel}.`,
      );
    }
  }

  async function simulateRemoteClearDrift() {
    try {
      if (activeMockRemoteAdapter.clearSnapshot) {
        await activeMockRemoteAdapter.clearSnapshot();
      } else {
        await activeMockRemoteAdapter.writeSnapshot(
          createVariantSyncSnapshot({
            startupVariantKey: "standard",
            updatedAt: new Date().toISOString(),
            variants: [],
            version: worklistSavedVariantsVersion,
          }),
        );
      }

      setRemoteDriftNotice(
        `Simulated a remote snapshot clear in ${activeRemoteAdapterLabel}. Refresh remote or Watch to detect the reset.`,
      );
    } catch {
      setRemoteDriftNotice(
        `Remote clear simulation failed for ${activeRemoteAdapterLabel}.`,
      );
    }
  }

  useEffect(() => {
    if (!pendingVariantSelection) {
      return;
    }

    if (!(pendingVariantSelection in worklistVariants)) {
      return;
    }

    applyVariantSelection(pendingVariantSelection as WorklistVariantKey);
    setPendingVariantSelection(undefined);
  }, [applyVariantSelection, pendingVariantSelection, worklistVariants]);

  useEffect(() => {
    setRemoteDriftNotice(undefined);
  }, [remoteAdapterMode, variantSyncRemoteCheckState.checkedAt]);

  const variantSyncWorkspaceCards = buildVariantSyncWorkspaceCards({
    reviewState: variantSyncReviewState,
    startupVariantLabel,
    updateWorkspaceSelection: updateVariantSyncReviewWorkspaceSelection,
  });
  const variantSyncSections = buildVariantSyncSections({
    reviewEntries: variantSyncEntries,
    reviewState: variantSyncReviewState,
    updateReviewSelection: updateVariantSyncReviewSelection,
  });

  return {
    activeRemoteAdapterLabel,
    activeVariantSyncActivities,
    localVariantSnapshot,
    manageDialogSyncProps: {
      remoteAdapterMode,
      remoteAutoRefreshMs,
      remoteAutoRefreshOptions,
      remoteCheckState: variantSyncRemoteCheckState,
      remoteDriftNotice,
      remoteSnapshot: remoteVariantSnapshot,
      syncState: variantSyncState,
      syncStatusLabel: remoteSyncStatusLabel,
      onClearHistory: clearVariantSyncActivities,
      onClearRemote: () => {
        void clearVariantSyncRemoteSnapshot();
      },
      onPullFromMockCloud: pullSavedVariantsFromMockCloud,
      onPushToMockCloud: pushSavedVariantsToMockCloud,
      onRefreshRemote: refreshSavedVariantsFromMockCloud,
      onRemoteAdapterModeChange: setRemoteAdapterMode,
      onRemoteAutoRefreshChange: setRemoteAutoRefreshMs,
      onSimulateRemoteClearDrift: () => {
        void simulateRemoteClearDrift();
      },
      onSimulateRemoteStartupDrift: () => {
        void simulateRemoteStartupDrift();
      },
      onSimulateRemoteViewDrift: () => {
        void simulateRemoteViewDrift();
      },
    },
    reviewState: variantSyncReviewState,
    reviewDialogProps: {
      localSnapshot: localVariantSnapshot,
      reviewSections: variantSyncSections,
      reviewState: variantSyncReviewState,
      startupVariantLabel,
      workspaceCards: variantSyncWorkspaceCards,
      onApplyMerge: applyVariantSyncReviewedMerge,
      onClose: closeVariantSyncReview,
      onOverwriteRemote: overwriteVariantSyncRemoteSnapshot,
      onReplaceLocal: replaceVariantSyncLocalSnapshot,
    },
  };
}
