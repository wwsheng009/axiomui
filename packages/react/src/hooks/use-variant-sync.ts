import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SavedVariant } from "./use-saved-variants";
import type { VariantPersistenceAdapter } from "../lib/variant-persistence";
import {
  buildVariantSyncEntries,
  compareVariantSnapshots,
  composeReviewedVariantSnapshot,
  createVariantSyncReviewSelections,
  createVariantSyncSnapshot,
  formatVariantSyncStatus,
  type VariantSyncComparison,
  type VariantSyncEntry,
  type VariantSyncReviewSelections,
  type VariantSyncSelection,
  type VariantSyncSnapshot,
} from "../lib/variant-sync";

export type VariantSyncDirection = "push" | "pull";
export type VariantSyncActivityKind =
  | "adapter"
  | "clear"
  | "merge"
  | "overwrite"
  | "pull"
  | "push"
  | "refresh"
  | "replace"
  | "review";
export type VariantSyncRemoteCheckTrigger =
  | "automatic"
  | "initial"
  | "manual";
export type VariantSyncActivityTone =
  | "neutral"
  | "information"
  | "success"
  | "warning"
  | "error";

export interface UseVariantSyncState {
  message?: string;
  status: "idle" | "syncing" | "pulling";
}

export interface VariantSyncActivity {
  description: string;
  id: string;
  kind: VariantSyncActivityKind;
  occurredAt: string;
  sourceLabel: string;
  title: string;
  tone: VariantSyncActivityTone;
}

export interface VariantSyncActivityPersistenceOptions {
  storage?: Pick<Storage, "getItem" | "removeItem" | "setItem"> | null;
  storageKey: string;
  version?: number;
}

export interface VariantSyncReviewState<
  TPreset,
  TVariantKey extends string = string,
> {
  comparison: VariantSyncComparison;
  direction: VariantSyncDirection;
  remoteSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>;
  selections: VariantSyncReviewSelections;
}

export interface VariantSyncEntries {
  changed: VariantSyncEntry[];
  localOnly: VariantSyncEntry[];
  remoteOnly: VariantSyncEntry[];
}

export interface VariantSyncRemoteCheckState {
  checkedAt?: string;
  errorMessage?: string;
  trigger?: VariantSyncRemoteCheckTrigger;
}

export interface UseVariantSyncOptions<
  TPreset,
  TVariantKey extends string = string,
> {
  adapter: VariantPersistenceAdapter<TPreset, TVariantKey>;
  activityPersistence?: VariantSyncActivityPersistenceOptions;
  autoRefreshIntervalMs?: number;
  comparePreset: (left: TPreset, right: TPreset) => boolean;
  fallbackStartupVariantKey: TVariantKey;
  initialRemoteSnapshot?: VariantSyncSnapshot<TPreset, TVariantKey> | null;
  isValidStartupVariantKey?: (
    candidate: string,
    variants: Array<SavedVariant<TPreset>>,
  ) => boolean;
  localSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>;
  maxActivities?: number;
  onApplyLocalSnapshot: (
    snapshot: VariantSyncSnapshot<TPreset, TVariantKey>,
  ) => void;
  sourceLabel?: string;
}

export interface UseVariantSyncResult<
  TPreset,
  TVariantKey extends string = string,
> {
  applyReviewedMerge: () => boolean;
  activities: VariantSyncActivity[];
  clearActivities: () => void;
  clearRemoteSnapshot: () => Promise<boolean>;
  closeReview: () => void;
  loadRemoteSnapshot: () => Promise<VariantSyncSnapshot<TPreset, TVariantKey> | null>;
  overwriteRemoteSnapshot: () => Promise<boolean>;
  pullSnapshot: () => Promise<void>;
  pushSnapshot: () => Promise<void>;
  refreshRemoteSnapshot: () => Promise<VariantSyncSnapshot<TPreset, TVariantKey> | null>;
  remoteCheckState: VariantSyncRemoteCheckState;
  remoteSnapshot: VariantSyncSnapshot<TPreset, TVariantKey> | null;
  replaceLocalSnapshot: () => boolean;
  reviewEntries: VariantSyncEntries;
  reviewState: VariantSyncReviewState<TPreset, TVariantKey> | null;
  syncComparison: VariantSyncComparison | undefined;
  syncState: UseVariantSyncState;
  syncStatusLabel: string;
  updateReviewSelection: (
    key: string,
    selection: VariantSyncSelection,
  ) => void;
  updateReviewWorkspaceSelection: (
    key: "orderSelection" | "startupSelection",
    value: "local" | "remote",
  ) => void;
}

