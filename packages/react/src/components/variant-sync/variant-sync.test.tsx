import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { SavedVariant } from "../../hooks/use-saved-variants";
import type { VariantSyncActivity } from "../../hooks/use-variant-sync";
import { createVariantSyncSnapshot } from "../../lib/variant-sync";
import {
  VariantSyncActivityList,
  VariantSyncComparisonSummary,
  VariantSyncDialog,
  VariantSyncReview,
  VariantSyncSnapshotList,
} from "./variant-sync";

interface DemoPreset {
  scope: string;
}

function createSavedVariant(
  key: string,
  label: string,
  scope: string,
  updatedAt: string,
  description?: string,
): SavedVariant<DemoPreset> {
  return {
    createdAt: updatedAt,
    description,
    key,
    label,
    preset: { scope },
    updatedAt,
  };
}

function createActivity(
  id: string,
  title: string,
  occurredAt: string,
  tone: VariantSyncActivity["tone"] = "information",
): VariantSyncActivity {
  return {
    description: `${title} description`,
    id,
    kind: "refresh",
    occurredAt,
    sourceLabel: "mock cloud",
    title,
    tone,
  };
}

describe("VariantSync components", () => {
  it("renders summary counts, labels, and warning tone for diverged snapshots", () => {
    const { container } = render(
      <VariantSyncComparisonSummary
        comparison={{
          changedKeys: ["beta"],
          localOnlyKeys: ["alpha", "delta"],
          orderChanged: true,
          remoteOnlyKeys: ["gamma"],
          startupChanged: false,
          status: "diverged",
        }}
        localLabel="Local snapshot"
        remoteLabel="Mock cloud"
      />,
    );

    expect(screen.getByText("Sync summary")).toBeInTheDocument();
    expect(screen.getByText("Conflict review")).toBeInTheDocument();
    expect(screen.getByText("Local snapshot")).toBeInTheDocument();
    expect(screen.getByText("Mock cloud")).toBeInTheDocument();
    expect(screen.getAllByText("Changed")).toHaveLength(2);
    expect(screen.getByText("Local only")).toBeInTheDocument();
    expect(screen.getByText("Remote only")).toBeInTheDocument();
    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Startup")).toBeInTheDocument();
    expect(container.querySelector('.ax-variant-sync-summary__status[data-tone="warning"]')).toBeTruthy();
    expect(container.querySelectorAll(".ax-variant-sync-summary__stat-value")[0]).toHaveTextContent("1");
    expect(container.querySelectorAll(".ax-variant-sync-summary__stat-value")[1]).toHaveTextContent("2");
    expect(container.querySelectorAll(".ax-variant-sync-summary__stat-value")[2]).toHaveTextContent("1");
    expect(container.querySelectorAll(".ax-variant-sync-summary__stat-value")[3]).toHaveTextContent("Aligned");
    expect(container.querySelectorAll(".ax-variant-sync-summary__stat-value")[4]).toHaveTextContent("Changed");
  });

  it("renders activity and snapshot lists with truncation and empty states", () => {
    const snapshot = createVariantSyncSnapshot<DemoPreset, string>({
      startupVariantKey: "alpha",
      variants: [
        createSavedVariant(
          "alpha",
          "Alpha local",
          "alpha",
          "2026-03-26T08:00:00.000Z",
        ),
        createSavedVariant(
          "beta",
          "Beta remote",
          "beta",
          "2026-03-26T09:00:00.000Z",
          "Custom description",
        ),
      ],
      version: 1,
    });

    const { rerender } = render(
      <>
        <VariantSyncActivityList
          activities={[
            createActivity("1", "Connected", "2026-03-26T08:00:00.000Z", "neutral"),
            createActivity("2", "Pulled", "2026-03-26T09:00:00.000Z", "success"),
            createActivity("3", "Merged", "2026-03-26T10:00:00.000Z", "warning"),
          ]}
          maxItems={2}
        />
        <VariantSyncSnapshotList
          heading="Remote snapshot"
          maxItems={1}
          snapshot={snapshot}
        />
      </>,
    );

    expect(screen.getByText("Recent sync activity")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByText("Pulled")).toBeInTheDocument();
    expect(screen.queryByText("Merged")).not.toBeInTheDocument();
    expect(screen.getByText("Remote snapshot")).toBeInTheDocument();
    expect(screen.getByText("Alpha local")).toBeInTheDocument();
    expect(screen.getByText("Startup")).toBeInTheDocument();
    expect(screen.getByText("No description has been saved for this view yet.")).toBeInTheDocument();
    expect(screen.queryByText("Beta remote")).not.toBeInTheDocument();

    rerender(
      <>
        <VariantSyncActivityList activities={[]} emptyState="No activity yet." />
        <VariantSyncSnapshotList snapshot={null} emptyState="No snapshot stored." />
      </>,
    );

    expect(screen.getByText("No activity yet.")).toBeInTheDocument();
    expect(screen.getByText("No snapshot stored.")).toBeInTheDocument();
  });

  it("renders review panels, workspace cards, and sections together", async () => {
    const user = userEvent.setup();
    const handleWorkspace = vi.fn();
    const handleEntry = vi.fn();

    render(
      <VariantSyncReview
        localPanelMeta={<span>Local views: 2</span>}
        message="Review before overwriting remote state."
        messageHeadline="Remote differences detected"
        meta={<span>Direction: Local -&gt; Remote</span>}
        remotePanelMeta={<span>Remote views: 3</span>}
        sections={[
          {
            entries: [
              {
                actions: (
                  <button type="button" onClick={handleEntry}>
                    Use remote
                  </button>
                ),
                badge: <span>Remote newer</span>,
                key: "beta",
                meta: <span>Beta updated remotely</span>,
                title: "Beta",
              },
            ],
            key: "changed",
            title: "Changed on both sides",
          },
        ]}
        workspaceCards={[
          {
            actions: (
              <button type="button" onClick={handleWorkspace}>
                Use remote startup
              </button>
            ),
            key: "startup",
            meta: <span>Local: Standard</span>,
            title: "Startup view",
          },
        ]}
      >
        <span>Extra note</span>
      </VariantSyncReview>,
    );

    expect(screen.getByText("Direction: Local -> Remote")).toBeInTheDocument();
    expect(screen.getByText("Remote differences detected")).toBeInTheDocument();
    expect(screen.getByText("Review before overwriting remote state.")).toBeInTheDocument();
    expect(screen.getByText("Local workspace")).toBeInTheDocument();
    expect(screen.getByText("Remote workspace")).toBeInTheDocument();
    expect(screen.getByText("Workspace decisions")).toBeInTheDocument();
    expect(screen.getByText("Startup view")).toBeInTheDocument();
    expect(screen.getByText("Changed on both sides")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Remote newer")).toBeInTheDocument();
    expect(screen.getByText("Extra note")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^use remote startup$/i }));
    await user.click(screen.getByRole("button", { name: /^use remote$/i }));

    expect(handleWorkspace).toHaveBeenCalledTimes(1);
    expect(handleEntry).toHaveBeenCalledTimes(1);
  });

  it("renders dialog defaults for pull mode and forwards action callbacks", async () => {
    const user = userEvent.setup();
    const handleApplyMerge = vi.fn();
    const handleClose = vi.fn();
    const handleResolve = vi.fn();

    render(
      <VariantSyncDialog
        direction="pull"
        open
        reviewProps={{
          message: "Local changes need review.",
          sections: [],
          workspaceCards: [],
        }}
        onApplyMerge={handleApplyMerge}
        onClose={handleClose}
        onResolve={handleResolve}
      />,
    );

    expect(screen.getByRole("dialog", { name: /review local overwrite/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Local saved views changed since the last remote snapshot. Review the differences before replacing your local workspace.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply reviewed merge/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /replace local/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /apply reviewed merge/i }));
    await user.click(screen.getByRole("button", { name: /replace local/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(handleApplyMerge).toHaveBeenCalledTimes(1);
    expect(handleResolve).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
