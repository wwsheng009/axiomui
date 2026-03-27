import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("links helper copy and exposes aria-invalid for error state", () => {
    render(
      <Input
        label="Project code"
        description="Use the canonical release identifier."
        message="Project code is required."
        valueState="error"
      />,
    );

    const input = screen.getByRole("textbox", { name: /project code/i });
    const description = screen.getByText(/canonical release identifier/i);
    const message = screen.getByText(/project code is required/i);

    expect(input).toHaveAttribute(
      "aria-describedby",
      `${description.getAttribute("id")} ${message.getAttribute("id")}`,
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps non-error semantic states out of invalid mode", () => {
    render(
      <Input
        label="Release line"
        message="Information state stays advisory."
        valueState="information"
      />,
    );

    expect(screen.getByRole("textbox", { name: /release line/i })).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
