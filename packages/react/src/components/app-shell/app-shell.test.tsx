import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders brand, titles, search, actions, meta, and content together", () => {
    const { container } = render(
      <AppShell
        actions={<button type="button">Open board</button>}
        brand={<span>AX</span>}
        contentClassName="docs-shell-body"
        meta={<span>Profile</span>}
        primaryTitle="AxiomUI"
        search={<input aria-label="Search workspace" />}
        secondaryTitle="Operations workspace"
      >
        <main>Workspace content</main>
      </AppShell>,
    );

    expect(screen.getByText("AX")).toBeInTheDocument();
    expect(screen.getByText("AxiomUI")).toBeInTheDocument();
    expect(screen.getByText("Operations workspace")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search workspace" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open board" })).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Workspace content")).toBeInTheDocument();
    expect(container.querySelector(".ax-shell__content")).toHaveClass("docs-shell-body");
  });

  it("renders the minimal shell when optional slots are omitted", () => {
    const { container } = render(
      <AppShell primaryTitle="AxiomUI">Body</AppShell>,
    );

    expect(screen.getByText("AxiomUI")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(container.querySelector(".ax-shell__brand")).toBeNull();
    expect(container.querySelector(".ax-shell__search")).toBeNull();
    expect(container.querySelector(".ax-shell__actions")).toBeNull();
    expect(container.querySelector(".ax-shell__meta")).toBeNull();
  });
});
