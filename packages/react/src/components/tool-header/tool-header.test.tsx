import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToolHeader } from "./tool-header";

describe("ToolHeader", () => {
  it("renders start, title, navigation, actions, and meta with sticky state", () => {
    const { container } = render(
      <ToolHeader
        actions={<button type="button">Run checks</button>}
        meta={<span>Inbox 3</span>}
        navigation={<button type="button">Overview</button>}
        start={<button type="button">Menu</button>}
        sticky
        title="Operations workspace"
      />,
    );

    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByText("Operations workspace")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run checks" })).toBeInTheDocument();
    expect(screen.getByText("Inbox 3")).toBeInTheDocument();
    expect(container.querySelector(".ax-tool-header")).toHaveAttribute(
      "data-sticky",
      "true",
    );
  });

  it("renders only the supplied slots", () => {
    const { container } = render(
      <ToolHeader title="Operations workspace" />,
    );

    expect(screen.getByText("Operations workspace")).toBeInTheDocument();
    expect(container.querySelector(".ax-tool-header__nav")).toBeNull();
    expect(container.querySelector(".ax-tool-header__actions")).toBeNull();
    expect(container.querySelector(".ax-tool-header__meta")).toBeNull();
  });
});
