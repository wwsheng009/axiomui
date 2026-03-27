import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { BulletMicroChart } from "./bullet-microchart";

describe("BulletMicroChart", () => {
  it("renders actual, forecast and target markers with a readable chart label", () => {
    const { container } = render(
      <BulletMicroChart
        actual={72}
        forecast={84}
        heading="Delivery health"
        ranges={[
          { key: "low", tone: "error", value: 45 },
          { key: "mid", tone: "warning", value: 75 },
          { key: "high", tone: "success", value: 100 },
        ]}
        supportingText="North Asia fulfillment window"
        target={80}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Delivery health, North Asia fulfillment window, Actual 72, Forecast 84, Target 80",
    );
    expect(container.querySelector(".ax-bullet-microchart__actual")).toBeTruthy();
    expect(container.querySelector(".ax-bullet-microchart__forecast")).toBeTruthy();
    expect(container.querySelector(".ax-bullet-microchart__target")).toBeTruthy();
    expect(screen.getAllByText("72")).toHaveLength(2);
  });

  it("renders range tones and default labels for summary items", () => {
    const { container } = render(
      <BulletMicroChart
        actual={68}
        forecast={76}
        ranges={[
          { key: "base", tone: "neutral", value: 30 },
          { key: "watch", tone: "warning", value: 65 },
          { key: "good", tone: "success", value: 100 },
        ]}
        target={74}
      />,
    );

    expect(container.querySelector(".ax-bullet-microchart__range[data-tone='warning']")).toBeTruthy();
    expect(container.querySelector(".ax-bullet-microchart__range[data-tone='success']")).toBeTruthy();
    expect(screen.getByText("Actual")).toBeInTheDocument();
    expect(screen.getByText("Forecast")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
  });

  it("clamps extreme values to the configured scale and skips empty metrics", () => {
    const { container } = render(
      <BulletMicroChart
        actual={140}
        forecast={-20}
        max={100}
        min={0}
        showLabels={false}
      />,
    );

    expect(container.querySelector(".ax-bullet-microchart__actual")).toHaveStyle({
      width: "100%",
    });
    expect(container.querySelector(".ax-bullet-microchart__forecast")).toHaveStyle({
      width: "0%",
    });
    expect(container.querySelector(".ax-bullet-microchart__target")).toBeNull();
    expect(container.querySelector(".ax-bullet-microchart__summary")).toBeNull();
  });

  it("supports custom labels, truncation titles and compact density", () => {
    const longLabel = "Forecast remaining fulfillment capacity for weekend window";

    render(
      <ThemeProvider density="compact">
        <BulletMicroChart
          actual={52}
          actualLabel="Actual throughput"
          forecast={63}
          forecastLabel={longLabel}
          size="sm"
          target={70}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTitle(longLabel)).toBeInTheDocument();
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector(".ax-chart-surface[data-size='sm']")).toBeTruthy();
  });
});
