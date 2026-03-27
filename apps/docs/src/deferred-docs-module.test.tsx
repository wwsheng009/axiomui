import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeferredDocsModule } from "./deferred-docs-module";

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

describe("DeferredDocsModule", () => {
  it("waits for viewport intersection before loading the deferred module", async () => {
    const loader = vi.fn(async () => ({
      default: function LoadedSection({ label }: { label: string }) {
        return <div>Loaded {label}</div>;
      },
    }));

    render(
      <DeferredDocsModule
        componentProps={{ label: "shell" }}
        description="Load shell demos on approach."
        heading="Loading shell demos"
        loader={loader}
      />,
    );

    expect(screen.getByRole("heading", { name: /loading shell demos/i })).toBeInTheDocument();
    expect(loader).not.toHaveBeenCalled();
    expect(observerRecords[0]?.elements).toHaveLength(1);

    act(() => {
      observerRecords[0]?.callback(
        [
          {
            isIntersecting: true,
            target: observerRecords[0]?.elements[0] as Element,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    await waitFor(() => {
      expect(loader).toHaveBeenCalledTimes(1);
    });
    await screen.findByText("Loaded shell");
  });

  it("renders immediately when IntersectionObserver is unavailable", async () => {
    vi.unstubAllGlobals();

    const loader = vi.fn(async () => ({
      default: function LoadedSection() {
        return <div>Loaded charts</div>;
      },
    }));

    render(
      <DeferredDocsModule
        componentProps={{}}
        description="Load charts immediately."
        heading="Loading chart demos"
        loader={loader}
      />,
    );

    await waitFor(() => {
      expect(loader).toHaveBeenCalledTimes(1);
    });
    await screen.findByText("Loaded charts");
  });
});
