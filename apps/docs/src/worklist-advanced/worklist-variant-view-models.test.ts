import {
  Children,
  Fragment,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  createVariantSyncSnapshot,
  type SavedVariant,
  type VariantSyncEntries,
  type VariantSyncReviewState,
} from "@axiomui/react";

import {
  type WorklistVariantKey,
  type WorklistVariantPreset,
  variantPresets,
} from "../demo-data";
import {
  buildVariantManagerOptions,
  buildVariantSyncSections,
  buildVariantSyncWorkspaceCards,
} from "./worklist-variant-view-models";

function renderNode(node: ReactNode) {
  return renderToStaticMarkup(createElement(Fragment, null, node));
}

function getChildElements<TProps extends { children?: ReactNode }>(
  node: ReactNode,
): ReactElement<TProps>[] {
  if (!isValidElement<TProps>(node)) {
    return [];
  }

  return Children.toArray(node.props.children).filter(isValidElement) as ReactElement<TProps>[];
}

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

function createReviewState(): VariantSyncReviewState<
  WorklistVariantPreset,
  WorklistVariantKey
> {
  return {
    comparison: {
      changedKeys: ["beta"],
      localOnlyKeys: ["alpha"],
      orderChanged: true,
      remoteOnlyKeys: ["gamma"],
      startupChanged: true,
      status: "diverged",
    },
    direction: "push",
    remoteSnapshot: createVariantSyncSnapshot({
      startupVariantKey: "gamma",
      variants: [
        createSavedWorklistVariant(
          "beta",
          "Beta remote",
          variantPresets["attention-queue"],
          "2026-03-26T11:00:00.000Z",
        ),
        createSavedWorklistVariant(
          "gamma",
          "Gamma remote",
          variantPresets["compact-review"],
          "2026-03-26T12:00:00.000Z",
        ),
      ],
      version: 1,
    }),
    selections: {
      orderSelection: "remote",
      startupSelection: "remote",
      variantSelections: {
        alpha: "local",
        beta: "remote",
        gamma: "none",
      },
    },
  };
}

