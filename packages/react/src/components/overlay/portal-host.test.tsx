import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { PortalHost } from "./portal-host";

describe("PortalHost", () => {
  it("renders into a managed host that inherits theme, density, and direction", () => {
    render(
      <ThemeProvider density="compact" direction="rtl" theme="horizon_dark">
        <PortalHost>
          <div role="dialog">Overlay content</div>
        </PortalHost>
      </ThemeProvider>,
    );

    const dialog = screen.getByRole("dialog");
    const host = dialog.parentElement;

    expect(host).not.toBeNull();
    expect(host).toHaveClass("ax-theme-provider", "ax-portal-host");
    expect(host).toHaveAttribute("data-axiom-theme", "horizon_dark");
    expect(host).toHaveAttribute("data-axiom-density", "compact");
    expect(host).toHaveAttribute("dir", "rtl");
    expect(host?.parentElement).toBe(document.body);
  });
});
