import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ObjectPageNav, ObjectPageSection } from "./object-page-nav";

function ObjectPageNavHarness() {
  return (
    <ObjectPageNav
      items={[
        { key: "summary", label: "Summary", count: "02" },
        { key: "delivery", label: "Delivery", count: "03" },
      ]}
      listAriaLabel="Object page sections"
      value="summary"
      onValueChange={() => undefined}
    />
  );
}

describe("ObjectPageNav", () => {
  it("renders tab semantics, counts, and list labeling", () => {
    render(<ObjectPageNavHarness />);

    expect(
      screen.getByRole("tablist", { name: "Object page sections" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Summary/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /Delivery/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("updates the selected tab when the parent value changes", async () => {
    const user = userEvent.setup();

    function ControlledHarness() {
      const [value, setValue] = useState("summary");

      return (
        <ObjectPageNav
          items={[
            { key: "summary", label: "Summary", count: "02" },
            { key: "delivery", label: "Delivery", count: "03" },
          ]}
          listAriaLabel="Object page sections"
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<ControlledHarness />);

    await user.click(screen.getByRole("tab", { name: /Delivery/i }));

    expect(screen.getByRole("tab", { name: /Delivery/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /Summary/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("renders section heading, description, actions, and body content", () => {
    render(
      <ObjectPageSection
        actions={<button type="button">Open metrics</button>}
        description="Summary section description"
        heading="Summary"
        sectionKey="summary"
      >
        <div>Section body</div>
      </ObjectPageSection>,
    );

    expect(screen.getByRole("heading", { name: "Summary" })).toBeInTheDocument();
    expect(screen.getByText("Summary section description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open metrics" })).toBeInTheDocument();
    expect(screen.getByText("Section body")).toBeInTheDocument();
  });
});
