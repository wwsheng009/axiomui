import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { Avatar } from "../avatar/avatar";
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs";
import { Button } from "../button/button";
import { ObjectStatus } from "../object-status/object-status";
import { ObjectPageHeader } from "./object-page-header";

describe("ObjectPageHeader", () => {
  it("renders breadcrumbs, avatar, title, meta, statuses, and actions together", () => {
    render(
      <ObjectPageHeader
        actions={
          <>
            <Button variant="transparent">Share</Button>
            <Button variant="default">Edit</Button>
          </>
        }
        avatar={<Avatar initials="MC" size="lg" statusTone="success" />}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { key: "workspace", label: "Delivery workspace", href: "#" },
              { key: "object", label: "SO-48291", current: true },
            ]}
          />
        }
        meta="Sales order · High value"
        statuses={
          <>
            <ObjectStatus label="In process" tone="information" />
            <ObjectStatus label="Escalated" tone="error" />
          </>
        }
        subtitle="North America downstream fulfillment handover"
        title="SO-48291"
      />,
    );

    expect(screen.getByRole("heading", { name: "SO-48291" })).toBeInTheDocument();
    expect(screen.getByText("North America downstream fulfillment handover")).toBeInTheDocument();
    expect(screen.getByText("Sales order · High value")).toBeInTheDocument();
    expect(screen.getByText("In process")).toBeInTheDocument();
    expect(screen.getByText("Escalated")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByText("Delivery workspace")).toBeInTheDocument();
    expect(screen.getByText("MC")).toBeInTheDocument();
  });

  it("renders the title as a link when href is provided", () => {
    render(
      <ObjectPageHeader
        title="SO-48291"
        titleHref="/sales-orders/SO-48291"
      />,
    );

    expect(screen.getByRole("link", { name: "SO-48291" })).toHaveAttribute(
      "href",
      "/sales-orders/SO-48291",
    );
  });

  it("renders the title as a button when click handling is provided", async () => {
    const user = userEvent.setup();
    const handleTitleClick = vi.fn();

    render(
      <ObjectPageHeader
        onTitleClick={handleTitleClick}
        title="SO-48291"
      />,
    );

    await user.click(screen.getByRole("button", { name: "SO-48291" }));

    expect(handleTitleClick).toHaveBeenCalledTimes(1);
  });

  it("renders cleanly in compact density", () => {
    const { container } = render(
      <ThemeProvider density="compact">
        <ObjectPageHeader
          actions={<Button variant="transparent">Inspect</Button>}
          statuses={<ObjectStatus label="Committed" tone="success" />}
          title="SO-48291"
        />
      </ThemeProvider>,
    );

    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(container.querySelector(".ax-object-page-header__actions")).toBeTruthy();
    expect(screen.getByText("Committed")).toBeInTheDocument();
  });
});
