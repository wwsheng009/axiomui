import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { KpiCard } from "../../kpi-card/kpi-card";
import { BulletMicroChart } from "../bullet/bullet-microchart";
import { DeltaMicroChart } from "../delta/delta-microchart";
import { HarveyBallMicroChart } from "../harvey-ball/harvey-ball-microchart";
import { InteractiveDonutChart } from "../interactive-donut/interactive-donut-chart";
import { InteractiveLineChart } from "../interactive-line/interactive-line-chart";
import { RadialMicroChart } from "../radial/radial-microchart";
import { StackedBarMicroChart } from "../stacked-bar/stacked-bar-microchart";

function ChartMatrix() {
  return (
    <div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index}>
          <BulletMicroChart
            actual={68 + index}
            forecast={74 + index}
            heading={`Attainment ${index + 1}`}
            showLabels={false}
            size="sm"
            target={80}
          />
          <RadialMicroChart
            centerLabel="Healthy"
            heading={`Coverage ${index + 1}`}
            size="sm"
            status="success"
            total={100}
            value={72 + index}
            valueDisplay={`${72 + index}%`}
          />
          <DeltaMicroChart
            heading={`Delta ${index + 1}`}
            scaleMax={8}
            size="sm"
            value={index % 2 === 0 ? 2.4 + index : -2.4 - index}
          />
          <HarveyBallMicroChart
            heading={`Coverage mix ${index + 1}`}
            segments={[
              {
                key: `api-${index}`,
                label: "API",
                fraction: 0.75,
                tone: "brand",
              },
              {
                key: `ops-${index}`,
                label: "Ops",
                fraction: 0.5,
                tone: "warning",
              },
            ]}
            size="sm"
          />
          <StackedBarMicroChart
            heading={`Mix ${index + 1}`}
            labelMode="none"
            segments={[
              {
                key: `committed-${index}`,
                label: "Committed",
                tone: "success",
                value: 48,
              },
              {
                key: `projected-${index}`,
                label: "Projected",
                tone: "information",
                value: 26,
              },
              {
                key: `watch-${index}`,
                label: "Watch",
                tone: "warning",
                value: 14,
              },
            ]}
            size="sm"
            total={100}
          />
          <InteractiveDonutChart
            heading={`Readiness ${index + 1}`}
            segments={[
              {
                key: `ready-${index}`,
                label: "Ready",
                tone: "success",
                value: 52,
              },
              {
                key: `watch-${index}`,
                label: "Watch",
                tone: "warning",
                value: 28,
              },
              {
                key: `blocked-${index}`,
                label: "Blocked",
                tone: "error",
                value: 20,
              },
            ]}
            size="sm"
            value="3 states"
          />
          <InteractiveLineChart
            heading={`Trend ${index + 1}`}
            points={[
              { key: `c1-${index}`, label: "C1", value: 14 + index },
              {
                key: `c2-${index}`,
                label: "C2",
                tone: "information",
                value: 11 + index,
              },
              {
                key: `c3-${index}`,
                label: "C3",
                tone: "success",
                value: 7 + index,
              },
            ]}
            size="sm"
            value="3 checkpoints"
          />
          <KpiCard
            chart={
              <BulletMicroChart
                actual={74}
                forecast={86}
                showLabels={false}
                size="sm"
                target={80}
              />
            }
            heading={`Recovery summary ${index + 1}`}
            indicators={[
              {
                key: `forecast-${index}`,
                label: "Forecast",
                tone: "information",
                value: "86%",
              },
            ]}
            mainValue="74%"
            status="On plan"
            statusTone="success"
          />
        </div>
      ))}
    </div>
  );
}

describe("Chart performance baseline", () => {
  it("renders a multi-chart matrix within a conservative time budget", () => {
    const start = performance.now();
    const { container } = render(
      <ThemeProvider density="compact" direction="rtl" theme="horizon_dark">
        <ChartMatrix />
      </ThemeProvider>,
    );
    const duration = performance.now() - start;

    expect(container.querySelectorAll(".ax-chart-surface")).toHaveLength(32);
    expect(container.querySelectorAll(".ax-kpi-card")).toHaveLength(4);
    expect(duration).toBeLessThan(2000);
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
    expect(document.querySelector("[dir='rtl']")).toBeTruthy();
  });
});
