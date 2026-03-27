import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { DeltaMicroChart } from "./delta-microchart";

describe("DeltaMicroChart", () => {
  it("derives upward direction and accessible label from a positive delta", () => {
    const { container } = render(
      <DeltaMicroChart
        heading="Pipeline delta"
        supportingText="Compared with last quarter"
        trend="+3.2 pts vs baseline"
        value={6.4}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Pipeline delta, Compared with last quarter, Increase +6.4, +3.2 pts vs baseline",
    );
    expect(container.querySelector(".ax-delta-microchart__figure")).toHaveAttribute(
      "data-direction",
      "up",
    );
    expect(container.querySelector(".ax-delta-microchart__figure")).toHaveAttribute(
      "data-tone",
      "success",
    );
  });

  it("clamps the visual magnitude when the value exceeds the configured scale", () => {
    const { container } = render(
      <DeltaMicroChart
        heading="Margin drift"
        scaleMax={10}
        value={-18}
      />,
    );

    expect(container.querySelector(".ax-delta-microchart__figure")).toHaveAttribute(
      "data-direction",
      "down",
    );
    expect(container.querySelector(".ax-delta-microchart__figure")).toHaveAttribute(
      "data-magnitude",
      "1.0000",
    );
    expect(container.querySelector(".ax-delta-microchart__figure")).toHaveAttribute(
      "data-tone",
      "error",
    );
  });

  it("supports flat direction, compact density, and custom display values", () => {
    const { container } = render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <DeltaMicroChart
          direction="flat"
          heading="Escalation drift"
          size="sm"
          value={0}
          valueDisplay="Stable"
        />
      </ThemeProvider>,
    );

    expect(screen.getAllByText("Stable")).toHaveLength(2);
    expect(container.querySelector(".ax-delta-microchart__figure")).toHaveAttribute(
      "data-direction",
      "flat",
    );
    expect(container.querySelector(".ax-chart-surface")).toHaveAttribute(
      "data-size",
      "sm",
    );
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
  });
});
