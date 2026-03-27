import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { StackedBarMicroChart } from "./stacked-bar-microchart";

describe("StackedBarMicroChart", () => {
  it("renders segments, legend, and a readable aria label", () => {
    const { container } = render(
      <StackedBarMicroChart
        heading="Order mix"
        legendLayout="grid"
        segments={[
          {
            key: "committed",
            label: "Committed",
            tone: "success",
            value: 48,
          },
          {
            key: "projected",
            label: "Projected",
            tone: "information",
            value: 32,
          },
        ]}
        showLegend
        supportingText="Quarter close composition"
        total={100}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Order mix, Quarter close composition, Committed 48%, Projected 32%",
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-layout", "grid");
    expect(container.querySelector(".ax-stacked-bar-microchart__segment[data-tone='success']")).toBeTruthy();
    expect(container.querySelector(".ax-stacked-bar-microchart__segment--remainder")).toBeTruthy();
  });

  it("shows an empty state when no positive segment values are available", () => {
    render(
      <StackedBarMicroChart
        heading="Pipeline mix"
        labelMode="none"
        segments={[
          {
            key: "zero",
            label: "Zero",
            value: 0,
          },
          {
            key: "negative",
            label: "Negative",
            value: -4,
          },
        ]}
      />,
    );

    expect(screen.getByText("No segment data")).toBeInTheDocument();
  });

  it("supports compact density, long labels, and normalized series colors", () => {
    const longLabel = "Weekend recovery allocation with premium logistics capacity";

    const { container } = render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <StackedBarMicroChart
          labelMode="full"
          segments={[
            {
              key: "series",
              label: longLabel,
              series: 8,
              value: 12,
              valueDisplay: "12 lots",
            },
            {
              key: "support",
              description: "Manual fallback coverage",
              label: "Support",
              tone: "warning",
              value: 6,
            },
          ]}
          size="sm"
        />
      </ThemeProvider>,
    );

    expect(screen.getByTitle(longLabel)).toBeInTheDocument();
    expect(screen.getByText("12 lots")).toBeInTheDocument();
    expect(container.querySelector(".ax-stacked-bar-microchart__summary-item[data-series='2']")).toBeTruthy();
    expect(container.querySelector(".ax-chart-surface")).toHaveAttribute(
      "data-size",
      "sm",
    );
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
  });
});
