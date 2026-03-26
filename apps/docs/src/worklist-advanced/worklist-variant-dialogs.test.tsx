import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  createVariantSyncSnapshot,
  type SavedVariant,
} from "@axiomui/react";

import {
  type WorklistVariantKey,
  type WorklistVariantPreset,
  variantPresets,
} from "../demo-data";
import {
  ManageLocalViewsDialog,
  SaveWorklistViewDialog,
} from "./worklist-variant-dialogs";

function createSavedWorklistVariant(
  key: WorklistVariantKey,
  label: string,
  preset: WorklistVariantPreset,
  updatedAt: string,
  description?: string,
): SavedVariant<WorklistVariantPreset> {
  return {
    createdAt: updatedAt,
    description,
    key,
    label,
    preset,
    updatedAt,
  };
}

describe("worklist-variant-dialogs", () => {
  it("renders the save dialog snapshot and forwards form actions", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleDescriptionChange = vi.fn();
    const handleLabelChange = vi.fn();
    const handleSaveCreate = vi.fn();
    const { rerender } = render(
      <SaveWorklistViewDialog
        activeGroupBy="priority"
        activeSavedVariant={undefined}
        canSaveVariant={false}
        currentVariantPreset={variantPresets["attention-queue"]}
        open
        value={{
          description: "Morning review",
          label: "",
        }}
        onClose={handleClose}
        onDescriptionChange={handleDescriptionChange}
        onLabelChange={handleLabelChange}
        onSaveCreate={handleSaveCreate}
        onSaveUpdate={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: /save worklist view/i })).toBeInTheDocument();
    expect(screen.getByText(/capture the current filter, column, sort, group and page-size state/i)).toBeInTheDocument();
    expect(screen.getByText("Priority: Attention")).toBeInTheDocument();
    expect(screen.getByText("Group: Priority")).toBeInTheDocument();
    expect(screen.getByText("Page size: 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^save view$/i })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/view name/i), {
      target: { value: "Focus queue" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Morning handoff" },
    });

    expect(handleLabelChange).toHaveBeenCalledWith("Focus queue");
    expect(handleDescriptionChange).toHaveBeenCalledWith("Morning handoff");

    await user.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    rerender(
      <SaveWorklistViewDialog
        activeGroupBy="priority"
        activeSavedVariant={createSavedWorklistVariant(
          "saved-review",
          "Saved review",
          variantPresets["attention-queue"],
          "2026-03-26T10:00:00.000Z",
        )}
        canSaveVariant
        currentVariantPreset={variantPresets["attention-queue"]}
        open
        value={{
          description: "Saved",
          label: "Saved review",
        }}
        onClose={vi.fn()}
        onDescriptionChange={vi.fn()}
        onLabelChange={vi.fn()}
        onSaveCreate={handleSaveCreate}
        onSaveUpdate={handleClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: /update current/i }));
    await user.click(screen.getByRole("button", { name: /save as new/i }));

    expect(handleClose).toHaveBeenCalledTimes(2);
    expect(handleSaveCreate).toHaveBeenCalledTimes(1);
  });

  it("renders manage-local-views controls and forwards saved-variant actions", async () => {
    const user = userEvent.setup();
    const savedVariant = createSavedWorklistVariant(
      "saved-review",
      "Saved review",
      variantPresets["attention-queue"],
      "2026-03-26T10:00:00.000Z",
      "Focused triage queue",
    );
    const secondaryVariant = createSavedWorklistVariant(
      "saved-backlog",
      "Saved backlog",
      variantPresets.standard,
      "2026-03-26T11:00:00.000Z",
      "Secondary queue",
    );
    const localSnapshot = createVariantSyncSnapshot<WorklistVariantPreset, WorklistVariantKey>({
      startupVariantKey: "saved-review",
      variants: [savedVariant, secondaryVariant],
      version: 1,
    });
    const remoteSnapshot = createVariantSyncSnapshot<WorklistVariantPreset, WorklistVariantKey>({
      startupVariantKey: "saved-review",
      variants: [savedVariant, secondaryVariant],
      version: 1,
    });
    const handleApplyVariant = vi.fn();
    const handleClearHistory = vi.fn();
    const handleClearRemote = vi.fn();
    const handleClose = vi.fn();
    const handleDeleteVariant = vi.fn();
    const handleDuplicateVariant = vi.fn();
    const handleMoveVariant = vi.fn();
    const handleOpenExport = vi.fn();
    const handleOpenImport = vi.fn();
    const handlePull = vi.fn();
    const handlePush = vi.fn();
    const handleRefresh = vi.fn();
    const handleRemoteAdapterModeChange = vi.fn();
    const handleRemoteAutoRefreshChange = vi.fn();
    const handleRenameVariant = vi.fn();
    const handleSetStartupVariant = vi.fn();
    const handleSimulateRemoteClearDrift = vi.fn();
    const handleSimulateRemoteStartupDrift = vi.fn();
    const handleSimulateRemoteViewDrift = vi.fn();

    render(
      <ManageLocalViewsDialog
        activeRemoteAdapterLabel="localStorage mock cloud"
        activeVariant="saved-review"
        activeVariantSyncActivities={[
          {
            description: "Checked localStorage mock cloud.",
            id: "activity-1",
            kind: "refresh",
            occurredAt: "2026-03-26T10:00:00.000Z",
            sourceLabel: "localStorage mock cloud",
            title: "Remote snapshot refreshed",
            tone: "information",
          },
        ]}
        canSync
        localSnapshot={localSnapshot}
        open
        remoteAdapterMode="local-storage"
        remoteAutoRefreshMs={5000}
        remoteAutoRefreshOptions={[0, 5000, 15000]}
        remoteCheckState={{
          checkedAt: "2026-03-26T10:05:00.000Z",
          trigger: "manual",
        }}
        remoteSnapshot={remoteSnapshot}
        reviewState={null}
        savedVariants={[savedVariant, secondaryVariant]}
        startupVariantKey="saved-review"
        startupVariantLabel="Saved review"
        syncState={{ status: "idle" }}
        syncStatusLabel="In sync"
        onApplyVariant={handleApplyVariant}
        onClearHistory={handleClearHistory}
        onClearRemote={handleClearRemote}
        onClose={handleClose}
        onDeleteVariant={handleDeleteVariant}
        onDuplicateVariant={handleDuplicateVariant}
        onMoveVariant={handleMoveVariant}
        onOpenExport={handleOpenExport}
        onOpenImport={handleOpenImport}
        onPullFromMockCloud={handlePull}
        onPushToMockCloud={handlePush}
        onRefreshRemote={handleRefresh}
        onRemoteAdapterModeChange={handleRemoteAdapterModeChange}
        onRemoteAutoRefreshChange={handleRemoteAutoRefreshChange}
        onRenameVariant={handleRenameVariant}
        onSetStartupVariant={handleSetStartupVariant}
        onSimulateRemoteClearDrift={handleSimulateRemoteClearDrift}
        onSimulateRemoteStartupDrift={handleSimulateRemoteStartupDrift}
        onSimulateRemoteViewDrift={handleSimulateRemoteViewDrift}
      />,
    );

    expect(screen.getByRole("dialog", { name: /manage local views/i })).toBeInTheDocument();
    expect(screen.getByText("Adapter: localStorage mock cloud")).toBeInTheDocument();
    expect(screen.getByText("Activity: 1")).toBeInTheDocument();
    const savedReviewDescription = screen
      .getAllByText("Focused triage queue")
      .find((element) => element.closest(".docs-saved-variant-card") !== null);
    const savedReviewCard = savedReviewDescription?.closest(".docs-saved-variant-card");

    expect(savedReviewDescription).toBeDefined();
    expect(savedReviewCard).not.toBeNull();

    if (
      savedReviewDescription === undefined ||
      !(savedReviewCard instanceof HTMLElement)
    ) {
      throw new Error("Expected the saved review card to be rendered.");
    }

    const savedReviewCardQueries = within(savedReviewCard);

    expect(savedReviewCardQueries.getByText("Saved review")).toBeInTheDocument();
    expect(savedReviewCardQueries.getByText("Focused triage queue")).toBeInTheDocument();
    expect(savedReviewCardQueries.getByText("Active")).toBeInTheDocument();
    expect(savedReviewCardQueries.getByText("Startup")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^sessionstorage$/i }));
    await user.click(screen.getByRole("button", { name: /^watch 15s$/i }));
    await user.click(screen.getByRole("button", { name: /^drift view$/i }));
    await user.click(screen.getByRole("button", { name: /^push to mock cloud$/i }));
    await user.click(screen.getByRole("button", { name: /^refresh remote$/i }));
    await user.click(screen.getByRole("button", { name: /^clear remote$/i }));
    await user.click(screen.getByRole("button", { name: /^clear history$/i }));
    await user.click(screen.getByRole("button", { name: /^pull from mock cloud$/i }));
    await user.click(screen.getByRole("button", { name: /^export json$/i }));
    await user.click(screen.getByRole("button", { name: /^import json$/i }));
    await user.click(savedReviewCardQueries.getByRole("button", { name: /^apply$/i }));
    await user.click(savedReviewCardQueries.getByRole("button", { name: /^duplicate$/i }));
    await user.click(savedReviewCardQueries.getByRole("button", { name: /^rename$/i }));
    await user.click(savedReviewCardQueries.getByRole("button", { name: /^move down$/i }));
    await user.click(savedReviewCardQueries.getByRole("button", { name: /^set startup$/i }));
    await user.click(savedReviewCardQueries.getByRole("button", { name: /^delete$/i }));

    expect(handleRemoteAdapterModeChange).toHaveBeenCalledWith("session-storage");
    expect(handleRemoteAutoRefreshChange).toHaveBeenCalledWith(15000);
    expect(handleSimulateRemoteViewDrift).toHaveBeenCalledTimes(1);
    expect(handlePush).toHaveBeenCalledTimes(1);
    expect(handleRefresh).toHaveBeenCalledTimes(1);
    expect(handleClearRemote).toHaveBeenCalledTimes(1);
    expect(handleClearHistory).toHaveBeenCalledTimes(1);
    expect(handlePull).toHaveBeenCalledTimes(1);
    expect(handleOpenExport).toHaveBeenCalledTimes(1);
    expect(handleOpenImport).toHaveBeenCalledTimes(1);
    expect(handleApplyVariant).toHaveBeenCalledWith("saved-review");
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleDuplicateVariant).toHaveBeenCalledWith(savedVariant);
    expect(handleRenameVariant).toHaveBeenCalledWith(savedVariant);
    expect(handleMoveVariant).toHaveBeenCalledWith("saved-review", 1);
    expect(handleSetStartupVariant).toHaveBeenCalledWith("saved-review");
    expect(handleDeleteVariant).toHaveBeenCalledWith("saved-review");
  });
});
