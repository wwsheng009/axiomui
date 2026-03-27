import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { BulletMicroChart } from "../microchart/bullet/bullet-microchart";
import { DeltaMicroChart } from "../microchart/delta/delta-microchart";
import { RadialMicroChart } from "../microchart/radial/radial-microchart";
import { StackedBarMicroChart } from "../microchart/stacked-bar/stacked-bar-microchart";
import { KpiCard } from "./kpi-card";

describe("KpiCard", () => {
  it("renders heading, main metric, chart slot, indicators, and footer", () => {
    const { container } = render(
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
        footer={<span>Updated every 15 minutes</span>}
        heading="Revenue attainment"
        indicators={[
          {
            key: "plan",
            label: "Plan",
            tone: "success",
            value: "80%",
          },
          {
            key: "risk",
            label: "Risk",
            tone: "warning",
            value: "3 accounts",
          },
        ]}
        mainValue="74%"
        secondaryValue="Quarter close"
        status="On plan"
        statusTone="success"
        trend="+12 pts forecast runway"
      />,
    );

    expect(screen.getByRole("heading", { name: "Revenue attainment" })).toBeInTheDocument();
    expect(screen.getByText("74%")).toBeInTheDocument();
    expect(screen.getByText("On plan")).toBeInTheDocument();
    expect(screen.getByText("Updated every 15 minutes")).toBeInTheDocument();
    expect(container.querySelector(".ax-bullet-microchart")).toBeTruthy();
    expect(container.querySelectorAll(".ax-kpi-card__indicator")).toHaveLength(2);
  });

  it("supports interactive tone variants and can host radial and delta charts", () => {
    const { container } = render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <div>
          <KpiCard
            chart={
              <RadialMicroChart
                centerLabel="Healthy"
                size="sm"
                status="success"
                total={128}
                value={103}
                valueDisplay="80.5%"
              />
            }
            heading="Deployment readiness"
            interactive
            mainValue="80.5%"
            tone="positive"
            trend="+9 pts"
          />
          <KpiCard
            chart={
              <DeltaMicroChart
                scaleMax={12}
                size="sm"
                value={8.4}
              />
            }
            heading="Backlog burn"
            mainValue="+8.4 pts"
            status="Recovering"
            statusTone="information"
            tone="brand"
          />
        </div>
      </ThemeProvider>,
    );

    const cards = container.querySelectorAll(".ax-kpi-card");

    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute("data-interactive", "true");
    expect(cards[0]).toHaveAttribute("data-tone", "positive");
    expect(cards[1]).toHaveAttribute("data-tone", "brand");
    expect(container.querySelector(".ax-radial-microchart")).toBeTruthy();
    expect(container.querySelector(".ax-delta-microchart")).toBeTruthy();
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
  });

  it("keeps indicator copy readable with longer descriptions", () => {
    render(
      <KpiCard
        heading="Regional summary"
        indicators={[
          {
            key: "buffer",
            description: "Fallback specialists reserved for late-stage recovery work",
            label: "Recovery buffer",
            tone: "information",
            value: "6 specialists",
          },
        ]}
        mainValue="$12.8M"
      />,
    );

    const indicator = screen.getByText("Recovery buffer").closest(
      ".ax-kpi-card__indicator",
    );

    expect(indicator).toBeTruthy();
    expect(within(indicator as HTMLElement).getByText("6 specialists")).toBeInTheDocument();
    expect(
      within(indicator as HTMLElement).getByText(
        "Fallback specialists reserved for late-stage recovery work",
      ),
    ).toBeInTheDocument();
  });

  it("exposes shell layout flags and can host stacked-bar chart content", () => {
    const { container } = render(
      <div>
        <KpiCard
          chart={
            <StackedBarMicroChart
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
              ]}
              size="sm"
              total={100}
            />
          }
          heading="Pipeline composition"
          indicators={[
            {
              key: "committed",
              label: "Committed",
              tone: "success",
              value: "48%",
            },
          ]}
          mainValue="74%"
          status="Tracked"
        />
        <KpiCard
          heading="Minimal summary"
          mainValue="12 items"
        />
      </div>,
    );

    const shells = container.querySelectorAll(".ax-kpi-card__shell");

    expect(shells).toHaveLength(2);
    expect(shells[0]).toHaveAttribute("data-has-chart", "true");
    expect(shells[0]).toHaveAttribute("data-has-indicators", "true");
    expect(shells[1]).toHaveAttribute("data-has-chart", "false");
    expect(shells[1]).toHaveAttribute("data-has-indicators", "false");
    expect(container.querySelector(".ax-stacked-bar-microchart")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Minimal summary" })).toBeInTheDocument();
    expect(screen.getByText("12 items")).toBeInTheDocument();
  });
});
