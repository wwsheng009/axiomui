import { render, screen } from "@testing-library/react";
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

describe("Chart regression smoke", () => {
  it("renders the chart family in compact dark rtl mode", () => {
    const { container } = render(
      <ThemeProvider density="compact" direction="rtl" theme="horizon_dark">
        <div>
          <BulletMicroChart
            actual={74}
            forecast={86}
            heading="Attainment"
            showLabels={false}
            size="sm"
            target={80}
          />
          <RadialMicroChart
            centerLabel="Healthy"
            heading="Coverage"
            size="sm"
            status="success"
            total={100}
            value={78}
            valueDisplay="78%"
          />
          <DeltaMicroChart
            heading="SLA delta"
            scaleMax={8}
            size="sm"
            value={-2.4}
            valueDisplay="-2.4 hrs"
          />
          <HarveyBallMicroChart
            heading="Lane coverage"
            segments={[
              {
                key: "api",
                label: "API",
                fraction: 0.75,
                tone: "brand",
              },
              {
                key: "ops",
                label: "Ops",
                fraction: 0.5,
                tone: "warning",
              },
            ]}
            size="sm"
          />
          <StackedBarMicroChart
            heading="Workstream mix"
            labelMode="none"
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
                value: 26,
              },
              {
                key: "watch",
                label: "Watch",
                tone: "warning",
                value: 14,
              },
            ]}
            size="sm"
            total={100}
          />
          <InteractiveDonutChart
            heading="Readiness split"
            segments={[
              {
                key: "ready",
                label: "Ready",
                tone: "success",
                value: 52,
              },
              {
                key: "watch",
                label: "Watch",
                tone: "warning",
                value: 28,
              },
              {
                key: "blocked",
                label: "Blocked",
                tone: "error",
                value: 20,
              },
            ]}
            size="sm"
            value="3 states"
          />
          <InteractiveLineChart
            heading="Checkpoint trend"
            points={[
              { key: "c1", label: "C1", value: 14 },
              { key: "c2", label: "C2", tone: "information", value: 11 },
              { key: "c3", label: "C3", tone: "success", value: 7 },
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
            heading="Recovery summary"
            indicators={[
              {
                key: "forecast",
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
      </ThemeProvider>,
    );

    expect(screen.getByText("Attainment")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("SLA delta")).toBeInTheDocument();
    expect(screen.getByText("Lane coverage")).toBeInTheDocument();
    expect(screen.getByText("Workstream mix")).toBeInTheDocument();
    expect(screen.getByText("Readiness split")).toBeInTheDocument();
    expect(screen.getByText("Checkpoint trend")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recovery summary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ready/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /c1/i })).toBeInTheDocument();
    expect(container.querySelectorAll(".ax-chart-surface").length).toBeGreaterThanOrEqual(8);
    expect(container.querySelectorAll("[role='img']").length).toBeGreaterThanOrEqual(6);
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
    expect(document.querySelector("[dir='rtl']")).toBeTruthy();
  });
});
