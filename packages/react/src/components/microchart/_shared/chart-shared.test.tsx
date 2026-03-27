import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { ChartLegend } from "./chart-legend";
import { ChartSurface } from "./chart-surface";
import {
  buildChartAriaLabel,
  formatChartValueText,
  getChartSeriesToken,
  getChartToneToken,
} from "./chart-utils";

describe("Chart shared primitives", () => {
  it("renders chart surface slots and size attributes", () => {
    const { container } = render(
      <ChartSurface
        eyebrow="KPI"
        footer={<span>Updated every 15 minutes</span>}
        heading="Revenue execution"
        size="lg"
        supportingText="Shared chart surface for future KPI cards."
        trend="+4.2 pts"
        value="72.5%"
      >
        <div>Mini chart body</div>
      </ChartSurface>,
    );

    expect(screen.getByText("Revenue execution")).toBeInTheDocument();
    expect(screen.getByText("72.5%")).toBeInTheDocument();
    expect(screen.getByText("Mini chart body")).toBeInTheDocument();
    expect(screen.getByText("Updated every 15 minutes")).toBeInTheDocument();
    expect(container.querySelector(".ax-chart-surface")).toHaveAttribute(
      "data-size",
      "lg",
    );
  });

  it("renders chart legend items in themed compact density", () => {
    const { container } = render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <ChartLegend
          aria-label="Pipeline legend"
          layout="grid"
          items={[
            {
              key: "brand",
              label: "Committed",
              tone: "brand",
              value: "72%",
            },
            {
              key: "series",
              description: "Forecast refresh",
              label: "Projected",
              series: 8,
              value: "18%",
            },
          ]}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole("list", { name: "Pipeline legend" })).toHaveAttribute(
      "data-layout",
      "grid",
    );
    expect(screen.getByText("Committed")).toBeInTheDocument();
    expect(screen.getByText("Forecast refresh")).toBeInTheDocument();
    expect(container.querySelector(".ax-chart-legend__item[data-tone='brand']")).toBeTruthy();
    expect(container.querySelector(".ax-chart-legend__item[data-series='2']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
  });

  it("formats shared chart helper text and token lookups", () => {
    expect(
      formatChartValueText(12345.6, {
        locale: "en-US",
        maximumFractionDigits: 1,
        notation: "compact",
      }),
    ).toBe("12.3K");

    expect(
      formatChartValueText(-4.2, {
        locale: "en-US",
        maximumFractionDigits: 1,
        signDisplay: "always",
        suffix: " pts",
      }),
    ).toBe("-4.2 pts");

    expect(
      buildChartAriaLabel({
        description: "Updated hourly",
        footerText: "Target 75%",
        title: "Revenue execution",
        trendText: "+4.2 pts",
        valueText: "72.5%",
      }),
    ).toBe("Revenue execution, Updated hourly, 72.5%, +4.2 pts, Target 75%");

    expect(getChartToneToken("warning", true)).toBe(
      "var(--ax-chart-tone-warning-soft)",
    );
    expect(getChartSeriesToken(8)).toBe("var(--ax-chart-series-2)");
  });
});
