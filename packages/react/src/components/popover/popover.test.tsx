import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { Popover } from "./popover";

function PopoverHarness({
  closable = false,
  locale = "en-US",
}: {
  closable?: boolean;
  locale?: string;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  return (
    <LocaleProvider locale={locale}>
      <div>
        <button ref={anchorRef} type="button" onClick={() => setOpen(true)}>
          Open
        </button>
        <button type="button">Next field</button>
        <Popover
          anchorRef={anchorRef}
          closable={closable}
          onOpenChange={setOpen}
          open={open}
          title="Quick actions"
        >
          <span>Popover body</span>
        </Popover>
      </div>
    </LocaleProvider>
  );
}

describe("Popover", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dismisses on outside pointer down and on Escape", async () => {
    const user = userEvent.setup();

    render(<PopoverHarness />);

    await user.click(screen.getByRole("button", { name: /^open$/i }));
    expect(screen.getByRole("dialog", { name: /quick actions/i })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("presentation"));
    expect(
      screen.queryByRole("dialog", { name: /quick actions/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^open$/i }));
    expect(screen.getByRole("dialog", { name: /quick actions/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { name: /quick actions/i }),
    ).not.toBeInTheDocument();
  });

  it("restores focus to the trigger after closing", async () => {
    const user = userEvent.setup();

    render(<PopoverHarness />);

    const trigger = screen.getByRole("button", { name: /^open$/i });

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /quick actions/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /quick actions/i })).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("dismisses on a real outside click without stealing focus from the next target", async () => {
    const user = userEvent.setup();

    render(<PopoverHarness />);

    const trigger = screen.getByRole("button", { name: /^open$/i });
    const nextField = screen.getByRole("button", { name: /next field/i });

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /quick actions/i })).toBeInTheDocument();

    await user.click(nextField);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /quick actions/i })).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(nextField).toHaveFocus();
    });
    expect(trigger).not.toHaveFocus();
  });

  it("localizes the default close button label for zh-CN", async () => {
    const user = userEvent.setup();

    render(<PopoverHarness closable locale="zh-CN" />);

    await user.click(screen.getByRole("button", { name: /^open$/i }));

    expect(screen.getByRole("dialog", { name: /quick actions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "关闭弹层" })).toBeInTheDocument();
  });

  it("constrains oversized content to the viewport", async () => {
    const user = userEvent.setup();
    const originalInnerHeight = window.innerHeight;
    const originalInnerWidth = window.innerWidth;

    try {
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: 600,
        writable: true,
      });
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 800,
        writable: true,
      });

      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
        this: HTMLElement,
      ) {
        if (this instanceof HTMLButtonElement) {
          return {
            bottom: 560,
            height: 40,
            left: 24,
            right: 224,
            top: 520,
            width: 200,
            x: 24,
            y: 520,
            toJSON: () => ({}),
          } as DOMRect;
        }

        if (
          this instanceof HTMLDivElement &&
          this.classList.contains("ax-popover__shell")
        ) {
          return {
            bottom: 1012,
            height: 1000,
            left: 24,
            right: 724,
            top: 12,
            width: 700,
            x: 24,
            y: 12,
            toJSON: () => ({}),
          } as DOMRect;
        }

        return {
          bottom: 0,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      });

      render(<PopoverHarness />);

      await user.click(screen.getByRole("button", { name: /^open$/i }));

      const dialog = await screen.findByRole("dialog", { name: /quick actions/i });

      await waitFor(() => {
        expect(dialog).toHaveStyle({
          maxHeight: "576px",
          maxWidth: "776px",
          top: "12px",
        });
      });
    } finally {
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: originalInnerHeight,
        writable: true,
      });
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: originalInnerWidth,
        writable: true,
      });
    }
  });
});
