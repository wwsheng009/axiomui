import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { MessagePopover, type MessagePopoverItem } from "./message-popover";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });

  window.dispatchEvent(new Event("resize"));
}

function MessagePopoverHarness({
  items,
  locale = "en-US",
  onItemClick,
}: {
  items: MessagePopoverItem[];
  locale?: string;
  onItemClick?: (item: MessagePopoverItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  return (
    <LocaleProvider locale={locale}>
      <div>
        <button ref={anchorRef} type="button" onClick={() => setOpen(true)}>
          Open messages
        </button>
        <MessagePopover
          anchorRef={anchorRef}
          items={items}
          onItemClick={onItemClick}
          onOpenChange={setOpen}
          open={open}
        />
      </div>
    </LocaleProvider>
  );
}

describe("MessagePopover", () => {
  it("groups items by severity and focuses the first item when opened", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(
      <MessagePopoverHarness
        items={[
          { id: "warning-1", title: "Review pending", tone: "warning" },
          { id: "error-1", title: "Import failed", tone: "error" },
          { id: "info-1", title: "Refresh available", tone: "information" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open messages/i }));

    expect(screen.getByText("Errors")).toBeInTheDocument();
    expect(screen.getByText("Warnings")).toBeInTheDocument();
    expect(screen.getByText("Information")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /import failed/i })).toHaveFocus();
    });
  });

  it("calls onItemClick when a message row is activated", async () => {
    const user = userEvent.setup();
    const handleItemClick = vi.fn<(item: MessagePopoverItem) => void>();

    setViewportWidth(1024);
    render(
      <MessagePopoverHarness
        items={[{ id: "error-1", title: "Import failed", tone: "error" }]}
        onItemClick={handleItemClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open messages/i }));
    await user.click(screen.getByRole("button", { name: /import failed/i }));

    expect(handleItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "error-1" }),
    );
  });

  it("shows the localized empty state when no messages are available", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(<MessagePopoverHarness items={[]} locale="zh-CN" />);

    await user.click(screen.getByRole("button", { name: /open messages/i }));

    expect(screen.getByText("当前没有消息。")).toBeInTheDocument();
    expect(screen.getAllByText("0 条消息")).toHaveLength(2);
  });

  it("renders inside the responsive sheet on small screens", async () => {
    const user = userEvent.setup();

    setViewportWidth(480);
    render(
      <MessagePopoverHarness
        items={[{ id: "success-1", title: "Upload finished", tone: "success" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open messages/i }));

    await waitFor(() => {
      expect(document.querySelector(".ax-responsive-popover__sheet")).toBeInTheDocument();
    });
    expect(screen.getAllByText("1 message")).toHaveLength(2);
  });

  it("restores focus to the trigger after closing from the desktop popover", async () => {
    const user = userEvent.setup();

    setViewportWidth(1024);
    render(
      <MessagePopoverHarness
        items={[{ id: "error-1", title: "Import failed", tone: "error" }]}
      />,
    );

    const trigger = screen.getByRole("button", { name: /open messages/i });

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /import failed/i })).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /messages/i })).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
