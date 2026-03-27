import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../../providers/theme-provider";
import { InteractiveLineChart } from "./interactive-line-chart";

describe("InteractiveLineChart", () => {
  it("renders point details, min/max markers, and click activation", async () => {
    const user = userEvent.setup();
    const handleActiveChange = vi.fn();

    const { container } = render(
      <InteractiveLineChart
        heading="Weekly trend"
        onActiveChange={handleActiveChange}
        points={[
          { key: "mon", label: "Mon", value: 12 },
          { key: "tue", label: "Tue", tone: "warning", value: 18 },
          { key: "wed", label: "Wed", tone: "success", value: 24 },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /tue/i }));

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Weekly trend, Mon 12, Tue 18, Wed 24",
    );
    expect(screen.getAllByText("18")).toHaveLength(2);
    expect(handleActiveChange).toHaveBeenLastCalledWith(
      "tue",
      expect.objectContaining({ key: "tue" }),
    );
    expect(container.querySelector(".ax-interactive-line-chart__point[data-extreme='min']")).toBeTruthy();
    expect(container.querySelector(".ax-interactive-line-chart__point[data-extreme='max']")).toBeTruthy();
  });

  it("supports hover details and arrow-key navigation across point buttons", async () => {
    const user = userEvent.setup();

    render(
      <InteractiveLineChart
        heading="Fulfillment trend"
        points={[
          { key: "w1", label: "Week 1", value: 14 },
          { key: "w2", label: "Week 2", value: 19 },
          { key: "w3", label: "Week 3", value: 23 },
        ]}
      />,
    );

    const week1Button = screen.getByRole("button", { name: /week 1/i });
    const week2Button = screen.getByRole("button", { name: /week 2/i });
    const [, week2Point] = document.querySelectorAll(
      ".ax-interactive-line-chart__point",
    );

    week1Button.focus();
    await user.keyboard("{ArrowRight}");
    expect(week2Button).toHaveFocus();

    fireEvent.mouseEnter(week2Point);
    expect(week2Button).toHaveAttribute("aria-pressed", "true");
    fireEvent.mouseLeave(week2Point);

    await user.keyboard("{Enter}");
    expect(week2Button).toHaveAttribute("aria-pressed", "true");
  });

  it("supports Home and End navigation and renders a stable empty state", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <InteractiveLineChart
        heading="SLA trend"
        points={[
          { key: "jan", label: "Jan", value: 9 },
          { key: "feb", label: "Feb", value: 13 },
          { key: "mar", label: "Mar", value: 15 },
        ]}
      />,
    );

    const janButton = screen.getByRole("button", { name: /jan/i });
    const febButton = screen.getByRole("button", { name: /feb/i });
    const marButton = screen.getByRole("button", { name: /mar/i });

    febButton.focus();
    await user.keyboard("{End}");
    expect(marButton).toHaveFocus();
    await user.keyboard("{Home}");
    expect(janButton).toHaveFocus();

    rerender(
      <InteractiveLineChart
        heading="SLA trend"
        points={[]}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "SLA trend, No point data",
    );
    expect(screen.getAllByText("No point data")).toHaveLength(2);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("supports compact density, controlled active key, and custom value display", () => {
    const { container } = render(
      <ThemeProvider density="compact" theme="horizon_dark">
        <InteractiveLineChart
          activeKey="w2"
          points={[
            { key: "w1", label: "Week 1", value: 12, valueDisplay: "12 lots" },
            { key: "w2", label: "Week 2", tone: "information", value: 16, valueDisplay: "16 lots" },
          ]}
          size="sm"
        />
      </ThemeProvider>,
    );

    expect(screen.getAllByText("16 lots")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /week 2/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".ax-chart-surface")).toHaveAttribute(
      "data-size",
      "sm",
    );
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
  });
});
