import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ObjectIdentifier } from "./object-identifier";

describe("ObjectIdentifier", () => {
  it("renders title, subtitle, meta, and icon together", () => {
    const { container } = render(
      <ObjectIdentifier
        iconName="information"
        meta="Sales order"
        subtitle="Global rollout workspace"
        title="SO-48291"
      />,
    );

    expect(screen.getByText("SO-48291")).toBeInTheDocument();
    expect(screen.getByText("Global rollout workspace")).toBeInTheDocument();
    expect(screen.getByText("Sales order")).toBeInTheDocument();
    expect(container.querySelector(".ax-object-identifier__icon .ax-icon")).toBeTruthy();
  });

  it("renders the title as a button when click handling is provided", async () => {
    const user = userEvent.setup();
    const handleTitleClick = vi.fn();

    render(
      <ObjectIdentifier
        onTitleClick={handleTitleClick}
        title="SO-48291"
      />,
    );

    await user.click(screen.getByRole("button", { name: "SO-48291" }));

    expect(handleTitleClick).toHaveBeenCalledTimes(1);
  });

  it("preserves long text in title attributes for truncated strings", () => {
    const longTitle =
      "Sales order SO-48291 for North America downstream fulfillment handover";

    render(
      <ObjectIdentifier
        subtitle="Backorder recovery stream"
        title={longTitle}
      />,
    );

    expect(screen.getByText(longTitle)).toHaveAttribute("title", longTitle);
    expect(screen.getByText("Backorder recovery stream")).toHaveAttribute(
      "title",
      "Backorder recovery stream",
    );
  });
});
