import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { ObjectStatus } from "./object-status";

describe("ObjectStatus", () => {
  it("renders tone semantics and the default icon for semantic statuses", () => {
    const { container } = render(
      <ObjectStatus label="On track" tone="success" />,
    );

    expect(screen.getByText("On track")).toBeInTheDocument();
    expect(container.querySelector(".ax-object-status")).toHaveAttribute(
      "data-tone",
      "success",
    );
    expect(container.querySelector(".ax-object-status__icon .ax-icon")).toBeTruthy();
  });

  it("renders cleanly in compact density", () => {
    render(
      <ThemeProvider density="compact">
        <ObjectStatus label="Needs attention" tone="warning" />
      </ThemeProvider>,
    );

    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
  });
});