describe("worklist-variant-view-models", () => {
  it("builds preset and saved variant options with counts and dirty state", () => {
    const options = buildVariantManagerOptions({
      activeVariant: "saved-release",
      activeVariantDirty: true,
      savedVariants: [
        createSavedWorklistVariant(
          "saved-release",
          "Release follow-up",
          variantPresets["attention-queue"],
          "2026-03-26T10:00:00.000Z",
          "Focused local queue",
        ),
      ],
    });

    expect(options.map((option) => option.key)).toEqual([
      "standard",
      "compact-review",
      "attention-queue",
      "saved-release",
    ]);
    expect(options.map((option) => option.count)).toEqual(["04", "01", "02", "02"]);
    expect(options.map((option) => option.modified)).toEqual([
      false,
      false,
      false,
      true,
    ]);
    expect(renderNode(options[0].label)).toContain("Preset");
    expect(renderNode(options[3].label)).toContain("Release follow-up");
    expect(renderNode(options[3].label)).toContain("Local");
    expect(options[3].description).toBe("Focused local queue");
  });

  it("builds sync review sections and wires review selection actions", () => {
    const reviewState = createReviewState();
    const selectionCalls: Array<[string, "local" | "none" | "remote"]> = [];
    const sections = buildVariantSyncSections({
      reviewEntries: {
        changed: [
          {
            key: "beta",
            localLabel: "Beta local",
            localUpdatedAt: "2026-03-26T12:00:00.000Z",
            remoteLabel: "Beta remote",
            remoteUpdatedAt: "2026-03-26T11:00:00.000Z",
            state: "changed",
          },
        ],
        localOnly: [
          {
            key: "alpha",
            localLabel: "Alpha local",
            localUpdatedAt: "2026-03-26T09:00:00.000Z",
            state: "local-only",
          },
        ],
        remoteOnly: [
          {
            key: "gamma",
            remoteLabel: "Gamma remote",
            remoteUpdatedAt: "2026-03-26T10:00:00.000Z",
            state: "remote-only",
          },
        ],
      } satisfies VariantSyncEntries,
      reviewState,
      updateReviewSelection: (key, selection) => {
        selectionCalls.push([key, selection]);
      },
    });

    expect(sections.map((section) => section.key)).toEqual([
      "changed",
      "local-only",
      "remote-only",
    ]);

    const changedEntry = sections[0].entries[0];
    const changedButtons = getChildElements<{
      children?: ReactNode;
      onClick?: () => void;
      selected?: boolean;
    }>(changedEntry.actions);

    expect(renderNode(changedEntry.badge)).toContain("Local newer");
    expect(changedButtons.map((button) => renderNode(button.props.children))).toEqual([
      "Use local",
      "Use remote",
    ]);
    expect(changedButtons.map((button) => button.props.selected)).toEqual([
      false,
      true,
    ]);
    changedButtons[0].props.onClick?.();
    changedButtons[1].props.onClick?.();

    const localOnlyButtons = getChildElements<{
      children?: ReactNode;
      onClick?: () => void;
      selected?: boolean;
    }>(sections[1].entries[0].actions);
    expect(localOnlyButtons.map((button) => renderNode(button.props.children))).toEqual([
      "Keep local",
      "Drop local",
    ]);
    expect(localOnlyButtons.map((button) => button.props.selected)).toEqual([
      true,
      false,
    ]);
    localOnlyButtons[1].props.onClick?.();

    const remoteOnlyButtons = getChildElements<{
      children?: ReactNode;
      onClick?: () => void;
      selected?: boolean;
    }>(sections[2].entries[0].actions);
    expect(remoteOnlyButtons.map((button) => renderNode(button.props.children))).toEqual([
      "Add remote",
      "Ignore remote",
    ]);
    expect(remoteOnlyButtons.map((button) => button.props.selected)).toEqual([
      false,
      true,
    ]);
    remoteOnlyButtons[0].props.onClick?.();

    expect(selectionCalls).toEqual([
      ["beta", "local"],
      ["beta", "remote"],
      ["alpha", "none"],
      ["gamma", "remote"],
    ]);
  });

  it("builds workspace decision cards only for startup and order conflicts", () => {
    expect(
      buildVariantSyncWorkspaceCards({
        reviewState: null,
        startupVariantLabel: "Standard",
        updateWorkspaceSelection: () => undefined,
      }),
    ).toEqual([]);

    const reviewState = createReviewState();
    const workspaceCalls: Array<
      ["orderSelection" | "startupSelection", "local" | "remote"]
    > = [];
    const cards = buildVariantSyncWorkspaceCards({
      reviewState,
      startupVariantLabel: "Standard",
      updateWorkspaceSelection: (key, value) => {
        workspaceCalls.push([key, value]);
      },
    });

    expect(cards.map((card) => card.key)).toEqual(["startup", "order"]);
    expect(renderNode(cards[0].meta)).toContain("Local: Standard");
    expect(renderNode(cards[0].meta)).toContain("Remote: Gamma remote");

    const startupButtons = getChildElements<{
      children?: ReactNode;
      onClick?: () => void;
      selected?: boolean;
    }>(cards[0].actions);
    expect(startupButtons.map((button) => renderNode(button.props.children))).toEqual([
      "Keep local startup",
      "Use remote startup",
    ]);
    expect(startupButtons.map((button) => button.props.selected)).toEqual([
      false,
      true,
    ]);
    startupButtons[0].props.onClick?.();

    const orderButtons = getChildElements<{
      children?: ReactNode;
      onClick?: () => void;
      selected?: boolean;
    }>(cards[1].actions);
    expect(orderButtons.map((button) => renderNode(button.props.children))).toEqual([
      "Keep local order",
      "Use remote order",
    ]);
    expect(orderButtons.map((button) => button.props.selected)).toEqual([
      false,
      true,
    ]);
    orderButtons[1].props.onClick?.();

    expect(workspaceCalls).toEqual([
      ["startupSelection", "local"],
      ["orderSelection", "remote"],
    ]);
  });
});
