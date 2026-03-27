import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import {
  NavigationList,
  type NavigationListGroup,
  type NavigationListItem,
} from "./navigation-list";

const navigationGroups: NavigationListGroup[] = [
  {
    key: "workspace",
    label: "Workspace",
    items: [
      {
        key: "overview",
        label: "Overview",
        iconName: "information",
      },
      {
        key: "operations",
        label: "Operations",
        iconName: "calendar",
        items: [
          { key: "review", label: "Review queue" },
          { key: "approvals", label: "Approvals" },
        ],
      },
      {
        key: "inbox",
        label: "Inbox",
        iconName: "warning",
      },
    ],
  },
];

function renderNavigationList(
  props: Partial<{
    direction: "ltr" | "rtl";
    groups: NavigationListGroup[];
    items: NavigationListItem[];
    onValueChange: (value: string, item: NavigationListItem) => void;
    collapsed: boolean;
    defaultExpandedKeys: string[];
    defaultValue: string;
  }> = {},
) {
  const {
    collapsed = false,
    defaultExpandedKeys = [],
    defaultValue,
    direction = "ltr",
    groups = navigationGroups,
    items,
    onValueChange,
  } = props;

  return render(
    <ThemeProvider direction={direction}>
      <NavigationList
        aria-label="Workspace navigation"
        collapsed={collapsed}
        defaultExpandedKeys={defaultExpandedKeys}
        defaultValue={defaultValue}
        groups={groups}
        items={items}
        onValueChange={onValueChange}
      />
    </ThemeProvider>,
  );
}

describe("NavigationList", () => {
  it("renders grouped navigation, toggles parent expansion, and reports value changes", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<
      (value: string, item: NavigationListItem) => void
    >();

    renderNavigationList({ onValueChange: handleValueChange });

    expect(screen.getByText("Workspace")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /operations/i }));

    expect(handleValueChange).toHaveBeenCalledWith(
      "operations",
      expect.objectContaining({ key: "operations" }),
    );
    expect(screen.getByRole("button", { name: /review queue/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /approvals/i }));

    expect(handleValueChange).toHaveBeenLastCalledWith(
      "approvals",
      expect.objectContaining({ key: "approvals" }),
    );
    expect(screen.getByRole("button", { name: /approvals/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("supports arrow-key navigation, expansion, and parent return in LTR", async () => {
    const user = userEvent.setup();

    renderNavigationList();

    const overviewButton = screen.getByRole("button", { name: /overview/i });

    overviewButton.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: /operations/i })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /review queue/i })).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /review queue/i })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: /approvals/i })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: /operations/i })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /review queue/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("mirrors expand and collapse keys in RTL", async () => {
    const user = userEvent.setup();

    renderNavigationList({ direction: "rtl" });

    const operationsButton = screen.getByRole("button", { name: /operations/i });

    operationsButton.focus();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("button", { name: /review queue/i })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: /review queue/i })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(operationsButton).toHaveFocus();
  });

  it("collapses to a top-level icon rail while keeping branch selection on the active ancestor", () => {
    renderNavigationList({
      collapsed: true,
      defaultExpandedKeys: ["operations"],
      defaultValue: "approvals",
    });

    expect(
      screen.queryByRole("button", { name: /approvals/i }),
    ).not.toBeInTheDocument();

    const operationsButton = screen.getByRole("button", { name: /operations/i });

    expect(operationsButton).toHaveAttribute("data-active-branch", "true");
    expect(screen.getByRole("tree")).toHaveAttribute("data-collapsed", "true");
  });
});
