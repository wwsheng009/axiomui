import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./docs-operations-section-set", () => ({
  default: function MockDocsOperationsSectionSet(props: {
    densityLabel: string;
    locale: string;
    localeLabel: string;
    themeLabel: string;
  }) {
    return (
      <section aria-label="operations payload">
        Deferred operations payload
        {" | "}
        {props.densityLabel}
        {" | "}
        {props.locale}
      </section>
    );
  },
}));

vi.mock("./docs-shell-section-set", () => ({
  default: function MockDocsShellSectionSet(props: { locale: string }) {
    return (
      <section aria-label="shell payload">
        Deferred shell payload
        {" | "}
        {props.locale}
      </section>
    );
  },
}));

vi.mock("./docs-chart-section-set", () => ({
  default: function MockDocsChartSectionSet() {
    return <section aria-label="chart payload">Deferred chart payload</section>;
  },
}));

import { App } from "./app";

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

function triggerObserver(index: number) {
  const target = observerRecords[index]?.elements[0];

  if (!target) {
    throw new Error(`Missing observed target for observer index ${index}.`);
  }

  act(() => {
    observerRecords[index]?.callback(
      [
        {
          isIntersecting: true,
          target,
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  });
}

beforeEach(() => {
  observerRecords.length = 0;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("App", () => {
  it("keeps deferred demo groups out of the initial render and hydrates them on observer entry", async () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /initialize a ui5-fluent workspace, not a pile of disconnected widgets/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /theme architecture/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /popover surface/i })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /loading operations demos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /loading shell demos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /loading chart demos/i }),
    ).toBeInTheDocument();

    expect(screen.queryByLabelText("operations payload")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("shell payload")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("chart payload")).not.toBeInTheDocument();

    expect(observerRecords).toHaveLength(3);

    triggerObserver(0);

    await screen.findByLabelText("operations payload");

    triggerObserver(1);

    await screen.findByLabelText("shell payload");

    triggerObserver(2);

    await screen.findByLabelText("chart payload");

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /loading operations demos/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("passes updated locale and density into deferred groups after controls change", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /^compact$/i }));
    await user.click(screen.getByRole("button", { name: "简体中文" }));

    expect(document.querySelector("[data-axiom-density='compact']")).toBeTruthy();
    expect(document.querySelector("[data-axiom-locale='zh-CN']")).toBeTruthy();

    triggerObserver(0);
    triggerObserver(1);

    await screen.findByText("Deferred operations payload | compact | zh-CN");
    await screen.findByText("Deferred shell payload | zh-CN");
  });
});
