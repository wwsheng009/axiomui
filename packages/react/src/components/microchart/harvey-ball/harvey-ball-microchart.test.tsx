import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { HarveyBallMicroChart } from "./harvey-ball-microchart";

describe("HarveyBallMicroChart", () => {
  it("renders labeled segments, a legend, and a readable chart label", () => {
    const { container } = render(
      <HarveyBallMicroChart
        heading="Coverage mix"
        legendLayout="grid"
        segments={[
          {
            key: "ready",
            label: "Ready",
            fraction: 0.75,
            tone: "success",
          },
          {
            key: "watch",
            label: "Watch",
            fraction: 0.45,
            tone: "warning",
          },
        ]}
        showLegend
        supportingText="Regional readiness profile"
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Coverage mix, Regional readiness profile, Ready 75%, Watch 45%",
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-layout", "grid");
    expect(container.querySelector(".ax-harvey-ball-microchart__item[data-tone='success']")).toBeTruthy();
    expect(screen.getAllByText("Ready")).toHaveLength(2);
  });

  it("clamps segment fractions to the supported 0-1 range", () => {
    const { container } = render(
      <HarveyBallMicroChart
        heading="Quality posture"
        segments={[
          {
            key: "overflow",
            label: "Overflow",
            fraction: 1.4,
            tone: "brand",
          },
          {
            key: "empty",
            label: "Empty",
            fraction: -0.2,
            tone: "neutral",
          },
        ]}
      />,
    );

    const items = container.querySelectorAll(".ax-harvey-ball-microchart__item");

    expect(items[0]).toHaveAttribute("data-ratio", "1.0000");
    expect(items[1]).toHaveAttribute("data-ratio", "0.0000");
  });

  it("supports compact density, long labels, and custom value displays", () => {
    const longLabel = "Backorder recovery allocation with weekend freight override";

    render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <HarveyBallMicroChart
          segments={[
            {
              key: "allocation",
              label: longLabel,
              fraction: 0.625,
              tone: "information",
              valueDisplay: "5 / 8 lots",
            },
          ]}
          size="sm"
        />
      </ThemeProvider>,
    );

    expect(screen.getByTitle(longLabel)).toBeInTheDocument();
    expect(screen.getByText("5 / 8 lots")).toBeInTheDocument();
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
  });
});
