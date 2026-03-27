import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { InteractiveDonutChart } from "./interactive-donut-chart";

describe("InteractiveDonutChart", () => {
  it("activates segments through click and reports the active key", async () => {
    const user = userEvent.setup();
    const handleActiveChange = vi.fn();
    const handleSegmentClick = vi.fn();

    render(
      <InteractiveDonutChart
        heading="Capacity mix"
        onActiveChange={handleActiveChange}
        onSegmentClick={handleSegmentClick}
        segments={[
          { key: "ready", label: "Ready", tone: "success", value: 48 },
          { key: "watch", label: "Watch", tone: "warning", value: 24 },
        ]}
        total={100}
      />,
    );

    const watchButton = screen.getByRole("button", { name: /watch/i });

    await user.click(watchButton);

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Capacity mix, Ready 48%, Watch 24%",
    );
    expect(watchButton).toHaveAttribute("aria-pressed", "true");
    expect(handleActiveChange).toHaveBeenLastCalledWith(
      "watch",
      expect.objectContaining({ key: "watch" }),
    );
    expect(handleSegmentClick).toHaveBeenLastCalledWith(
      expect.objectContaining({ key: "watch" }),
    );
  });

  it("supports hover highlighting and arrow-key navigation across segments", async () => {
    const user = userEvent.setup();

    render(
      <InteractiveDonutChart
        heading="Revenue split"
        segments={[
          { key: "direct", label: "Direct", tone: "brand", value: 42 },
          { key: "partner", label: "Partner", tone: "information", value: 36 },
          { key: "services", label: "Services", tone: "neutral", value: 22 },
        ]}
      />,
    );

    const [directArc, partnerArc] = document.querySelectorAll(
      ".ax-interactive-donut-chart__segment",
    );
    const directButton = screen.getByRole("button", { name: /direct/i });
    const partnerButton = screen.getByRole("button", { name: /partner/i });

    fireEvent.mouseEnter(partnerArc);
    expect(partnerButton).toHaveAttribute("aria-pressed", "true");
    fireEvent.mouseLeave(partnerArc);

    directButton.focus();
    await user.keyboard("{ArrowRight}");
    expect(partnerButton).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(partnerButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.mouseEnter(directArc);
    expect(directButton).toHaveAttribute("aria-pressed", "true");
  });

  it("supports Home and End navigation and falls back cleanly for empty datasets", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <InteractiveDonutChart
        heading="Recovery split"
        segments={[
          { key: "ready", label: "Ready", tone: "success", value: 52 },
          { key: "watch", label: "Watch", tone: "warning", value: 28 },
          { key: "blocked", label: "Blocked", tone: "error", value: 20 },
        ]}
      />,
    );

    const readyButton = screen.getByRole("button", { name: /ready/i });
    const watchButton = screen.getByRole("button", { name: /watch/i });
    const blockedButton = screen.getByRole("button", { name: /blocked/i });

    watchButton.focus();
    await user.keyboard("{End}");
    expect(blockedButton).toHaveFocus();
    await user.keyboard("{Home}");
    expect(readyButton).toHaveFocus();

    rerender(
      <InteractiveDonutChart
        heading="Recovery split"
        segments={[]}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Recovery split, No segment data",
    );
    expect(screen.getByText("No segment data")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("supports compact density and custom center content in a controlled state", () => {
    const { container } = render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <InteractiveDonutChart
          activeKey="partner"
          centerLabel="Focus"
          centerValue="36%"
          segments={[
            { key: "direct", label: "Direct", tone: "brand", value: 42 },
            { key: "partner", label: "Partner", tone: "information", value: 36 },
          ]}
          size="sm"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("36%")).toBeInTheDocument();
    expect(screen.getByText("Focus")).toBeInTheDocument();
    expect(container.querySelector(".ax-chart-surface")).toHaveAttribute(
      "data-size",
      "sm",
    );
    expect(
      screen.getByRole("button", { name: /partner/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
  });
});
