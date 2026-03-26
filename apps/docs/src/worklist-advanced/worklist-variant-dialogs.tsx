import {
  Button,
  Dialog,
  FormField,
  FormGrid,
  Input,
  VariantSyncActivityList,
  VariantSyncComparisonSummary,
  VariantSyncDialog,
  VariantSyncPanel,
  VariantSyncSnapshotList,
  type SavedVariant,
  type UseVariantSyncState,
  type VariantSyncActivity,
  type VariantSyncRemoteCheckState,
  type VariantSyncReviewSection,
  type VariantSyncReviewState,
  type VariantSyncReviewWorkspaceCard,
  type VariantSyncSnapshot,
} from "@axiomui/react";

import {
  type MockRemoteVariantSnapshot,
  type RemoteAdapterMode,
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "../demo-data";
import { countWorkItemsForFilters } from "./worklist-state";
import {
  formatRemoteCheckTimestamp,
  formatRemoteCheckTrigger,
  formatRemoteSnapshotLabel,
  formatRemoteWatchLabel,
  formatSavedVariantTimestamp,
  formatWorklistOwnersLabel,
  formatWorklistVariantCount,
  getWorklistGroupLabel,
  getWorklistSortLabel,
  getWorklistVariantLabel,
} from "./worklist-display";

interface VariantFormValue {
  description: string;
  label: string;
}

interface VariantRenameValue extends VariantFormValue {
  key?: string;
}

interface VariantTransferValue {
  error?: string;
  mode: "export" | "import";
  value: string;
}

interface SaveWorklistViewDialogProps {
  activeGroupBy: WorklistGroupKey | undefined;
  activeSavedVariant: SavedVariant<WorklistVariantPreset> | undefined;
  canSaveVariant: boolean;
  currentVariantPreset: WorklistVariantPreset;
  onClose: () => void;
  onDescriptionChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onSaveCreate: () => void;
  onSaveUpdate: () => void;
  open: boolean;
  value: VariantFormValue;
}

export function SaveWorklistViewDialog({
  activeGroupBy,
  activeSavedVariant,
  canSaveVariant,
  currentVariantPreset,
  onClose,
  onDescriptionChange,
  onLabelChange,
  onSaveCreate,
  onSaveUpdate,
  open,
  value,
}: SaveWorklistViewDialogProps) {
  return (
    <Dialog
      actions={
        <>
          <Button variant="transparent" onClick={onClose}>
            Cancel
          </Button>
          {activeSavedVariant ? (
            <Button disabled={!canSaveVariant} variant="default" onClick={onSaveUpdate}>
              Update current
            </Button>
          ) : null}
          <Button disabled={!canSaveVariant} variant="emphasized" onClick={onSaveCreate}>
            {activeSavedVariant ? "Save as new" : "Save view"}
          </Button>
        </>
      }
      closeOnOverlayClick
      description="Capture the current filter, column, sort, group and page-size state as a local worklist view."
      footerStart={
        <span className="docs-dialog-note">
          {activeSavedVariant
            ? "Updating keeps this saved view selected and refreshes its stored snapshot."
            : "Saved views stay in localStorage for this browser so refreshes keep the same workbench setup."}
        </span>
      }
      onClose={onClose}
      open={open}
      size="md"
      title="Save worklist view"
      tone="information"
    >
      <FormGrid columns={2}>
        <FormField
          description="Shown in the variant strip above the filter bar."
          htmlFor="variant-name"
          label="View name"
          required
        >
          <Input
            id="variant-name"
            message={!canSaveVariant ? "A saved view needs a name." : undefined}
            value={value.label}
            valueState={!canSaveVariant ? "error" : "none"}
            onChange={(event) => onLabelChange(event.target.value)}
          />
        </FormField>

        <FormField
          description="Optional context for the saved queue or review mode."
          htmlFor="variant-description"
          label="Description"
        >
          <Input
            id="variant-description"
            placeholder="Compact handoff, release queue, morning review..."
            value={value.description}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </FormField>

        <FormField
          description="This snapshot is taken from the current draft filter state and active table personalization."
          hint="Selecting the saved view later will restore these settings together."
          htmlFor="variant-snapshot"
          label="Snapshot"
          span={2}
        >
          <div className="docs-variant-snapshot" id="variant-snapshot">
            <span className="docs-filter-chip">
              Search: {currentVariantPreset.filters.search || "All"}
            </span>
            <span className="docs-filter-chip">
              Owners: {formatWorklistOwnersLabel(currentVariantPreset.filters.owners)}
            </span>
            <span className="docs-filter-chip">
              Priority: {currentVariantPreset.filters.priority || "All"}
            </span>
            <span className="docs-filter-chip">
              Columns: {currentVariantPreset.filters.visibleColumnIds.length}
            </span>
            <span className="docs-filter-chip">
              Sort: {currentVariantPreset.sort
                ? `${getWorklistSortLabel(currentVariantPreset.sort)} ${currentVariantPreset.sort.direction}`
                : "None"}
            </span>
            <span className="docs-filter-chip">
              Group: {getWorklistGroupLabel(activeGroupBy)}
            </span>
            <span className="docs-filter-chip">
              Page size: {currentVariantPreset.pageSize ?? 3}
            </span>
          </div>
        </FormField>
      </FormGrid>
    </Dialog>
  );
}

interface ManageLocalViewsDialogProps {
  activeRemoteAdapterLabel: string;
  activeVariant: WorklistVariantKey;
  activeVariantSyncActivities: VariantSyncActivity[];
  canSync: boolean;
  localSnapshot: VariantSyncSnapshot<WorklistVariantPreset, WorklistVariantKey>;
  onApplyVariant: (variantKey: WorklistVariantKey) => void;
  onClearHistory: () => void;
  onClearRemote: () => void;
  onClose: () => void;
  onDeleteVariant: (variantKey: WorklistVariantKey) => void;
  onDuplicateVariant: (variant: SavedVariant<WorklistVariantPreset>) => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onPullFromMockCloud: () => void;
  onPushToMockCloud: () => void;
  onRefreshRemote: () => void;
  onRemoteAdapterModeChange: (mode: RemoteAdapterMode) => void;
  onRemoteAutoRefreshChange: (intervalMs: number) => void;
  onRenameVariant: (variant: SavedVariant<WorklistVariantPreset>) => void;
  onSetStartupVariant: (variantKey: WorklistVariantKey) => void;
  onSimulateRemoteClearDrift: () => void;
  onSimulateRemoteStartupDrift: () => void;
  onSimulateRemoteViewDrift: () => void;
  onMoveVariant: (variantKey: WorklistVariantKey, direction: -1 | 1) => void;
  open: boolean;
  remoteAdapterMode: RemoteAdapterMode;
  remoteAutoRefreshMs: number;
  remoteAutoRefreshOptions: number[];
  remoteCheckState: VariantSyncRemoteCheckState;
  remoteDriftNotice?: string;
  remoteSnapshot: MockRemoteVariantSnapshot | null;
  reviewState: VariantSyncReviewState<WorklistVariantPreset, WorklistVariantKey> | null;
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>;
  startupVariantKey: WorklistVariantKey;
  startupVariantLabel: string;
  syncState: UseVariantSyncState;
  syncStatusLabel: string;
}

export function ManageLocalViewsDialog({
  activeRemoteAdapterLabel,
  activeVariant,
  activeVariantSyncActivities,
  canSync,
  localSnapshot,
  onApplyVariant,
  onClearHistory,
  onClearRemote,
  onClose,
  onDeleteVariant,
  onDuplicateVariant,
  onMoveVariant,
  onOpenExport,
  onOpenImport,
  onPullFromMockCloud,
  onPushToMockCloud,
  onRefreshRemote,
  onRemoteAdapterModeChange,
  onRemoteAutoRefreshChange,
  onRenameVariant,
  onSetStartupVariant,
  onSimulateRemoteClearDrift,
  onSimulateRemoteStartupDrift,
  onSimulateRemoteViewDrift,
  open,
  remoteAdapterMode,
  remoteAutoRefreshMs,
  remoteAutoRefreshOptions,
  remoteCheckState,
  remoteDriftNotice,
  remoteSnapshot,
  reviewState,
  savedVariants,
  startupVariantKey,
  startupVariantLabel,
  syncState,
  syncStatusLabel,
}: ManageLocalViewsDialogProps) {
  return (
    <Dialog
      actions={
        <>
          <Button variant="transparent" onClick={onOpenExport}>
            Export JSON
          </Button>
          <Button variant="default" onClick={onOpenImport}>
            Import JSON
          </Button>
          <Button variant="emphasized" onClick={onClose}>
            Close
          </Button>
        </>
      }
      closeOnOverlayClick
      description="Saved views are stored locally in this browser and can be re-applied or removed without touching the built-in presets."
      footerStart={
        <span className="docs-dialog-note">
          Built-in presets stay fixed. Local views capture your current worklist setup, and the startup view currently points to {startupVariantLabel}.
        </span>
      }
      onClose={onClose}
      open={open}
      size="lg"
      title="Manage local views"
      tone="information"
    >
      <VariantSyncPanel
        actions={
          <>
            <Button
              selected={remoteAdapterMode === "local-storage"}
              variant="transparent"
              onClick={() => onRemoteAdapterModeChange("local-storage")}
            >
              localStorage
            </Button>
            <Button
              selected={remoteAdapterMode === "session-storage"}
              variant="transparent"
              onClick={() => onRemoteAdapterModeChange("session-storage")}
            >
              sessionStorage
            </Button>
            <Button
              selected={remoteAdapterMode === "memory"}
              variant="transparent"
              onClick={() => onRemoteAdapterModeChange("memory")}
            >
              Memory
            </Button>
            {remoteAutoRefreshOptions.map((intervalMs) => (
              <Button
                key={intervalMs}
                selected={remoteAutoRefreshMs === intervalMs}
                variant="transparent"
                onClick={() => onRemoteAutoRefreshChange(intervalMs)}
              >
                Watch {formatRemoteWatchLabel(intervalMs)}
              </Button>
            ))}
            <Button disabled={!canSync} variant="transparent" onClick={onSimulateRemoteViewDrift}>
              Drift view
            </Button>
            <Button
              disabled={!canSync}
              variant="transparent"
              onClick={onSimulateRemoteStartupDrift}
            >
              Drift startup
            </Button>
            <Button
              disabled={!canSync}
              variant="transparent"
              onClick={onSimulateRemoteClearDrift}
            >
              Drift clear
            </Button>
            <Button disabled={!canSync} variant="default" onClick={onPushToMockCloud}>
              Push to mock cloud
            </Button>
            <Button disabled={!canSync} variant="transparent" onClick={onRefreshRemote}>
              Refresh remote
            </Button>
            <Button disabled={!canSync} variant="transparent" onClick={onClearRemote}>
              Clear remote
            </Button>
            <Button disabled={!canSync} variant="transparent" onClick={onClearHistory}>
              Clear history
            </Button>
            <Button disabled={!canSync} variant="transparent" onClick={onPullFromMockCloud}>
              Pull from mock cloud
            </Button>
          </>
        }
        meta={
          <>
            <span className="docs-filter-chip">
              Remote: {formatRemoteSnapshotLabel(remoteSnapshot)}
            </span>
            <span className="docs-filter-chip">Adapter: {activeRemoteAdapterLabel}</span>
            <span className="docs-filter-chip">
              Checked: {formatRemoteCheckTimestamp(remoteCheckState.checkedAt)}
            </span>
            <span className="docs-filter-chip">
              Trigger: {formatRemoteCheckTrigger(remoteCheckState.trigger)}
            </span>
            <span className="docs-filter-chip">
              Watch: {formatRemoteWatchLabel(remoteAutoRefreshMs)}
            </span>
            {remoteDriftNotice ? (
              <span className="docs-filter-chip">Lab: Pending remote drift</span>
            ) : null}
            <span className="docs-filter-chip">
              Activity: {activeVariantSyncActivities.length}
            </span>
            <span className="docs-filter-chip">Startup: {startupVariantLabel}</span>
            <span className="docs-filter-chip">Sync: {syncStatusLabel}</span>
            <span className="docs-filter-chip">
              Status: {syncState.status === "idle" ? "Ready" : syncState.status}
            </span>
            {remoteCheckState.errorMessage ? (
              <span className="docs-filter-chip">
                Check error: {remoteCheckState.errorMessage}
              </span>
            ) : null}
          </>
        }
        note={
          <span className="docs-dialog-note">
            {remoteDriftNotice ??
              syncState.message ??
              `Use the mock cloud buttons to simulate syncing saved views through the ${activeRemoteAdapterLabel} adapter.`}
          </span>
        }
      />
      <VariantSyncActivityList
        activities={activeVariantSyncActivities}
        emptyState={`No sync activity has been logged for the ${activeRemoteAdapterLabel} adapter yet.`}
      />
      <VariantSyncComparisonSummary
        comparison={reviewState?.comparison ?? undefined}
        heading="Current sync shape"
        localLabel="Local snapshot"
        localUpdatedAt={localSnapshot.updatedAt}
        remoteLabel={activeRemoteAdapterLabel}
        remoteUpdatedAt={remoteSnapshot?.updatedAt}
        statusLabel={syncStatusLabel}
      />
      <div className="docs-sync-snapshot-grid">
        <VariantSyncSnapshotList heading="Local snapshot" snapshot={localSnapshot} />
        <VariantSyncSnapshotList
          emptyState={`No remote snapshot is currently stored in ${activeRemoteAdapterLabel}.`}
          heading={`Remote snapshot in ${activeRemoteAdapterLabel}`}
          snapshot={remoteSnapshot}
        />
      </div>

      {savedVariants.length === 0 ? (
        <div className="docs-saved-variant-empty">
          Save the current worklist state to create your first local variant, or import a JSON payload from another browser profile.
        </div>
      ) : (
        <div className="docs-saved-variant-list">
          {savedVariants.map((variant, index) => (
            <SavedWorklistVariantCard
              key={variant.key}
              activeVariant={activeVariant}
              index={index}
              startupVariantKey={startupVariantKey}
              totalVariants={savedVariants.length}
              variant={variant}
              onApplyVariant={() => {
                onApplyVariant(variant.key);
                onClose();
              }}
              onDeleteVariant={() => onDeleteVariant(variant.key)}
              onDuplicateVariant={() => onDuplicateVariant(variant)}
              onMoveDown={() => onMoveVariant(variant.key, 1)}
              onMoveUp={() => onMoveVariant(variant.key, -1)}
              onRenameVariant={() => onRenameVariant(variant)}
              onSetStartupVariant={() => onSetStartupVariant(variant.key)}
            />
          ))}
        </div>
      )}
    </Dialog>
  );
}

interface SavedWorklistVariantCardProps {
  activeVariant: WorklistVariantKey;
  index: number;
  onApplyVariant: () => void;
  onDeleteVariant: () => void;
  onDuplicateVariant: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRenameVariant: () => void;
  onSetStartupVariant: () => void;
  startupVariantKey: WorklistVariantKey;
  totalVariants: number;
  variant: SavedVariant<WorklistVariantPreset>;
}

function SavedWorklistVariantCard({
  activeVariant,
  index,
  onApplyVariant,
  onDeleteVariant,
  onDuplicateVariant,
  onMoveDown,
  onMoveUp,
  onRenameVariant,
  onSetStartupVariant,
  startupVariantKey,
  totalVariants,
  variant,
}: SavedWorklistVariantCardProps) {
  const selected = variant.key === activeVariant;
  const startup = variant.key === startupVariantKey;
  const canMoveUp = index > 0;
  const canMoveDown = index < totalVariants - 1;

  return (
    <article className="docs-saved-variant-card" data-selected={selected}>
      <div className="docs-saved-variant-card__header">
        <div className="docs-saved-variant-card__title">
          <strong>{variant.label}</strong>
          <span className="docs-variant-kind" data-kind="saved">
            Local
          </span>
          {selected ? (
            <span className="docs-variant-kind" data-kind="active">
              Active
            </span>
          ) : null}
          {startup ? (
            <span className="docs-variant-kind" data-kind="startup">
              Startup
            </span>
          ) : null}
        </div>
        <span className="docs-saved-variant-card__meta">
          {formatSavedVariantTimestamp(variant.updatedAt)}
        </span>
      </div>

      <p className="docs-saved-variant-card__description">
        {variant.description || "No description added yet for this local worklist view."}
      </p>

      <div className="docs-saved-variant-card__chips">
        <span className="docs-filter-chip">
          Matches: {formatWorklistVariantCount(countWorkItemsForFilters(variant.preset.filters))}
        </span>
        <span className="docs-filter-chip">
          Sort: {variant.preset.sort
            ? `${getWorklistSortLabel(variant.preset.sort)} ${variant.preset.sort.direction}`
            : "None"}
        </span>
        <span className="docs-filter-chip">
          Group: {getWorklistGroupLabel(variant.preset.groupBy)}
        </span>
        <span className="docs-filter-chip">
          Columns: {variant.preset.filters.visibleColumnIds.length}
        </span>
        <span className="docs-filter-chip">
          Page size: {variant.preset.pageSize ?? 3}
        </span>
        <span className="docs-filter-chip">
          Order: {index + 1} / {totalVariants}
        </span>
      </div>

      <div className="docs-saved-variant-card__actions">
        <Button variant="default" onClick={onApplyVariant}>
          Apply
        </Button>
        <Button variant="transparent" onClick={onDuplicateVariant}>
          Duplicate
        </Button>
        <Button variant="transparent" onClick={onRenameVariant}>
          Rename
        </Button>
        <Button disabled={!canMoveUp} variant="transparent" onClick={onMoveUp}>
          Move up
        </Button>
        <Button disabled={!canMoveDown} variant="transparent" onClick={onMoveDown}>
          Move down
        </Button>
        <Button selected={startup} variant="transparent" onClick={onSetStartupVariant}>
          Set startup
        </Button>
        <Button variant="negative" onClick={onDeleteVariant}>
          Delete
        </Button>
      </div>
    </article>
  );
}

interface WorklistVariantSyncReviewDialogProps {
  localSnapshot: VariantSyncSnapshot<WorklistVariantPreset, WorklistVariantKey>;
  onApplyMerge: () => void;
  onClose: () => void;
  onOverwriteRemote: () => void;
  onReplaceLocal: () => void;
  reviewSections: VariantSyncReviewSection[];
  reviewState: VariantSyncReviewState<WorklistVariantPreset, WorklistVariantKey> | null;
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>;
  startupVariantLabel: string;
  workspaceCards: VariantSyncReviewWorkspaceCard[];
}

export function WorklistVariantSyncReviewDialog({
  localSnapshot,
  onApplyMerge,
  onClose,
  onOverwriteRemote,
  onReplaceLocal,
  reviewSections,
  reviewState,
  savedVariants,
  startupVariantLabel,
  workspaceCards,
}: WorklistVariantSyncReviewDialogProps) {
  return (
    <VariantSyncDialog
      applyMergeLabel="Apply reviewed merge"
      closeOnOverlayClick
      description={
        reviewState?.direction === "push"
          ? "Remote saved views changed since the last local snapshot. Review the differences before overwriting mock cloud state."
          : "Local saved views changed since the last remote snapshot. Review the differences before replacing your local workspace."
      }
      direction={reviewState?.direction}
      footerNote={
        <span className="docs-dialog-note">
          Merge keeps your local working copy and adds remote changes on top. Overwrite or replace uses one side as the source of truth.
        </span>
      }
      open={reviewState !== null}
      resolveLabel={reviewState?.direction === "push" ? "Overwrite remote" : "Replace local"}
      reviewProps={{
        localPanelMeta: (
          <>
            <span className="docs-filter-chip">Views: {savedVariants.length}</span>
            <span className="docs-filter-chip">Startup: {startupVariantLabel}</span>
            <span className="docs-filter-chip">
              Last local update: {formatSavedVariantTimestamp(localSnapshot.updatedAt)}
            </span>
          </>
        ),
        message:
          reviewState?.direction === "push"
            ? "Overwriting remote will replace the mock cloud snapshot with your current local views and startup preference."
            : "Replacing local will swap your current saved views for the remote snapshot and update the startup preference if needed.",
        messageHeadline:
          reviewState?.comparison.status === "diverged"
            ? "Local and remote both changed"
            : reviewState?.direction === "push"
              ? "Remote contains newer differences"
              : "Local contains newer differences",
        meta: (
          <>
            <span className="docs-filter-chip">
              Direction: {reviewState?.direction === "push" ? "Local -> Remote" : "Remote -> Local"}
            </span>
            <span className="docs-filter-chip">
              Local only: {reviewState?.comparison.localOnlyKeys.length ?? 0}
            </span>
            <span className="docs-filter-chip">
              Remote only: {reviewState?.comparison.remoteOnlyKeys.length ?? 0}
            </span>
            <span className="docs-filter-chip">
              Changed: {reviewState?.comparison.changedKeys.length ?? 0}
            </span>
            <span className="docs-filter-chip">
              Startup changed: {reviewState?.comparison.startupChanged ? "Yes" : "No"}
            </span>
            <span className="docs-filter-chip">
              Order changed: {reviewState?.comparison.orderChanged ? "Yes" : "No"}
            </span>
          </>
        ),
        remotePanelMeta: (
          <>
            <span className="docs-filter-chip">
              Views: {reviewState?.remoteSnapshot.variants.length ?? 0}
            </span>
            <span className="docs-filter-chip">
              Startup: {reviewState
                ? getWorklistVariantLabel(
                    reviewState.remoteSnapshot.startupVariantKey,
                    reviewState.remoteSnapshot.variants,
                  )
                : "Standard"}
            </span>
            <span className="docs-filter-chip">
              Last remote update: {reviewState
                ? formatSavedVariantTimestamp(reviewState.remoteSnapshot.updatedAt)
                : "Remote snapshot"}
            </span>
          </>
        ),
        remotePanelTitle: "Mock cloud",
        sections: reviewSections,
        workspaceCards,
      }}
      title={reviewState?.direction === "push" ? "Review cloud overwrite" : "Review local overwrite"}
      onApplyMerge={onApplyMerge}
      onClose={onClose}
      onResolve={() =>
        reviewState?.direction === "push" ? onOverwriteRemote() : onReplaceLocal()
      }
    />
  );
}

interface RenameLocalViewDialogProps {
  canRenameVariant: boolean;
  onClose: () => void;
  onDescriptionChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onSave: () => void;
  open: boolean;
  value: VariantRenameValue | null;
}

export function RenameLocalViewDialog({
  canRenameVariant,
  onClose,
  onDescriptionChange,
  onLabelChange,
  onSave,
  open,
  value,
}: RenameLocalViewDialogProps) {
  return (
    <Dialog
      actions={
        <>
          <Button variant="transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!canRenameVariant} variant="emphasized" onClick={onSave}>
            Save label
          </Button>
        </>
      }
      closeOnOverlayClick
      description="Rename the saved view and adjust its description without changing the stored filters, sort, grouping or page-size snapshot."
      footerStart={
        <span className="docs-dialog-note">
          Metadata updates keep the saved payload intact, so worklist behavior stays the same.
        </span>
      }
      onClose={onClose}
      open={open}
      size="md"
      title="Rename local view"
      tone="information"
    >
      <FormGrid columns={2}>
        <FormField
          description="Shown in the variant strip and management list."
          htmlFor="rename-variant-name"
          label="View name"
          required
        >
          <Input
            id="rename-variant-name"
            message={!canRenameVariant ? "A saved view needs a name." : undefined}
            value={value?.label ?? ""}
            valueState={!canRenameVariant ? "error" : "none"}
            onChange={(event) => onLabelChange(event.target.value)}
          />
        </FormField>

        <FormField
          description="Optional context for the saved view."
          htmlFor="rename-variant-description"
          label="Description"
        >
          <Input
            id="rename-variant-description"
            placeholder="Morning handoff, release queue, attention triage..."
            value={value?.description ?? ""}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </FormField>
      </FormGrid>
    </Dialog>
  );
}

interface VariantTransferDialogProps {
  canImportSavedVariants: boolean;
  onClose: () => void;
  onImport: () => void;
  onValueChange: (value: string) => void;
  open: boolean;
  savedVariantsCount: number;
  startupVariantLabel: string;
  value: VariantTransferValue | null;
}

export function WorklistVariantTransferDialog({
  canImportSavedVariants,
  onClose,
  onImport,
  onValueChange,
  open,
  savedVariantsCount,
  startupVariantLabel,
  value,
}: VariantTransferDialogProps) {
  return (
    <Dialog
      actions={
        <>
          <Button variant="transparent" onClick={onClose}>
            Close
          </Button>
          {value?.mode === "import" ? (
            <Button disabled={!canImportSavedVariants} variant="emphasized" onClick={onImport}>
              Merge saved views
            </Button>
          ) : null}
        </>
      }
      closeOnOverlayClick
      description={
        value?.mode === "export"
          ? "Copy this payload to move your local views and startup preference into another AxiomUI workspace."
          : "Paste a JSON payload exported from another AxiomUI workspace. Imported keys will overwrite local views with the same key."
      }
      footerStart={
        <span className="docs-dialog-note">
          {value?.mode === "export"
            ? "The export includes saved local views plus the current startup view key."
            : value?.error ??
              "Only valid saved view entries are merged into the current browser profile."}
        </span>
      }
      onClose={onClose}
      open={open}
      size="lg"
      title={value?.mode === "export" ? "Export local views" : "Import local views"}
      tone={value?.error ? "warning" : "information"}
    >
      <div className="docs-variant-transfer">
        <div className="docs-variant-transfer__meta">
          <span className="docs-filter-chip">Saved views: {savedVariantsCount}</span>
          <span className="docs-filter-chip">Startup: {startupVariantLabel}</span>
          <span className="docs-filter-chip">
            Mode: {value?.mode === "export" ? "Export" : "Import"}
          </span>
        </div>
        <textarea
          className="docs-variant-transfer__textarea"
          readOnly={value?.mode === "export"}
          value={value?.value ?? ""}
          onChange={(event) => onValueChange(event.target.value)}
        />
      </div>
    </Dialog>
  );
}

interface WorkspaceDraftDialogProps {
  onClose: () => void;
  open: boolean;
}

export function WorkspaceDraftDialog({
  onClose,
  open,
}: WorkspaceDraftDialogProps) {
  return (
    <Dialog
      actions={
        <>
          <Button variant="transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="emphasized" onClick={onClose}>
            Save workspace
          </Button>
        </>
      }
      closeOnOverlayClick
      description="Header, content and footer are kept separate so dense business workflows do not collapse into one long content block."
      footerStart={<span className="docs-dialog-note">Draft is stored locally.</span>}
      onClose={onClose}
      open={open}
      size="lg"
      title="Create workspace flow"
      tone="information"
    >
      <FormGrid columns={2}>
        <FormField
          description="Primary workspace title"
          htmlFor="dialog-name"
          label="Name"
          required
        >
          <Input id="dialog-name" placeholder="AxiomUI Operations Shell" />
        </FormField>

        <FormField
          description="Header toolbar owner"
          htmlFor="dialog-team"
          label="Team"
        >
          <Input id="dialog-team" placeholder="Design Systems" />
        </FormField>

        <FormField
          description="Value-state and wrapper logic remain reusable inside the modal."
          htmlFor="dialog-scope"
          hint="Try the same form layout in a page section and a dialog without rewriting spacing rules."
          label="Scope"
          span={2}
        >
          <Input
            id="dialog-scope"
            placeholder="Buttons, rows, tabs, forms and layered layouts"
            valueState="information"
            message="Information accents stay gentle and enterprise-friendly."
          />
        </FormField>
      </FormGrid>
    </Dialog>
  );
}
