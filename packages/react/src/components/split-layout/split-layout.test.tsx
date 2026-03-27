import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SplitLayout } from "./split-layout";

describe("SplitLayout", () => {
  it("renders pane headers, descriptions, toolbars, and body content", () => {
    const { container } = render(
      <SplitLayout
        primary={{
          title: "Worklist",
          description: "Primary scan pane",
          toolbar: <button type="button">Focus list</button>,
          content: <div>Primary content</div>,
        }}
        secondary={{
          title: "Detail",
          description: "Secondary review pane",
          toolbar: <button type="button">Edit detail</button>,
          content: <div>Secondary content</div>,
        }}
        tertiary={{
          title: "Context",
          description: "Tertiary signals pane",
          toolbar: <button type="button">Open context</button>,
          content: <div>Tertiary content</div>,
        }}
      />,
    );

    expect(screen.getByText("Worklist")).toBeInTheDocument();
    expect(screen.getByText("Primary scan pane")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Focus list" })).toBeInTheDocument();
    expect(screen.getByText("Secondary content")).toBeInTheDocument();
    expect(screen.getByText("Tertiary content")).toBeInTheDocument();
    expect(container.querySelector(".ax-split-layout")).toHaveAttribute(
      "data-pane-count",
      "3",
    );
  });

  it("marks non-active panes as hidden on the mobile-state attributes", () => {
    const { container } = render(
      <SplitLayout
        activePane="secondary"
        primary={{ content: <div>Primary content</div> }}
        secondary={{ content: <div>Secondary content</div> }}
        secondaryWidth="wide"
        tertiary={{ content: <div>Tertiary content</div> }}
      />,
    );

    const paneWraps = container.querySelectorAll(".ax-split-layout__pane-wrap");

    expect(container.querySelector(".ax-split-layout")).toHaveAttribute(
      "data-has-active-pane",
      "true",
    );
    expect(container.querySelector(".ax-split-layout")).toHaveAttribute(
      "data-secondary-width",
      "wide",
    );
    expect(paneWraps[0]).toHaveAttribute("data-mobile-hidden", "true");
    expect(paneWraps[1]).toHaveAttribute("data-mobile-hidden", "false");
    expect(paneWraps[2]).toHaveAttribute("data-mobile-hidden", "true");
  });
});
