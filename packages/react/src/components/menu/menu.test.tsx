import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { ThemeProvider } from "../../providers/theme-provider";
import { Menu, type MenuItem } from "./menu";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });

  window.dispatchEvent(new Event("resize"));
}

function MenuHarness({
  direction = "ltr",
  locale = "en-US",
  onAction,
  smallScreenBreakpoint = 640,
}: {
  direction?: "ltr" | "rtl";
  locale?: string;
  onAction?: (itemId: string, item: MenuItem) => void;
  smallScreenBreakpoint?: number;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const items: MenuItem[] = [
    {
      id: "share",
      label: "Share",
      iconName: "information",
      items: [
        { id: "share-email", label: "Share by email" },
        { id: "share-slack", label: "Share to Slack" },
      ],
    },
    {
      id: "assign",
      label: "Assign owner",
      description: "Set a primary reviewer",
      iconName: "person",
    },
    {
      id: "archive",
      label: "Archive",
      disabled: true,
    },
    {
      id: "delete",
      label: "Delete draft",
      destructive: true,
      iconName: "warning",
    },
  ];

  return (
    <ThemeProvider direction={direction}>
      <LocaleProvider locale={locale}>
        <div>
          <button ref={anchorRef} type="button" onClick={() => setOpen(true)}>
            Open menu
          </button>
          <Menu
            anchorRef={anchorRef}
            closable
            items={items}
            onAction={onAction}
            onOpenChange={setOpen}
            open={open}
            smallScreenBreakpoint={smallScreenBreakpoint}
            title="Actions"
          />
        </div>
      </LocaleProvider>
    </ThemeProvider>
  );
}

describe("Menu", () => {
  it("selects a leaf item from the keyboard and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn<(itemId: string, item: MenuItem) => void>();

    setViewportWidth(1024);
    render(<MenuHarness onAction={handleAction} />);

    const trigger = screen.getByRole("button", { name: /open menu/i });

    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => {
      expect(handleAction).toHaveBeenCalledWith(
        "assign",
        expect.objectContaining({ id: "assign" }),
      );
    });
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("opens a submenu and returns to the parent level with keyboard navigation", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(<MenuHarness />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /share by email/i }),
    ).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");

    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /assign owner/i })).toBeInTheDocument();
  });

  it("uses Escape to close only the active submenu before dismissing the whole menu", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(<MenuHarness />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /assign owner/i })).toBeInTheDocument();
  });

  it("uses mirrored submenu navigation in RTL", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(<MenuHarness direction="rtl" />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /share to slack/i }),
    ).toBeInTheDocument();
  });

  it("renders inside the responsive small-screen sheet and localizes the back label", async () => {
    const user = userEvent.setup();

    setViewportWidth(480);
    render(<MenuHarness locale="zh-CN" />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await waitFor(() => {
      expect(document.querySelector(".ax-responsive-popover__sheet")).toBeInTheDocument();
    });

    const deleteItem = screen.getByRole("menuitem", { name: /delete draft/i });
    expect(deleteItem).toHaveAttribute("data-destructive", "true");
    expect(screen.getByText("Assign owner")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "返回" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("button", { name: "返回" })).not.toBeInTheDocument();
  });
});
