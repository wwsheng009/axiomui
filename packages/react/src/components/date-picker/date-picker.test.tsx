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

  it("localizes calendar controls for zh-CN", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="zh-CN">
        <DatePicker label="目标日期" defaultValue="2026-04-08" />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "打开日历" }));
    await screen.findByRole("dialog");

    expect(screen.getByRole("button", { name: "上个月" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "下个月" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "目标日期" })).toHaveValue("2026/04/08");
  });

  it("restores focus to the input after closing the calendar with Escape", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="en-US">
        <DatePicker label="Target date" defaultValue="2026-04-08" />
      </LocaleProvider>,
    );

    const input = screen.getByRole("textbox", { name: /target date/i });

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it("closes on outside click and leaves focus on the next control", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <LocaleProvider locale="en-US">
          <DatePicker label="Target date" defaultValue="2026-04-08" />
        </LocaleProvider>
        <button type="button">Next control</button>
      </div>,
    );

    const input = screen.getByRole("textbox", { name: /target date/i });
    const nextControl = screen.getByRole("button", { name: /next control/i });

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await screen.findByRole("dialog");
    await user.click(nextControl);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(nextControl).toHaveFocus();
    });
    expect(input).not.toHaveFocus();
  });
});
