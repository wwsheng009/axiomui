import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { DatePicker } from "./date-picker";

describe("DatePicker", () => {
  it("parses typed input into an ISO date value", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <LocaleProvider locale="en-US">
        <DatePicker
          label="Target date"
          onValueChange={handleValueChange}
          placeholder="MM/DD/YYYY"
        />
      </LocaleProvider>,
    );

    const input = screen.getByRole("textbox", { name: /target date/i });

    await user.click(input);
    await user.type(input, "04/18/2026{Enter}");

    expect(handleValueChange).toHaveBeenLastCalledWith("2026-04-18");
    await waitFor(() => {
      expect(input).toHaveValue("04/18/2026");
    });
  });

  it("selects a day from the calendar panel and closes the dialog", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="en-US">
        <DatePicker label="Validation milestone" defaultValue="2026-04-08" />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: /april 18, 2026/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("textbox", { name: /validation milestone/i }),
    ).toHaveValue("04/18/2026");
  });
});
