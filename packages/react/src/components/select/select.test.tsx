import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Select } from "./select";

describe("Select", () => {
  it("opens from the keyboard, selects an option, and closes the listbox", async () => {
    const user = userEvent.setup();

    render(
      <Select
        label="Release status"
        items={[
          { value: "planned", label: "Planned" },
          { value: "active", label: "Active" },
          { value: "ready", label: "Ready" },
        ]}
        placeholder="Choose status"
      />,
    );

    const trigger = screen.getByRole("button", { name: /release status/i });

    trigger.focus();
    await user.keyboard("{ArrowDown}");

    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveTextContent("Active");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