const emptyVariantSyncEntries: VariantSyncEntries = {
  changed: [],
  localOnly: [],
  remoteOnly: [],
};
const variantSyncActivityKinds: VariantSyncActivityKind[] = [
  "adapter",
  "clear",
  "merge",
  "overwrite",
  "pull",
  "push",
  "refresh",
  "replace",
  "review",
];
const variantSyncActivityTones: VariantSyncActivityTone[] = [
  "neutral",
  "information",
  "success",
  "warning",
  "error",
];

interface PersistedVariantSyncActivities {
  activities: VariantSyncActivity[];
  version: number;
}

function capitalizeLabel(value: string) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

function formatViewCount(count: number) {
  return `${count} view${count === 1 ? "" : "s"}`;
}

function createRemoteReadErrorMessage(sourceLabel: string) {
  return `Unable to read ${sourceLabel} in this environment.`;
}

function areVariantSyncSnapshotsDifferent<TPreset, TVariantKey extends string = string>(
  left: VariantSyncSnapshot<TPreset, TVariantKey> | null,
  right: VariantSyncSnapshot<TPreset, TVariantKey> | null,
  comparePreset: (left: TPreset, right: TPreset) => boolean,
) {
  if (!left && !right) {
    return false;
  }

  if (!left || !right) {
    return true;
  }

  return (
    left.updatedAt !== right.updatedAt ||
    left.version !== right.version ||
    left.startupVariantKey !== right.startupVariantKey ||
    compareVariantSnapshots(left, right, comparePreset).status !== "in-sync"
  );
}

function getDefaultActivityStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    ? window.localStorage
    : null;
}

function isVariantSyncActivity(value: unknown): value is VariantSyncActivity {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VariantSyncActivity>;

  return (
    typeof candidate.description === "string" &&
    typeof candidate.id === "string" &&
    typeof candidate.kind === "string" &&
    variantSyncActivityKinds.includes(candidate.kind as VariantSyncActivityKind) &&
    typeof candidate.occurredAt === "string" &&
    typeof candidate.sourceLabel === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.tone === "string" &&
    variantSyncActivityTones.includes(candidate.tone as VariantSyncActivityTone)
  );
}

function readPersistedVariantSyncActivities(
  persistence: VariantSyncActivityPersistenceOptions | undefined,
) {
  if (!persistence?.storageKey) {
    return [];
  }

  const storage = persistence.storage ?? getDefaultActivityStorage();

  if (!storage) {
    return [];
  }

  try {
    const rawState = storage.getItem(persistence.storageKey);

    if (!rawState) {
      return [];
    }

    const parsedState = JSON.parse(rawState) as Partial<PersistedVariantSyncActivities>;

    if (
      parsedState.version !== (persistence.version ?? 1) ||
      !Array.isArray(parsedState.activities)
    ) {
      return [];
    }

    return parsedState.activities.filter(isVariantSyncActivity);
  } catch {
    return [];
  }
}

export function useVariantSync<TPreset, TVariantKey extends string = string>({
  adapter,
  activityPersistence,
  autoRefreshIntervalMs = 0,
  comparePreset,
  fallbackStartupVariantKey,
  initialRemoteSnapshot = null,
  isValidStartupVariantKey,
  localSnapshot,
  maxActivities = 10,
  onApplyLocalSnapshot,
  sourceLabel = "remote source",
}: UseVariantSyncOptions<TPreset, TVariantKey>): UseVariantSyncResult<
  TPreset,
  TVariantKey
