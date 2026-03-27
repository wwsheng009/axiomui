import {
  PageSection,
} from "@axiomui/react";
import {
  createElement,
  lazy,
  startTransition,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";

type DeferredLoader<P> = () => Promise<{ default: ComponentType<P> }>;

interface DeferredDocsModuleProps<P> {
  componentProps: P;
  description: string;
  heading: string;
  loader: DeferredLoader<P>;
  minHeight?: string;
  rootMargin?: string;
}

function DeferredDocsModuleFallback({
  description,
  heading,
  minHeight,
  shellRef,
}: {
  description: string;
  heading: string;
  minHeight: string;
  shellRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={shellRef}
      className="docs-deferred-shell"
      style={
        {
          "--docs-deferred-min-height": minHeight,
        } as CSSProperties
      }
    >
      <PageSection
        heading={heading}
        description={description}
      >
        <div className="docs-deferred-placeholder" aria-hidden="true">
          <span className="docs-deferred-placeholder__bar docs-deferred-placeholder__bar--short" />
          <span className="docs-deferred-placeholder__bar docs-deferred-placeholder__bar--full" />
          <span className="docs-deferred-placeholder__bar docs-deferred-placeholder__bar--medium" />
        </div>
      </PageSection>
    </div>
  );
}

export function DeferredDocsModule<P>({
  componentProps,
  description,
  heading,
  loader,
  minHeight = "36rem",
  rootMargin = "960px 0px",
}: DeferredDocsModuleProps<P>) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const DeferredComponent = useMemo(() => lazy(loader), [loader]);
  const ResolvedDeferredComponent = DeferredComponent as ComponentType<any>;

  useEffect(() => {
    if (shouldLoad) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      startTransition(() => {
        setShouldLoad(true);
      });
      return;
    }

    const node = shellRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        observer.disconnect();
        startTransition(() => {
          setShouldLoad(true);
        });
      },
      {
        rootMargin,
        threshold: 0.01,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, shouldLoad]);

  if (!shouldLoad) {
    return (
      <DeferredDocsModuleFallback
        description={description}
        heading={heading}
        minHeight={minHeight}
        shellRef={shellRef}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <DeferredDocsModuleFallback
          description={description}
          heading={heading}
          minHeight={minHeight}
        />
      }
    >
      {createElement(ResolvedDeferredComponent, componentProps)}
    </Suspense>
  );
}
