import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders the image first and falls back to initials when loading fails", () => {
    const { container } = render(
      <Avatar
        alt="Mia Chen"
        initials="MC"
        src="https://example.com/mia-chen.png"
      />,
    );

    const image = screen.getByRole("img", { name: "Mia Chen" });

    expect(image).toBeInTheDocument();

    fireEvent.error(image);

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("MC")).toBeInTheDocument();
  });

  it("derives initials from the name and renders semantic status dots", () => {
    render(
      <Avatar
        name="Axiom Control"
        statusLabel="Available"
        statusTone="success"
      />,
    );

    expect(screen.getByText("AC")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Available" })).toHaveAttribute(
      "data-tone",
      "success",
    );
  });

  it("supports size and shape enums and works in compact density", () => {
    const { container } = render(
      <ThemeProvider density="compact">
        <Avatar shape="square" size="lg" />
      </ThemeProvider>,
    );

    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(container.querySelector(".ax-avatar")).toHaveAttribute("data-shape", "square");
    expect(container.querySelector(".ax-avatar")).toHaveAttribute("data-size", "lg");
    expect(container.querySelector(".ax-avatar__fallback .ax-icon")).toBeTruthy();
  });
});
