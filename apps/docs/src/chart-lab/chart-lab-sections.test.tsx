import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "@axiomui/react";

import { ChartLabDemoSections } from "./chart-lab-sections";

describe("ChartLabDemoSections", () => {
  it("renders the three business scenarios and supports drill-in changes from table and list interactions", () => {
    const { container } = render(
      <ThemeProvider density="compact" direction="rtl" theme="horizon_dark">
        <ChartLabDemoSections />
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: "Chart Lab" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "KPI cards wall" }).length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByRole("heading", { name: "Object page summary" }).length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByRole("heading", {
        name: "Table and list inline indicators",
      }).length,
    ).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("How to review this lab")).toBeInTheDocument();
    expect(screen.getByText("SO-48291 drill-in")).toBeInTheDocument();
    expect(container.querySelectorAll(".ax-kpi-card")).toHaveLength(4);
    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-theme='horizon_dark']")).toBeTruthy();
    expect(document.querySelector("[dir='rtl']")).toBeTruthy();

    const dataTable = container.querySelector(".ax-data-table");

    expect(dataTable).not.toBeNull();

    if (!(dataTable instanceof HTMLElement)) {
      throw new Error("Expected the chart lab data table to be rendered.");
    }

    const targetRowCell = within(dataTable).getByText("SO-48339");
    const targetRow = targetRowCell.closest("tr");

    expect(targetRow).not.toBeNull();

    if (!(targetRow instanceof HTMLTableRowElement)) {
      throw new Error("Expected the SO-48339 row to be clickable.");
    }

    fireEvent.click(targetRow);
    expect(screen.getByText("SO-48339 drill-in")).toBeInTheDocument();

    const reviewQueue = screen
      .getByRole("heading", { name: "Dense list with inline charts" })
      .closest(".ax-card");

    expect(reviewQueue).not.toBeNull();

    if (!(reviewQueue instanceof HTMLElement)) {
      throw new Error("Expected the dense list review card to be rendered.");
    }

    const selectedListItem = within(reviewQueue).getByRole("button", {
      name: /so-48312/i,
    });

    fireEvent.click(selectedListItem);
    expect(screen.getByText("SO-48312 drill-in")).toBeInTheDocument();
    expect(selectedListItem).toHaveAttribute("data-selected", "true");
  });
});
