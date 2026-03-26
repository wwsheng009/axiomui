import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { TimePicker } from "./time-picker";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });

  window.dispatchEvent(new Event("resize"));
}

describe("TimePicker", () => {
  it("parses typed input into a canonical time value", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string) => void>();

    render(
      <LocaleProvider locale="en-US">
        <TimePicker label="Start time" onValueChange={handleValueChange} />
      </LocaleProvider>,
    );

    const input = screen.getByRole("textbox", {
      name: /start time/i,
    }) as HTMLInputElement;

    await user.click(input);
    await user.type(input, "3:45 pm{Enter}");

    expect(handleValueChange).toHaveBeenLastCalledWith("15:45");
    await waitFor(() => {
      expect(input.value).toMatch(/3:45\s?PM/i);
    });
  });

  it("selects stepped values from the desktop clock panel", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string) => void>();

    setViewportWidth(1024);

    render(
      <LocaleProvider locale="en-US">
        <TimePicker
          format={{ hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }}
          label="Cutoff"
          minuteStep={15}
          onValueChange={handleValueChange}
          secondStep={30}
        />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: /select hour 14/i }));
    await user.click(screen.getByRole("tab", { name: /minute/i }));
    await user.click(screen.getByRole("button", { name: /select minute 30/i }));
    await user.click(screen.getByRole("tab", { name: /second/i }));
    await user.click(screen.getByRole("button", { name: /select second 30/i }));

    expect(handleValueChange).toHaveBeenLastCalledWith("14:30:30");
    expect(
      (screen.getByRole("textbox", { name: /cutoff/i }) as HTMLInputElement).value,
    ).toBe("14:30:30");
  });

  it("uses dense desktop minute controls for unrestricted minute entry", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string) => void>();

    setViewportWidth(1024);

    render(
      <LocaleProvider locale="en-US">
        <TimePicker
          format={{ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }}
          label="Reminder"
          onValueChange={handleValueChange}
        />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("tab", { name: /minute/i }));

    expect(screen.getByRole("button", { name: /increase minute/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /increase minute/i }));

    expect(handleValueChange).toHaveBeenLastCalledWith("00:01");
    expect(
      (screen.getByRole("textbox", { name: /reminder/i }) as HTMLInputElement).value,
    ).toBe("00:01");
  });

  it("shows an error when typed input does not match the configured step", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string) => void>();

    render(
      <LocaleProvider locale="en-US">
        <TimePicker label="Reminder" minuteStep={15} onValueChange={handleValueChange} />
      </LocaleProvider>,
    );

    const input = screen.getByRole("textbox", { name: /reminder/i });

    await user.click(input);
    await user.type(input, "3:10 PM{Enter}");

    expect(handleValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByText(/enter a valid time that matches the current format and step values/i),
    ).toBeInTheDocument();
  });

  it("renders localized numeric entry fields in the small-screen sheet", async () => {
    const user = userEvent.setup();

    setViewportWidth(480);

    render(
      <LocaleProvider locale="zh-CN">
        <TimePicker defaultValue="18:30:00" label="开始时间" secondStep={30} />
      </LocaleProvider>,
    );

    const input = screen.getByRole("textbox", { name: "开始时间" }) as HTMLInputElement;
    expect(input.value).toBe("18:30:00");

    await user.click(screen.getByRole("button", { name: "打开时间选择器" }));

    await waitFor(() => {
      expect(document.querySelector(".ax-responsive-popover__sheet")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "关闭弹层" })).toBeInTheDocument();
    expect(screen.getByLabelText("输入小时")).toBeInTheDocument();
    expect(screen.getByLabelText("输入分钟")).toBeInTheDocument();
    expect(screen.getByLabelText("输入秒")).toBeInTheDocument();
  });

  it("applies numeric draft values from the small-screen sheet", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string) => void>();

    setViewportWidth(480);

    render(
      <LocaleProvider locale="en-US">
        <TimePicker
          format={{ hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }}
          label="Batch cutoff"
          onValueChange={handleValueChange}
          secondStep={30}
        />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    await waitFor(() => {
      expect(document.querySelector(".ax-responsive-popover__sheet")).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText(/hour input/i));
    await user.type(screen.getByLabelText(/hour input/i), "18");
    await user.clear(screen.getByLabelText(/minute input/i));
    await user.type(screen.getByLabelText(/minute input/i), "45");
    await user.clear(screen.getByLabelText(/second input/i));
    await user.type(screen.getByLabelText(/second input/i), "30");
    await user.click(screen.getByRole("button", { name: /apply time/i }));

    expect(handleValueChange).toHaveBeenLastCalledWith("18:45:30");
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /apply time/i })).not.toBeInTheDocument();
    });
  });

  it("supports keyboard navigation across desktop dial columns", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);

    render(
      <LocaleProvider locale="en-US">
        <TimePicker
          defaultValue="13:15"
          format={{ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }}
          label="Keyboard time"
          minuteStep={15}
        />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    await screen.findByRole("dialog");

    const selectedHour = screen.getByRole("button", { name: /select hour 13/i });
    expect(selectedHour).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: /select hour 14/i })).toHaveFocus();

    await user.keyboard("{Enter}");
    await waitFor(() => {
      expect(
        (screen.getByRole("textbox", { name: /keyboard time/i }) as HTMLInputElement).value,
      ).toBe("14:15");
    });

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /select minute 15/i })).toHaveFocus();
  });

  it("restores focus to the input after closing the panel with Escape", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);

    render(
      <LocaleProvider locale="en-US">
        <TimePicker label="Start time" />
      </LocaleProvider>,
    );

    const input = screen.getByRole("textbox", { name: /start time/i }) as HTMLInputElement;

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
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

    setViewportWidth(1024);

    render(
      <div>
        <LocaleProvider locale="en-US">
          <TimePicker label="Start time" />
        </LocaleProvider>
        <button type="button">Next control</button>
      </div>,
    );

    const input = screen.getByRole("textbox", { name: /start time/i }) as HTMLInputElement;
    const nextControl = screen.getByRole("button", { name: /next control/i });

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
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
