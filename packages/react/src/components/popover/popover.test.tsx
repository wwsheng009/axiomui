import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";

import { Popover } from "./popover";

function PopoverHarness() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div>
      <button ref={anchorRef} type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Popover anchorRef={anchorRef} onOpenChange={setOpen} open={open} title="Quick actions">
        <span>Popover body</span>
      </Popover>
    </div>
  );
}

describe("Popover", () => {
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
});
