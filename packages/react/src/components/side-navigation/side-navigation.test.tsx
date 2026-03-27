import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import {
  NavigationList,
  type NavigationListGroup,
} from "../navigation-list/navigation-list";
import { SideNavigation } from "./side-navigation";

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

function buildNavigation() {
  return (
    <NavigationList
      aria-label="Workspace navigation"
      defaultExpandedKeys={["operations"]}
      defaultValue="review"
      groups={navigationGroups}
    />
  );
}

function ControlledSideNavigationHarness() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <ThemeProvider direction="rtl">
      <SideNavigation
        collapsed={collapsed}
        navigation={buildNavigation()}
        onCollapsedChange={setCollapsed}
        toggleLabelCollapse="收起导航"
        toggleLabelExpand="展开导航"
      />
    </ThemeProvider>
  );
}

describe("SideNavigation", () => {
  it("toggles collapsed state and propagates it into a composed NavigationList", async () => {
    const user = userEvent.setup();
    const handleCollapsedChange = vi.fn<(collapsed: boolean) => void>();
    const { container } = render(
      <ThemeProvider>
        <SideNavigation
          navigation={buildNavigation()}
          onCollapsedChange={handleCollapsedChange}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole("button", { name: /review queue/i })).toBeInTheDocument();
    expect(screen.getByRole("tree")).toHaveAttribute("data-collapsed", "false");

    await user.click(screen.getByRole("button", { name: /collapse navigation/i }));

    expect(handleCollapsedChange).toHaveBeenCalledWith(true);
    expect(container.querySelector(".ax-side-navigation")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    expect(screen.getByRole("tree")).toHaveAttribute("data-collapsed", "true");
    expect(
      screen.queryByRole("button", { name: /review queue/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /expand navigation/i })).toBeInTheDocument();
  });

  it("supports a controlled collapsed state and updates the toggle copy", async () => {
    const user = userEvent.setup();

    render(<ControlledSideNavigationHarness />);

    expect(screen.getByRole("tree")).toHaveAttribute("data-collapsed", "true");
    expect(screen.getByRole("button", { name: "展开导航" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "展开导航" }));

    expect(screen.getByRole("tree")).toHaveAttribute("data-collapsed", "false");
    expect(screen.getByRole("button", { name: "收起导航" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /review queue/i })).toBeInTheDocument();
  });

  it("keeps toggle-first tab order before the active navigation item", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <SideNavigation navigation={buildNavigation()} />
      </ThemeProvider>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: /collapse navigation/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /review queue/i })).toHaveFocus();
  });
});
