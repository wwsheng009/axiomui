import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import {
  NavigationList,
  type NavigationListGroup,
} from "../navigation-list/navigation-list";
import { SideNavigation } from "../side-navigation/side-navigation";
import { ToolHeader } from "../tool-header/tool-header";
import { ToolPage } from "./tool-page";

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
    ],
  },
];

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });

  window.dispatchEvent(new Event("resize"));
}

function buildSideNavigation() {
  return (
    <SideNavigation
      header={<strong>Workspace</strong>}
      navigation={
        <NavigationList
          aria-label="Workspace navigation"
          defaultExpandedKeys={["operations"]}
          defaultValue="review"
          groups={navigationGroups}
        />
      }
    />
  );
}

describe("ToolPage", () => {
  it("renders header, side navigation, side content, and a scrollable main area", () => {
    setViewportWidth(1280);

    render(
      <ThemeProvider>
        <ToolPage
          header={<ToolHeader title="Operations workspace" />}
          sideContent={<div>Shift handover</div>}
          sideNavigation={buildSideNavigation()}
        >
          <div>Main content</div>
        </ToolPage>
      </ThemeProvider>,
    );

    expect(screen.getByText("Operations workspace")).toBeInTheDocument();
    expect(screen.getByText("Shift handover")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("data-scrollable", "true");
    expect(screen.getByText("Operations workspace").closest(".ax-tool-page__header")).toHaveAttribute(
      "data-sticky",
      "true",
    );
  });

  it("controls collapsed state for a composed SideNavigation and reports changes", async () => {
    const user = userEvent.setup();
    const handleCollapsedChange = vi.fn<(collapsed: boolean) => void>();
    const { container } = render(
      <ThemeProvider>
        <ToolPage
          onCollapsedChange={handleCollapsedChange}
          sideNavigation={buildSideNavigation()}
        >
          <div>Main content</div>
        </ToolPage>
      </ThemeProvider>,
    );

    expect(container.querySelector(".ax-tool-page")).toHaveAttribute(
      "data-collapsed",
      "false",
    );
    expect(screen.getByRole("tree")).toHaveAttribute("data-collapsed", "false");

    await user.click(screen.getByRole("button", { name: /collapse navigation/i }));

    await waitFor(() => {
      expect(handleCollapsedChange).toHaveBeenCalledWith(true);
    });
    expect(container.querySelector(".ax-tool-page")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    expect(screen.getByRole("tree")).toHaveAttribute("data-collapsed", "true");
  });

  it("marks the layout as mobile when the viewport crosses the breakpoint", async () => {
    setViewportWidth(560);
    const { container } = render(
      <ThemeProvider>
        <ToolPage mobileBreakpoint={720} sideNavigation={buildSideNavigation()}>
          <div>Main content</div>
        </ToolPage>
      </ThemeProvider>,
    );

    expect(container.querySelector(".ax-tool-page")).toHaveAttribute(
      "data-mobile",
      "true",
    );

    setViewportWidth(1024);

    await waitFor(() => {
      expect(container.querySelector(".ax-tool-page")).toHaveAttribute(
        "data-mobile",
        "false",
      );
    });
  });
});
