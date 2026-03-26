import {
  Button,
  getVariantSyncEntryFreshness,
  type SavedVariant,
  type VariantOption,
  type VariantSyncEntries,
  type VariantSyncReviewSection,
  type VariantSyncReviewState,
  type VariantSyncReviewWorkspaceCard,
  type VariantSyncSelection,
} from "@axiomui/react";

import {
  builtInWorklistVariantKeys,
  builtInWorklistVariantMeta,
  type WorklistVariantKey,
  type WorklistVariantPreset,
  variantPresets,
} from "../demo-data";
import { countWorkItemsForFilters } from "./worklist-state";
import {
  formatSavedVariantTimestamp,
  formatWorklistVariantCount,
  getWorklistVariantLabel,
} from "./worklist-display";

interface BuildVariantSyncWorkspaceCardsOptions {
  reviewState: VariantSyncReviewState<WorklistVariantPreset, WorklistVariantKey> | null;
  startupVariantLabel: string;
  updateWorkspaceSelection: (
    key: "orderSelection" | "startupSelection",
    value: "local" | "remote",
  ) => void;
}

export function buildVariantSyncWorkspaceCards({
  reviewState,
  startupVariantLabel,
  updateWorkspaceSelection,
}: BuildVariantSyncWorkspaceCardsOptions): VariantSyncReviewWorkspaceCard[] {
  const workspaceCards: VariantSyncReviewWorkspaceCard[] = [];

  if (!reviewState) {
    return workspaceCards;
  }

  if (reviewState.comparison.startupChanged) {
    workspaceCards.push({
      key: "startup",
      title: "Startup view",
      meta: (
        <>
          <span className="docs-filter-chip">Local: {startupVariantLabel}</span>
          <span className="docs-filter-chip">
            Remote: {getWorklistVariantLabel(
              reviewState.remoteSnapshot.startupVariantKey,
              reviewState.remoteSnapshot.variants,
            )}
          </span>
        </>
      ),
      actions: (
        <>
          <Button
            selected={reviewState.selections.startupSelection === "local"}
            variant="transparent"
            onClick={() => updateWorkspaceSelection("startupSelection", "local")}
          >
            Keep local startup
          </Button>
          <Button
            selected={reviewState.selections.startupSelection === "remote"}
            variant="transparent"
            onClick={() => updateWorkspaceSelection("startupSelection", "remote")}
          >
            Use remote startup
          </Button>
        </>
      ),
    });
  }

  if (reviewState.comparison.orderChanged) {
    workspaceCards.push({
      key: "order",
      title: "Saved view order",
      meta: (
        <>
          <span className="docs-filter-chip">Local order preserved</span>
          <span className="docs-filter-chip">Remote order available</span>
        </>
      ),
      actions: (
        <>
          <Button
            selected={reviewState.selections.orderSelection === "local"}
            variant="transparent"
            onClick={() => updateWorkspaceSelection("orderSelection", "local")}
          >
            Keep local order
          </Button>
          <Button
            selected={reviewState.selections.orderSelection === "remote"}
            variant="transparent"
            onClick={() => updateWorkspaceSelection("orderSelection", "remote")}
          >
            Use remote order
          </Button>
        </>
      ),
    });
  }

  return workspaceCards;
}

interface BuildVariantSyncSectionsOptions {
  reviewEntries: VariantSyncEntries;
  reviewState: VariantSyncReviewState<WorklistVariantPreset, WorklistVariantKey> | null;
  updateReviewSelection: (key: string, selection: VariantSyncSelection) => void;
}

