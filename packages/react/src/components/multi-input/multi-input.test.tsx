import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MultiInput } from "./multi-input";

describe("MultiInput", () => {
  it("creates tokens with Enter and removes the last token with Backspace", async () => {
    const user = userEvent.setup();

    render(<MultiInput label="Tags" placeholder="Add a tag" />);

    const input = screen.getByRole("textbox", { name: /tags/i });

    await user.type(input, "alpha{Enter}");
    await user.type(input, "beta{Enter}");

    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("beta")).toBeInTheDocument();

    await user.click(input);
    await user.keyboard("{Backspace}");

    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.queryByText("beta")).not.toBeInTheDocument();
  });
});
