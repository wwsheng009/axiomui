import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Button } from "../button/button";
import { Dialog } from "./dialog";

function DialogHarness({
  closeOnOverlayClick = true,
}: {
  closeOnOverlayClick?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Dialog
        actions={<Button onClick={() => setOpen(false)}>Apply</Button>}
        closeOnOverlayClick={closeOnOverlayClick}
        description="Review the current workbench settings."
        footerStart={<span>Footer note</span>}
        open={open}
        title="Workspace dialog"
        onClose={() => setOpen(false)}
      >
        <input aria-label="Dialog field" />
      </Dialog>
    </div>
  );
}

describe("Dialog", () => {
  it("renders only when opened and locks body scroll while active", async () => {
    const user = userEvent.setup();

    render(<DialogHarness />);

    expect(
      screen.queryByRole("dialog", { name: /workspace dialog/i }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");

    await user.click(screen.getByRole("button", { name: /open dialog/i }));

    expect(
      screen.getByRole("dialog", { name: /workspace dialog/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Review the current workbench settings.")).toBeInTheDocument();
    expect(screen.getByText("Footer note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByRole("button", { name: /close dialog/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /workspace dialog/i }),
      ).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("dismisses on outside pointer down and Escape, restoring focus to the trigger", async () => {
    const user = userEvent.setup();

    render(<DialogHarness />);

    const trigger = screen.getByRole("button", { name: /open dialog/i });

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /close dialog/i })).toHaveFocus();
    });

    fireEvent.mouseDown(screen.getByRole("presentation"));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /workspace dialog/i }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /workspace dialog/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /workspace dialog/i }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("keeps the dialog open on outside pointer down when overlay dismissal is disabled", async () => {
    const user = userEvent.setup();

    render(<DialogHarness closeOnOverlayClick={false} />);

    await user.click(screen.getByRole("button", { name: /open dialog/i }));

    expect(screen.getByRole("dialog", { name: /workspace dialog/i })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("presentation"));

    expect(screen.getByRole("dialog", { name: /workspace dialog/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /apply/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /workspace dialog/i }),
      ).not.toBeInTheDocument();
    });
  });
});
