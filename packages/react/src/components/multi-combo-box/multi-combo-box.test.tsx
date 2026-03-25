import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MultiComboBox } from "./multi-combo-box";

describe("MultiComboBox", () => {
  it("filters items, selects multiple values, and syncs token removal", async () => {
    const user = userEvent.setup();

    render(
      <MultiComboBox
        label="Owners"
        items={[
          { value: "mia", label: "Mia Chen" },
          { value: "avery", label: "Avery Kim" },
          { value: "noah", label: "Noah Patel" },
        ]}
        placeholder="All owners"
      />,
    );

    const input = screen.getByRole("combobox", { name: /owners/i });

    await user.click(input);
    await user.type(input, "Mi");
    expect(screen.getByRole("option", { name: /mia chen/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /avery kim/i })).not.toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(
      screen.getByRole("button", { name: /remove mia chen/i }),
    ).toBeInTheDocument();
    expect(input).toHaveValue("");

    await user.type(input, "No");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(
      screen.getByRole("button", { name: /remove noah patel/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove mia chen/i }));
    expect(
      screen.queryByRole("button", { name: /remove mia chen/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove noah patel/i }),
    ).toBeInTheDocument();
  });
});
