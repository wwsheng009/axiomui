import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { Breadcrumbs, type BreadcrumbsItem } from "./breadcrumbs";

const breadcrumbItems: BreadcrumbsItem[] = [
  { key: "home", label: "Home", href: "#" },
  { key: "region", label: "North America", href: "#" },
  { key: "country", label: "Canada", href: "#" },
  { key: "workspace", label: "Delivery Workspace", href: "#" },
  { key: "order", label: "SO-48291", current: true },
];

describe("Breadcrumbs", () => {
  it("collapses long paths and expands hidden items on demand", async () => {
    const user = userEvent.setup();

    render(<Breadcrumbs items={breadcrumbItems} maxVisibleItems={4} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Delivery Workspace")).toBeInTheDocument();
    expect(screen.getByText("SO-48291")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText("North America")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /show full path/i }));

    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  it("renders interactive items as buttons and marks the last item current when no explicit current is provided", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Breadcrumbs
        items={[
          { key: "home", label: "Home", onClick: handleClick },
          { key: "details", label: "Details" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Home" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Details")).toHaveAttribute("aria-current", "page");
  });

  it("uses mirrored separator icons in RTL", () => {
    const { container } = render(
      <ThemeProvider direction="rtl">
        <Breadcrumbs items={breadcrumbItems.slice(0, 3)} />
      </ThemeProvider>,
    );

    expect(
      container.querySelector(".ax-breadcrumbs__separator .ax-icon"),
    ).toHaveAttribute("data-mirrored", "true");
  });
});
