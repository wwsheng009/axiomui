import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
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

  it("localizes the default placeholder for zh-CN", () => {
    render(
      <LocaleProvider locale="zh-CN">
        <Select
          label="发布状态"
          items={[
            { value: "planned", label: "Planned" },
            { value: "active", label: "Active" },
          ]}
        />
      </LocaleProvider>,
    );

    expect(screen.getByRole("button", { name: /发布状态/i })).toHaveTextContent("请选择");
  });

  it("restores focus to the trigger after closing the listbox with Escape", async () => {
    const user = userEvent.setup();

    render(
      <Select
        label="Release status"
        items={[
          { value: "planned", label: "Planned" },
          { value: "active", label: "Active" },
          { value: "ready", label: "Ready" },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: /release status/i });

    await user.click(trigger);
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
