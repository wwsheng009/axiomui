import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { Button } from "../button/button";
import { ResponsivePopover } from "./responsive-popover";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });

  window.dispatchEvent(new Event("resize"));
}

function ResponsivePopoverHarness({
  closable = true,
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
          Open responsive popover
        </button>
        <ResponsivePopover
          actions={<Button onClick={() => setOpen(false)}>Apply</Button>}
          anchorRef={anchorRef}
          closable={closable}
          description="Adapts to the current viewport."
          onOpenChange={setOpen}
          open={open}
          title="Responsive actions"
        >
          <button type="button">First action</button>
        </ResponsivePopover>
      </div>
    </LocaleProvider>
  );
}

describe("ResponsivePopover", () => {
  it("renders as a desktop popover above the mobile breakpoint", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(<ResponsivePopoverHarness />);

    await user.click(
      screen.getByRole("button", { name: /open responsive popover/i }),
    );

    expect(
      screen.getByRole("dialog", { name: /responsive actions/i }),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".ax-popover__shell"),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".ax-responsive-popover__sheet"),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("switches to the small-screen sheet mode and dismisses with Escape", async () => {
    const user = userEvent.setup();

    setViewportWidth(480);
    render(<ResponsivePopoverHarness />);

    const trigger = screen.getByRole("button", {
      name: /open responsive popover/i,
    });

    await user.click(trigger);

    const closeButton = screen.getByRole("button", { name: /close popover/i });

    await waitFor(() => {
      expect(document.querySelector(".ax-responsive-popover__sheet")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /responsive actions/i }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("adapts while open when the viewport crosses the breakpoint", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(<ResponsivePopoverHarness />);

    await user.click(
      screen.getByRole("button", { name: /open responsive popover/i }),
    );

    expect(document.querySelector(".ax-popover__shell")).toBeInTheDocument();

    setViewportWidth(480);

    await waitFor(() => {
      expect(document.querySelector(".ax-responsive-popover__sheet")).toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.mouseDown(screen.getByRole("presentation"));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /responsive actions/i }),
      ).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("switches back to the desktop shell and releases body scroll lock when the viewport grows", async () => {
    const user = userEvent.setup();

    setViewportWidth(480);
    render(<ResponsivePopoverHarness />);

    await user.click(
      screen.getByRole("button", { name: /open responsive popover/i }),
    );

    await waitFor(() => {
      expect(document.querySelector(".ax-responsive-popover__sheet")).toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("hidden");

    setViewportWidth(1024);

    await waitFor(() => {
      expect(document.querySelector(".ax-popover__shell")).toBeInTheDocument();
    });
    expect(
      document.querySelector(".ax-responsive-popover__sheet"),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("localizes the default close label for zh-CN in small-screen mode", async () => {
    const user = userEvent.setup();

    setViewportWidth(480);
    render(<ResponsivePopoverHarness locale="zh-CN" />);

    await user.click(
      screen.getByRole("button", { name: /open responsive popover/i }),
    );

    expect(screen.getByRole("button", { name: "关闭弹层" })).toBeInTheDocument();
  });
});
