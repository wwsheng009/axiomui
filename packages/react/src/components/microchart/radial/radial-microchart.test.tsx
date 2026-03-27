import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { RadialMicroChart } from "./radial-microchart";

describe("RadialMicroChart", () => {
  it("renders 0 and 100 percent boundaries with clamped progress ratios", () => {
    const { rerender, container } = render(
      <RadialMicroChart
        centerLabel="Cold start"
        heading="Fulfillment health"
        total={100}
        value={0}
      />,
    );

    expect(container.querySelector(".ax-radial-microchart__figure")).toHaveAttribute(
      "data-ratio",
      "0.0000",
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Fulfillment health, Cold start, 0 of 100 (0%)",
    );

    rerender(
      <RadialMicroChart
        centerLabel="Goal met"
        heading="Fulfillment health"
        total={100}
        value={100}
      />,
    );

    expect(container.querySelector(".ax-radial-microchart__figure")).toHaveAttribute(
      "data-ratio",
      "1.0000",
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders center labels and custom center value content", () => {
    render(
      <RadialMicroChart
        centerLabel="Healthy"
        centerValue="14 / 18"
        heading="Deployment readiness"
        status="success"
        total={18}
        value={14}
      />,
    );

    expect(screen.getByText("14 / 18")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("maps semantic status to chart figure state", () => {
    const { container } = render(
      <RadialMicroChart
        centerLabel="At risk"
        heading="Margin guardrail"
        status="warning"
        total={100}
        value={42}
      />,
    );

    expect(container.querySelector(".ax-radial-microchart__figure")).toHaveAttribute(
      "data-status",
      "warning",
    );
  });

  it("renders small size variants cleanly inside compact density", () => {
    const { container } = render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <RadialMicroChart
          centerLabel="Watch"
          heading="Header KPI"
          size="sm"
          status="information"
          total={24}
          value={18}
          valueDisplay="75%"
        />
      </ThemeProvider>,
    );

    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
    expect(container.querySelector(".ax-chart-surface")).toHaveAttribute(
      "data-size",
      "sm",
    );
    expect(screen.getAllByText("75%")).toHaveLength(2);
  });
});
