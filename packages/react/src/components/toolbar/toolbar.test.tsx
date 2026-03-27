import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Toolbar } from "./toolbar";

describe("Toolbar", () => {
  it("renders headline, supporting text, and all slots with variant state", () => {
    const { container } = render(
      <Toolbar
        end={<button type="button">Approve</button>}
        headline="Delivery summary"
        middle={<span>3 alerts</span>}
        start={<button type="button">Scope</button>}
        sticky
        supportingText="Header stays above the work area."
        variant="header"
      />,
    );

    expect(screen.getByRole("button", { name: "Scope" })).toBeInTheDocument();
    expect(screen.getByText("Delivery summary")).toBeInTheDocument();
    expect(screen.getByText("Header stays above the work area.")).toBeInTheDocument();
    expect(screen.getByText("3 alerts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(container.querySelector(".ax-toolbar")).toHaveAttribute(
      "data-variant",
      "header",
    );
    expect(container.querySelector(".ax-toolbar")).toHaveAttribute(
      "data-sticky",
      "true",
    );
  });

  it("omits the headline wrapper when no heading copy is provided", () => {
    const { container } = render(
      <Toolbar middle={<span>Middle only</span>} />,
    );

    expect(screen.getByText("Middle only")).toBeInTheDocument();
    expect(container.querySelector(".ax-toolbar__headline")).toBeNull();
  });
});