export function buildVariantSyncSections({
  reviewEntries,
  reviewState,
  updateReviewSelection,
}: BuildVariantSyncSectionsOptions): VariantSyncReviewSection[] {
  const sections: VariantSyncReviewSection[] = [];

  if (reviewEntries.changed.length > 0) {
    sections.push({
      key: "changed",
      title: "Changed on both sides",
      entries: reviewEntries.changed.map((entry) => ({
        key: entry.key,
        title: entry.localLabel ?? entry.remoteLabel ?? entry.key,
        badge: (
          <span className="docs-variant-kind" data-kind="active">
            {getVariantSyncEntryFreshness(entry)}
          </span>
        ),
        meta: (
          <>
            <span className="docs-filter-chip">Local: {entry.localLabel ?? entry.key}</span>
            <span className="docs-filter-chip">Remote: {entry.remoteLabel ?? entry.key}</span>
            <span className="docs-filter-chip">
              Local updated: {entry.localUpdatedAt
                ? formatSavedVariantTimestamp(entry.localUpdatedAt)
                : "Unknown"}
            </span>
            <span className="docs-filter-chip">
              Remote updated: {entry.remoteUpdatedAt
                ? formatSavedVariantTimestamp(entry.remoteUpdatedAt)
                : "Unknown"}
            </span>
          </>
        ),
        actions: (
          <>
            <Button
              selected={reviewState?.selections.variantSelections[entry.key] === "local"}
              variant="transparent"
              onClick={() => updateReviewSelection(entry.key, "local")}
            >
              Use local
            </Button>
            <Button
              selected={reviewState?.selections.variantSelections[entry.key] === "remote"}
              variant="transparent"
              onClick={() => updateReviewSelection(entry.key, "remote")}
            >
              Use remote
            </Button>
          </>
        ),
      })),
    });
  }

  if (reviewEntries.localOnly.length > 0) {
    sections.push({
      key: "local-only",
      title: "Local-only views",
      entries: reviewEntries.localOnly.map((entry) => ({
        key: entry.key,
        title: entry.localLabel ?? entry.key,
        badge: (
          <span className="docs-variant-kind" data-kind="preset">
            Local only
          </span>
        ),
        meta: (
          <>
            <span className="docs-filter-chip">Key: {entry.key}</span>
            <span className="docs-filter-chip">
              Updated: {entry.localUpdatedAt
                ? formatSavedVariantTimestamp(entry.localUpdatedAt)
                : "Unknown"}
            </span>
          </>
        ),
        actions: (
          <>
            <Button
              selected={reviewState?.selections.variantSelections[entry.key] === "local"}
              variant="transparent"
              onClick={() => updateReviewSelection(entry.key, "local")}
            >
              Keep local
            </Button>
            <Button
              selected={reviewState?.selections.variantSelections[entry.key] === "none"}
              variant="transparent"
              onClick={() => updateReviewSelection(entry.key, "none")}
            >
              Drop local
            </Button>
          </>
        ),
      })),
    });
  }

  if (reviewEntries.remoteOnly.length > 0) {
    sections.push({
      key: "remote-only",
      title: "Remote-only views",
      entries: reviewEntries.remoteOnly.map((entry) => ({
        key: entry.key,
        title: entry.remoteLabel ?? entry.key,
        badge: (
          <span className="docs-variant-kind" data-kind="saved">
            Remote only
          </span>
        ),
        meta: (
          <>
            <span className="docs-filter-chip">Key: {entry.key}</span>
            <span className="docs-filter-chip">
              Updated: {entry.remoteUpdatedAt
                ? formatSavedVariantTimestamp(entry.remoteUpdatedAt)
                : "Unknown"}
            </span>
          </>
        ),
        actions: (
          <>
            <Button
              selected={reviewState?.selections.variantSelections[entry.key] === "remote"}
              variant="transparent"
              onClick={() => updateReviewSelection(entry.key, "remote")}
            >
              Add remote
            </Button>
            <Button
              selected={reviewState?.selections.variantSelections[entry.key] === "none"}
              variant="transparent"
              onClick={() => updateReviewSelection(entry.key, "none")}
            >
              Ignore remote
            </Button>
          </>
        ),
      })),
    });
  }

  return sections;
}

interface BuildVariantManagerOptions {
  activeVariant: WorklistVariantKey;
  activeVariantDirty: boolean;
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>;
}

export function buildVariantManagerOptions({
  activeVariant,
  activeVariantDirty,
  savedVariants,
}: BuildVariantManagerOptions): VariantOption[] {
  return [
    ...builtInWorklistVariantKeys.map((variantKey) => ({
      key: variantKey,
      label: (
        <span className="docs-variant-label">
          <span>{builtInWorklistVariantMeta[variantKey].label}</span>
          <span className="docs-variant-kind" data-kind="preset">
            Preset
          </span>
        </span>
      ),
      description: builtInWorklistVariantMeta[variantKey].description,
      count: formatWorklistVariantCount(
        countWorkItemsForFilters(variantPresets[variantKey].filters),
      ),
      modified: variantKey === activeVariant && activeVariantDirty,
    })),
    ...savedVariants.map((variant) => ({
      key: variant.key,
      label: (
        <span className="docs-variant-label">
          <span>{variant.label}</span>
          <span className="docs-variant-kind" data-kind="saved">
            Local
          </span>
        </span>
      ),
      description: variant.description ?? formatSavedVariantTimestamp(variant.updatedAt),
      count: formatWorklistVariantCount(
        countWorkItemsForFilters(variant.preset.filters),
      ),
      modified: variant.key === activeVariant && activeVariantDirty,
    })),
  ];
}
