import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { DateRangePicker, type DateRangeValue } from "./date-range-picker";

describe("DateRangePicker", () => {
  it("parses typed input into an ISO date range value", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: DateRangeValue) => void>();

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker label="Target window" onValueChange={handleValueChange} />
      </LocaleProvider>,
    );

    const startInput = screen.getByRole("textbox", {
      name: /target window start date/i,
    });
    const endInput = screen.getByRole("textbox", {
      name: /target window end date/i,
    });

    await user.click(startInput);
    await user.type(startInput, "04/10/2026");
    await user.tab();
    await user.type(endInput, "04/18/2026{Enter}");

    expect(handleValueChange).toHaveBeenLastCalledWith({
      end: "2026-04-18",
      start: "2026-04-10",
    });
    await waitFor(() => {
      expect(startInput).toHaveValue("04/10/2026");
      expect(endInput).toHaveValue("04/18/2026");
    });
  });

  it("selects a same-month end date when a start date already exists", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker defaultValue={{ start: "2026-04-10" }} label="Release window" />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: /april 18, 2026/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("textbox", { name: /release window start date/i })).toHaveValue(
      "04/10/2026",
    );
    expect(
      screen.getByRole("textbox", { name: /release window end date/i }),
    ).toHaveValue("04/18/2026");
  });

  it("selects a cross-month range from the dual-month panel without paging", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker defaultValue={{ start: "2026-04-28" }} label="Review period" />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: /may 3, 2026/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("textbox", { name: /review period start date/i }),
    ).toHaveValue("04/28/2026");
    expect(
      screen.getByRole("textbox", { name: /review period end date/i }),
    ).toHaveValue("05/03/2026");
  });

  it("edits both endpoints of an existing range from the explicit panel controls", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker
          defaultValue={{ start: "2026-04-10", end: "2026-04-18" }}
          label="Delivery range"
        />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: /edit start date/i }));
    await user.click(screen.getByRole("button", { name: /april 12, 2026/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("textbox", { name: /delivery range start date/i }),
    ).toHaveValue("04/12/2026");
    expect(
      screen.getByRole("textbox", { name: /delivery range end date/i }),
    ).toHaveValue("04/18/2026");

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: /edit end date/i }));
    await user.click(screen.getByRole("button", { name: /april 20, 2026/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("textbox", { name: /delivery range start date/i }),
    ).toHaveValue("04/12/2026");
    expect(
      screen.getByRole("textbox", { name: /delivery range end date/i }),
    ).toHaveValue("04/20/2026");
  });

  it("shows an error when the typed range is inverted", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker
          description="Keep the end on or after the start."
          label="Milestone range"
          onValueChange={handleValueChange}
        />
      </LocaleProvider>,
    );

    const startInput = screen.getByRole("textbox", {
      name: /milestone range start date/i,
    });
    const endInput = screen.getByRole("textbox", {
      name: /milestone range end date/i,
    });

    await user.click(startInput);
    await user.type(startInput, "04/18/2026");
    await user.tab();
    await user.type(endInput, "04/10/2026{Enter}");

    expect(handleValueChange).not.toHaveBeenCalled();
    const message = screen.getByText(/start date must be on or before end date/i);
    const description = screen.getByText(/keep the end on or after the start/i);

    expect(message).toBeInTheDocument();
    expect(startInput).toHaveAttribute("aria-invalid", "true");
    expect(endInput).toHaveAttribute("aria-invalid", "true");
    expect(startInput).toHaveAttribute(
      "aria-describedby",
      `${description.getAttribute("id")} ${message.getAttribute("id")}`,
    );
    expect(endInput).toHaveAttribute(
      "aria-describedby",
      `${description.getAttribute("id")} ${message.getAttribute("id")}`,
    );
  });

  it("localizes control and panel copy for zh-CN", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="zh-CN">
        <DateRangePicker defaultValue={{ start: "2026-04-10" }} label="交付窗口" />
      </LocaleProvider>,
    );

    expect(
      screen.getByRole("textbox", { name: "交付窗口开始日期" }),
    ).toHaveValue("2026/04/10");
    expect(
      screen.getByRole("textbox", { name: "交付窗口结束日期" }),
    ).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "打开日历" }));
    await screen.findByRole("dialog");

    expect(
      screen.getByRole("button", { name: /编辑结束日期：选择结束日期/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("正在编辑结束日期。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "上个月" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "下个月" })).toBeInTheDocument();
  });

  it("clears both values from the field shell", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker
          defaultValue={{ start: "2026-04-10", end: "2026-04-18" }}
          label="Delivery range"
          onValueChange={handleValueChange}
        />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /clear date range/i }));

    expect(handleValueChange).toHaveBeenLastCalledWith({ end: "", start: "" });
    expect(
      screen.getByRole("textbox", { name: /delivery range start date/i }),
    ).toHaveValue("");
    expect(
      screen.getByRole("textbox", { name: /delivery range end date/i }),
    ).toHaveValue("");
  });
});
