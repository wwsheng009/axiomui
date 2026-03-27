import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { DynamicPage } from "./dynamic-page";

describe("DynamicPage", () => {
  it("renders heading, supporting copy, actions, header content, footer, and body", () => {
    const { container } = render(
      <DynamicPage
        actions={<button type="button">Save</button>}
        eyebrow="Workspace shell"
        footer={<button type="button">Approve release</button>}
        headerContent={<div>Header panel</div>}
        heading="AxiomUI rollout workspace"
        subheading="Consolidate shell, feedback, navigation and page skeleton primitives."
      >
        <div>Page body</div>
      </DynamicPage>,
    );

    expect(screen.getByText("Workspace shell")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "AxiomUI rollout workspace" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Consolidate shell, feedback, navigation and page skeleton primitives.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByText("Header panel")).toBeInTheDocument();
    expect(screen.getByText("Page body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve release" })).toBeInTheDocument();
    expect(container.querySelector(".ax-dynamic-page__header-content")).toBeTruthy();
    expect(container.querySelector(".ax-dynamic-page__footer")).toBeTruthy();
  });

  it("renders cleanly in compact density", () => {
    render(
      <ThemeProvider density="compact">
        <DynamicPage heading="AxiomUI rollout workspace">
          <div>Page body</div>
        </DynamicPage>
      </ThemeProvider>,
    );

    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "AxiomUI rollout workspace" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Page body")).toBeInTheDocument();
  });
});
