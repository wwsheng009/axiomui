import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "../../providers/theme-provider";
import { Button } from "../button/button";
import { ObjectPageHeader } from "../object-page-header/object-page-header";
import { ObjectPageLayout, type ObjectPageLayoutSection } from "./object-page-layout";

const objectPageSections: ObjectPageLayoutSection[] = [
  {
    key: "summary",
    label: "Summary",
    heading: "Summary",
    description: "Rollout overview and object context.",
    content: <p>Summary content</p>,
    subsections: [
      {
        key: "commercial",
        heading: "Commercial overview",
        content: <p>Commercial details</p>,
      },
    ],
  },
  {
    key: "delivery",
    label: "Delivery",
    heading: "Delivery",
    description: "Execution work area.",
    content: <p>Delivery content</p>,
    subsections: [
      {
        key: "plan",
        heading: "Execution plan",
        content: <p>Plan details</p>,
      },
    ],
  },
];

type ObserverRecord = {
  callback: IntersectionObserverCallback;
  elements: Element[];
};

const observerRecords: ObserverRecord[] = [];

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds = [];
  private readonly record: ObserverRecord;

  constructor(callback: IntersectionObserverCallback) {
    this.record = {
      callback,
      elements: [],
    };
    observerRecords.push(this.record);
  }

  disconnect() {
    this.record.elements = [];
  }

  observe(element: Element) {
    this.record.elements.push(element);
  }

  takeRecords() {
    return [];
  }

  unobserve(element: Element) {
    this.record.elements = this.record.elements.filter((entry) => entry !== element);
  }
}

beforeEach(() => {
  observerRecords.length = 0;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ObjectPageLayout", () => {
  it("renders header, anchor bar, sections, and subsections together", () => {
    render(
      <ObjectPageLayout
        header={<ObjectPageHeader title="SO-48291" />}
        sections={objectPageSections}
        sideContent={<p>Side content</p>}
      />,
    );

    expect(screen.getByRole("heading", { name: "SO-48291" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Summary/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Delivery/i })).toBeInTheDocument();
    expect(screen.getByText("Commercial overview")).toBeInTheDocument();
    expect(screen.getByText("Execution plan")).toBeInTheDocument();
    expect(screen.getByText("Side content")).toBeInTheDocument();
  });

  it("scrolls to a section and updates the active anchor when a tab is clicked", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    const scrollIntoView = vi.fn();

    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    render(
      <ObjectPageLayout
        onValueChange={handleValueChange}
        sections={objectPageSections}
      />,
    );

    await user.click(screen.getByRole("tab", { name: /Delivery/i }));

    expect(handleValueChange).toHaveBeenCalledWith("delivery");
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("tab", { name: /Delivery/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("syncs the active anchor when intersection events report a new section", () => {
    const handleValueChange = vi.fn();

    render(
      <ObjectPageLayout
        onValueChange={handleValueChange}
        sections={objectPageSections}
      />,
    );

    const subsectionHeading = screen.getByText("Execution plan");
    const subsection = subsectionHeading.closest("[data-parent-section-key]");

    expect(subsection).toBeTruthy();
    expect(observerRecords[0]).toBeTruthy();

    act(() => {
      observerRecords[0]?.callback(
        [
          {
            isIntersecting: true,
            target: subsection as Element,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(handleValueChange).toHaveBeenCalledWith("delivery");
    expect(screen.getByRole("tab", { name: /Delivery/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("renders cleanly in compact density", () => {
    render(
      <ThemeProvider density="compact">
        <ObjectPageLayout
          header={<ObjectPageHeader actions={<Button>Inspect</Button>} title="SO-48291" />}
          sections={objectPageSections}
        />
      </ThemeProvider>,
    );

    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(screen.getByRole("tab", { name: /Summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inspect" })).toBeInTheDocument();
  });
});
