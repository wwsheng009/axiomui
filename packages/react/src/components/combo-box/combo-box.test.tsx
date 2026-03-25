import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ComboBox } from "./combo-box";

describe("ComboBox", () => {
  it("filters options and commits the highlighted option from the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <ComboBox
        label="Owner"
        items={[
          { value: "mia", label: "Mia Chen" },
          { value: "avery", label: "Avery Kim" },
          { value: "noah", label: "Noah Patel" },
        ]}
        placeholder="Search owners"
      />,
    );

    const input = screen.getByRole("combobox", { name: /owner/i });

    await user.click(input);
    await user.type(input, "Aver");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(input).toHaveValue("Avery Kim");
  });
});
