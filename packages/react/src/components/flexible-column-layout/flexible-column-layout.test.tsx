import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FlexibleColumnLayout } from "./flexible-column-layout";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });

  window.dispatchEvent(new Event("resize"));
}

function buildColumns() {
  return {
    beginColumn: {
      title: "List",
      content: (
        <div>
          <button type="button">Open item</button>
        </div>
      ),
    },
    midColumn: {
      title: "Detail",
      content: (
        <div>
          <button type="button">Approve item</button>
        </div>
      ),
    },
    endColumn: {
      title: "Context",
      content: (
        <div>
          <button type="button">Open logs</button>
        </div>
      ),
    },
  };
}

describe("FlexibleColumnLayout", () => {
  it("infers a two-column begin-expanded layout when begin and mid columns are provided", () => {
    setViewportWidth(1280);
    const { container } = render(
      <FlexibleColumnLayout
        beginColumn={buildColumns().beginColumn}
        midColumn={buildColumns().midColumn}
      />,
    );

    expect(container.querySelector(".ax-flexible-column-layout")).toHaveAttribute(
      "data-layout",
      "two-columns-begin-expanded",
    );
    expect(
      container.querySelector('[data-column="begin"]'),
    ).not.toHaveAttribute("hidden");
    expect(
      container.querySelector('[data-column="mid"]'),
    ).not.toHaveAttribute("hidden");
    expect(
      container.querySelector('[data-column="end"]'),
    ).not.toBeInTheDocument();
  });

  it("switches visibility when the layout changes between three and two columns", () => {
    setViewportWidth(1280);
    const { beginColumn, endColumn, midColumn } = buildColumns();
    const { container, rerender } = render(
      <FlexibleColumnLayout
        beginColumn={beginColumn}
        endColumn={endColumn}
        layout="three-columns-end-expanded"
        midColumn={midColumn}
      />,
    );

    expect(container.querySelector(".ax-flexible-column-layout")).toHaveAttribute(
      "data-layout",
      "three-columns-end-expanded",
    );
    expect(
      container.querySelector('[data-column="end"]'),
    ).not.toHaveAttribute("hidden");

    rerender(
      <FlexibleColumnLayout
        beginColumn={beginColumn}
        endColumn={endColumn}
        layout="two-columns-mid-expanded"
        midColumn={midColumn}
      />,
    );

    expect(container.querySelector(".ax-flexible-column-layout")).toHaveAttribute(
      "data-layout",
      "two-columns-mid-expanded",
    );
    expect(container.querySelector('[data-column="end"]')).toHaveAttribute("hidden");
  });

  it("shows only the requested mobile column and keeps focus in the visible pane", async () => {
    const user = userEvent.setup();
    setViewportWidth(560);
    const { beginColumn, endColumn, midColumn } = buildColumns();

    const { container } = render(
      <FlexibleColumnLayout
        beginColumn={beginColumn}
        endColumn={endColumn}
        layout="three-columns-mid-expanded"
        midColumn={midColumn}
        mobileBreakpoint={720}
        mobileColumn="mid"
      />,
    );

    expect(container.querySelector(".ax-flexible-column-layout")).toHaveAttribute(
      "data-mobile",
      "true",
    );
    expect(container.querySelector('[data-column="begin"]')).toHaveAttribute("hidden");
    expect(
      container.querySelector('[data-column="mid"]'),
    ).not.toHaveAttribute("hidden");
    expect(container.querySelector('[data-column="end"]')).toHaveAttribute("hidden");

    await user.tab();
    expect(screen.getByRole("button", { name: /approve item/i })).toHaveFocus();

    setViewportWidth(1280);

    await waitFor(() => {
      expect(container.querySelector(".ax-flexible-column-layout")).toHaveAttribute(
        "data-mobile",
        "false",
      );
    });
  });
});