> {
  const activityCountRef = useRef(0);
  const initialActivitiesRef = useRef<VariantSyncActivity[] | null>(null);
  const remoteSnapshotRef = useRef<VariantSyncSnapshot<TPreset, TVariantKey> | null>(
    initialRemoteSnapshot,
  );
  const reviewStateRef = useRef<VariantSyncReviewState<TPreset, TVariantKey> | null>(null);
  const syncStateRef = useRef<UseVariantSyncState>({
    status: "idle",
  });

  if (initialActivitiesRef.current === null) {
    initialActivitiesRef.current = readPersistedVariantSyncActivities(
      activityPersistence,
    );
    activityCountRef.current = initialActivitiesRef.current.length;
  }

  const [remoteSnapshot, setRemoteSnapshot] = useState<
    VariantSyncSnapshot<TPreset, TVariantKey> | null
  >(initialRemoteSnapshot);
  const [activities, setActivities] = useState<VariantSyncActivity[]>(
    initialActivitiesRef.current ?? [],
  );
  const [reviewState, setReviewState] = useState<
    VariantSyncReviewState<TPreset, TVariantKey> | null
  >(null);
  const [remoteCheckState, setRemoteCheckState] = useState<VariantSyncRemoteCheckState>(
    {},
  );
  const [syncState, setSyncState] = useState<UseVariantSyncState>({
    status: "idle",
  });
  const syncComparison = useMemo(
    () =>
      remoteSnapshot
        ? compareVariantSnapshots(localSnapshot, remoteSnapshot, comparePreset)
        : undefined,
    [comparePreset, localSnapshot, remoteSnapshot],
  );
  const syncStatusLabel = useMemo(
    () => formatVariantSyncStatus(syncComparison),
    [syncComparison],
  );
  const reviewEntries = useMemo(
    () =>
      reviewState
        ? buildVariantSyncEntries(
            localSnapshot,
            reviewState.remoteSnapshot,
            reviewState.comparison,
          )
        : emptyVariantSyncEntries,
    [localSnapshot, reviewState],
  );

  useEffect(() => {
    remoteSnapshotRef.current = remoteSnapshot;
  }, [remoteSnapshot]);

  useEffect(() => {
    reviewStateRef.current = reviewState;
  }, [reviewState]);

  useEffect(() => {
    syncStateRef.current = syncState;
  }, [syncState]);

  function applyLocalSnapshot(nextSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>) {
    startTransition(() => {
      onApplyLocalSnapshot(nextSnapshot);
    });
  }

  function appendActivity({
    description,
    kind,
    title,
    tone,
  }: Omit<VariantSyncActivity, "id" | "occurredAt" | "sourceLabel">) {
    const nextActivity: VariantSyncActivity = {
      description,
      id: `${Date.now()}-${activityCountRef.current}`,
      kind,
      occurredAt: new Date().toISOString(),
      sourceLabel,
      title,
      tone,
    };

    activityCountRef.current += 1;
    setActivities((currentActivities) => [
      nextActivity,
      ...currentActivities,
    ].slice(0, maxActivities));
  }

  useEffect(() => {
    const nextActivities = readPersistedVariantSyncActivities(activityPersistence);

    activityCountRef.current = nextActivities.length;
    setActivities(nextActivities);
  }, [
    activityPersistence?.storage,
    activityPersistence?.storageKey,
    activityPersistence?.version,
  ]);

  useEffect(() => {
    if (!activityPersistence?.storageKey) {
      return;
    }

    const storage = activityPersistence.storage ?? getDefaultActivityStorage();

    if (!storage) {
      return;
    }

    try {
      if (activities.length === 0) {
        storage.removeItem(activityPersistence.storageKey);
      } else {
        const persistedState: PersistedVariantSyncActivities = {
          activities,
          version: activityPersistence.version ?? 1,
        };

        storage.setItem(
          activityPersistence.storageKey,
          JSON.stringify(persistedState),
        );
      }
    } catch {
      // Ignore storage write issues so activity tracking stays optional.
    }
  }, [
    activities,
    activityPersistence?.storage,
    activityPersistence?.storageKey,
    activityPersistence?.version,
  ]);

  async function loadRemoteSnapshot() {
    const previousSnapshot = remoteSnapshotRef.current;

    try {
      const nextSnapshot = await adapter.readSnapshot();
      const checkedAt = new Date().toISOString();

      remoteSnapshotRef.current = nextSnapshot;
      setRemoteSnapshot(nextSnapshot);
      setRemoteCheckState({
        checkedAt,
        trigger: "manual",
      });

      return nextSnapshot;
    } catch {
      setRemoteCheckState((currentState) => ({
        checkedAt: currentState.checkedAt,
        errorMessage: createRemoteReadErrorMessage(sourceLabel),
        trigger: "manual",
      }));
      remoteSnapshotRef.current = previousSnapshot;
      throw new Error(createRemoteReadErrorMessage(sourceLabel));
    }
  }

  async function writeRemoteSnapshot(nextSnapshot: VariantSyncSnapshot<TPreset, TVariantKey>) {
    await adapter.writeSnapshot(nextSnapshot);
    remoteSnapshotRef.current = nextSnapshot;
    setRemoteSnapshot(nextSnapshot);
  }

  async function checkRemoteSnapshot({
    silentState = false,
    trigger = "manual",
  }: {
    silentState?: boolean;
    trigger?: VariantSyncRemoteCheckTrigger;
  } = {}) {
    const previousSnapshot = remoteSnapshotRef.current;

    if (!silentState) {
      setSyncState({
        status: "syncing",
        message:
          trigger === "automatic"
            ? `Watching ${sourceLabel} for remote changes...`
            : `Checking ${sourceLabel}...`,
      });
    }

    try {
      const nextSnapshot = await adapter.readSnapshot();
      const checkedAt = new Date().toISOString();

      remoteSnapshotRef.current = nextSnapshot;
      setRemoteSnapshot(nextSnapshot);
      setRemoteCheckState({
        checkedAt,
        trigger,
      });

      if (!silentState) {
        setSyncState({
          status: "idle",
          message: nextSnapshot
            ? `Checked ${sourceLabel}; ${formatViewCount(nextSnapshot.variants.length)} available.`
            : `Checked ${sourceLabel}; no remote snapshot is stored yet.`,
        });
      }

      return {
        changed: areVariantSyncSnapshotsDifferent(
          previousSnapshot,
          nextSnapshot,
          comparePreset,
        ),
        nextSnapshot,
        previousSnapshot,
      };
    } catch {
      setRemoteCheckState((currentState) => ({
        checkedAt: currentState.checkedAt,
        errorMessage: createRemoteReadErrorMessage(sourceLabel),
        trigger,
      }));

      if (!silentState) {
        setSyncState({
          status: "idle",
          message: `${capitalizeLabel(sourceLabel)} refresh failed in this environment.`,
        });
      }

      return null;
    }
  }

  useEffect(() => {
    let cancelled = false;

    setRemoteSnapshot(null);
    remoteSnapshotRef.current = null;
    setRemoteCheckState({});
    setReviewState(null);
    setSyncState({
      status: "idle",
    });

    void checkRemoteSnapshot({
      silentState: true,
      trigger: "initial",
    }).then((result) => {
      if (!cancelled && result) {
        const { nextSnapshot } = result;

          appendActivity({
            description: nextSnapshot
              ? `Loaded ${formatViewCount(nextSnapshot.variants.length)} from ${sourceLabel}.`
              : `No remote snapshot is stored in ${sourceLabel} yet.`,
            kind: "adapter",
            title: `Connected to ${capitalizeLabel(sourceLabel)}`,
            tone: nextSnapshot ? "information" : "neutral",
          });
      }

      if (!cancelled && !result) {
          setSyncState({
            status: "idle",
            message: `${capitalizeLabel(sourceLabel)} could not be checked automatically in this environment.`,
          });
          appendActivity({
            description: `Automatic connection check for ${sourceLabel} failed.`,
            kind: "adapter",
            title: `Initial check failed for ${capitalizeLabel(sourceLabel)}`,
            tone: "error",
          });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [adapter]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !autoRefreshIntervalMs ||
      autoRefreshIntervalMs < 1000
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (
        syncStateRef.current.status !== "idle" ||
        reviewStateRef.current
      ) {
        return;
      }

      void checkRemoteSnapshot({
        silentState: true,
        trigger: "automatic",
      }).then((result) => {
        if (!result?.changed) {
          return;
        }

        appendActivity({
          description: result.nextSnapshot
            ? `Automatic watch detected ${formatViewCount(result.nextSnapshot.variants.length)} in ${sourceLabel}.`
            : `Automatic watch detected that ${sourceLabel} no longer has a remote snapshot.`,
          kind: "refresh",
          title: "Remote change detected",
          tone: "information",
        });
      });
    }, autoRefreshIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [adapter, autoRefreshIntervalMs, comparePreset, sourceLabel]);

  function closeReview() {
    setReviewState(null);
  }

  function clearActivities() {
    activityCountRef.current = 0;
    setActivities([]);
    setSyncState({
      message: `Cleared sync activity history for ${sourceLabel}.`,
      status: "idle",
    });
  }

  async function refreshRemoteSnapshot() {
    const result = await checkRemoteSnapshot({
      trigger: "manual",
    });

    if (result) {
      appendActivity({
        description: result.nextSnapshot
          ? `Checked ${sourceLabel} and found ${formatViewCount(result.nextSnapshot.variants.length)}.`
          : `Checked ${sourceLabel} and confirmed there is no remote snapshot yet.`,
        kind: "refresh",
        title: "Remote snapshot refreshed",
        tone: result.nextSnapshot ? "information" : "neutral",
      });

      return result.nextSnapshot;
    }

    appendActivity({
      description: `Checking ${sourceLabel} failed.`,
      kind: "refresh",
      title: "Remote refresh failed",
      tone: "error",
    });

    return null;
  }

  async function clearRemoteSnapshot() {
    if (!adapter.clearSnapshot) {
      setSyncState({
        status: "idle",
        message: `${capitalizeLabel(sourceLabel)} clear is not supported by this adapter.`,
      });
      appendActivity({
        description: `The active adapter does not support clearing ${sourceLabel}.`,
        kind: "clear",
        title: "Remote clear unavailable",
        tone: "warning",
      });
      return false;
    }

    setSyncState({
      status: "syncing",
      message: `Clearing ${sourceLabel} snapshot...`,
    });

    try {
      await adapter.clearSnapshot();
      remoteSnapshotRef.current = null;
      setRemoteSnapshot(null);
      setReviewState(null);
      setSyncState({
        status: "idle",
        message: `${capitalizeLabel(sourceLabel)} snapshot cleared.`,
      });
      appendActivity({
        description: `Cleared the remote snapshot stored in ${sourceLabel}.`,
        kind: "clear",
        title: "Remote snapshot cleared",
        tone: "success",
      });
      return true;
    } catch {
      setSyncState({
        status: "idle",
        message: `${capitalizeLabel(sourceLabel)} clear failed in this environment, so remote state stayed unchanged.`,
      });
      appendActivity({
        description: `Clearing the remote snapshot in ${sourceLabel} failed.`,
        kind: "clear",
        title: "Remote clear failed",
        tone: "error",
      });
      return false;
    }
  }

  function updateReviewSelection(key: string, selection: VariantSyncSelection) {
    setReviewState((currentState) =>
      currentState
        ? {
            ...currentState,
            selections: {
              ...currentState.selections,
              variantSelections: {
                ...currentState.selections.variantSelections,
                [key]: selection,
              },
            },
          }
        : currentState,
    );
  }

  function updateReviewWorkspaceSelection(
    key: "orderSelection" | "startupSelection",
    value: "local" | "remote",
  ) {
    setReviewState((currentState) =>
      currentState
        ? {
            ...currentState,
            selections: {
              ...currentState.selections,
              [key]: value,
            },
          }
        : currentState,
    );
  }

  function applyReviewedMerge() {
    if (!reviewState) {
      return false;
    }

    const mergedSnapshot = composeReviewedVariantSnapshot({
      fallbackStartupVariantKey,
      isValidStartupVariantKey,
      localSnapshot,
      remoteSnapshot: reviewState.remoteSnapshot,
      selections: reviewState.selections,
      version: localSnapshot.version,
    });

    applyLocalSnapshot(mergedSnapshot);
    setRemoteSnapshot(reviewState.remoteSnapshot);
    setSyncState({
      status: "idle",
      message: `Applied the reviewed merge locally. Push if you want ${sourceLabel} to adopt the merged result.`,
    });
    setReviewState(null);
    appendActivity({
      description: `Applied a reviewed merge locally while keeping ${sourceLabel} as the comparison source.`,
      kind: "merge",
      title: "Reviewed merge applied",
      tone: "information",
    });

    return true;
  }

  async function pushSnapshot() {
    setSyncState({
      status: "syncing",
      message: `Pushing local views to ${sourceLabel}...`,
    });

    try {
      const latestRemoteSnapshot = await loadRemoteSnapshot();

      if (latestRemoteSnapshot) {
        const comparison = compareVariantSnapshots(
          localSnapshot,
          latestRemoteSnapshot,
          comparePreset,
        );

        if (comparison.status === "in-sync") {
          setSyncState({
            status: "idle",
            message: `Local views already match the ${sourceLabel} snapshot.`,
          });
          appendActivity({
            description: `Push skipped because local views already match ${sourceLabel}.`,
            kind: "push",
            title: "Remote already in sync",
            tone: "information",
          });
          return;
        }

        if (comparison.status !== "local-only") {
          setReviewState({
            comparison,
            direction: "push",
            remoteSnapshot: latestRemoteSnapshot,
            selections: createVariantSyncReviewSelections(comparison),
          });
          setSyncState({
            status: "idle",
            message: `Remote differences need review before overwriting the ${sourceLabel} snapshot.`,
          });
          appendActivity({
            description: `Push opened a review because ${sourceLabel} contains conflicting differences.`,
            kind: "review",
            title: "Review needed before push",
            tone: "warning",
          });
          return;
        }
      }

      const nextSnapshot = createVariantSyncSnapshot({
        startupVariantKey: localSnapshot.startupVariantKey,
        updatedAt: new Date().toISOString(),
        variants: localSnapshot.variants,
        version: localSnapshot.version,
      });

      await writeRemoteSnapshot(nextSnapshot);
      setReviewState(null);
      setSyncState({
        status: "idle",
        message: `${capitalizeLabel(sourceLabel)} updated with ${formatViewCount(localSnapshot.variants.length)}.`,
      });
      appendActivity({
        description: `Pushed ${formatViewCount(localSnapshot.variants.length)} to ${sourceLabel}.`,
        kind: "push",
        title: "Remote snapshot updated",
        tone: "success",
      });
    } catch {
      setSyncState({
        status: "idle",
        message: `${capitalizeLabel(sourceLabel)} push failed in this environment, so local views stayed unchanged.`,
      });
      appendActivity({
        description: `Pushing local views to ${sourceLabel} failed.`,
        kind: "push",
        title: "Push failed",
        tone: "error",
      });
    }
  }

  async function pullSnapshot() {
    setSyncState({
      status: "pulling",
      message: `Pulling saved views from ${sourceLabel}...`,
    });

    try {
      const nextSnapshot = await loadRemoteSnapshot();

      if (!nextSnapshot) {
        setSyncState({
          status: "idle",
          message: `There is no ${sourceLabel} snapshot yet. Push local views first.`,
        });
        appendActivity({
          description: `Pull skipped because ${sourceLabel} does not have a stored snapshot yet.`,
          kind: "pull",
          title: "No remote snapshot",
          tone: "neutral",
        });
        return;
      }

      const comparison = compareVariantSnapshots(
        localSnapshot,
        nextSnapshot,
        comparePreset,
      );

      if (comparison.status === "in-sync") {
        setSyncState({
          status: "idle",
          message: `Local views already match the ${sourceLabel} snapshot.`,
        });
        appendActivity({
          description: `Pull skipped because local views already match ${sourceLabel}.`,
          kind: "pull",
          title: "Local already in sync",
          tone: "information",
        });
        return;
      }

      if (comparison.status !== "remote-only") {
        setReviewState({
          comparison,
          direction: "pull",
          remoteSnapshot: nextSnapshot,
          selections: createVariantSyncReviewSelections(comparison),
        });
        setSyncState({
          status: "idle",
          message: `Local differences need review before replacing views from ${sourceLabel}.`,
        });
        appendActivity({
          description: `Pull opened a review because local views conflict with ${sourceLabel}.`,
          kind: "review",
          title: "Review needed before pull",
          tone: "warning",
        });
        return;
      }

      applyLocalSnapshot(nextSnapshot);
      setReviewState(null);
      setSyncState({
        status: "idle",
        message: `Pulled ${formatViewCount(nextSnapshot.variants.length)} from ${sourceLabel}.`,
      });
      appendActivity({
        description: `Pulled ${formatViewCount(nextSnapshot.variants.length)} from ${sourceLabel}.`,
        kind: "pull",
        title: "Remote snapshot pulled",
        tone: "success",
      });
    } catch {
      setSyncState({
        status: "idle",
        message: `${capitalizeLabel(sourceLabel)} pull failed in this environment, so local views stayed unchanged.`,
      });
      appendActivity({
        description: `Pulling saved views from ${sourceLabel} failed.`,
        kind: "pull",
        title: "Pull failed",
        tone: "error",
      });
    }
  }

  async function overwriteRemoteSnapshot() {
    if (!reviewState) {
      return false;
    }

    setSyncState({
      status: "syncing",
      message: `Overwriting ${sourceLabel} with local views...`,
    });

    try {
      const nextSnapshot = createVariantSyncSnapshot({
        startupVariantKey: localSnapshot.startupVariantKey,
        updatedAt: new Date().toISOString(),
        variants: localSnapshot.variants,
        version: localSnapshot.version,
      });

      await writeRemoteSnapshot(nextSnapshot);
      setReviewState(null);
      setSyncState({
        status: "idle",
        message:
          `${capitalizeLabel(sourceLabel)} snapshot was overwritten with the current local views after sync review.`,
      });
      appendActivity({
        description: `Overwrote ${sourceLabel} with the current local views after review.`,
        kind: "overwrite",
        title: "Remote snapshot overwritten",
        tone: "warning",
      });

      return true;
    } catch {
      setSyncState({
        status: "idle",
        message: `${capitalizeLabel(sourceLabel)} overwrite failed in this environment, so local views stayed unchanged.`,
      });
      appendActivity({
        description: `Overwriting ${sourceLabel} after review failed.`,
        kind: "overwrite",
        title: "Remote overwrite failed",
        tone: "error",
      });

      return false;
    }
  }

  function replaceLocalSnapshot() {
    if (!reviewState) {
      return false;
    }

    const nextSnapshot = reviewState.remoteSnapshot;

    applyLocalSnapshot(nextSnapshot);
    remoteSnapshotRef.current = nextSnapshot;
    setRemoteSnapshot(nextSnapshot);
    setReviewState(null);
    setSyncState({
      status: "idle",
      message: `Replaced local views with ${formatViewCount(nextSnapshot.variants.length)} after sync review.`,
    });
    appendActivity({
      description: `Replaced local views with ${formatViewCount(nextSnapshot.variants.length)} from ${sourceLabel}.`,
      kind: "replace",
      title: "Local snapshot replaced",
      tone: "warning",
    });

    return true;
  }

  return {
    applyReviewedMerge,
    activities,
    clearActivities,
    clearRemoteSnapshot,
    closeReview,
    loadRemoteSnapshot,
    overwriteRemoteSnapshot,
    pullSnapshot,
    pushSnapshot,
    refreshRemoteSnapshot,
    remoteCheckState,
    remoteSnapshot,
    replaceLocalSnapshot,
    reviewEntries,
    reviewState,
    syncComparison,
    syncState,
    syncStatusLabel,
    updateReviewSelection,
    updateReviewWorkspaceSelection,
  };
}
