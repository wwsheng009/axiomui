import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { ObjectPageNav } from "../object-page-nav/object-page-nav";

export interface ObjectPageSubSectionProps extends HTMLAttributes<HTMLElement> {
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  heading: ReactNode;
}

export interface ObjectPageLayoutSubSection {
  actions?: ReactNode;
  content: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  heading: ReactNode;
  key: string;
}

export interface ObjectPageLayoutSection {
  actions?: ReactNode;
  content?: ReactNode;
  count?: ReactNode;
  description?: ReactNode;
  heading: ReactNode;
  key: string;
  label: ReactNode;
  subsections?: ObjectPageLayoutSubSection[];
}

export interface ObjectPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  anchorLabel?: string;
  defaultValue?: string;
  header?: ReactNode;
  onValueChange?: (value: string) => void;
  sections: ObjectPageLayoutSection[];
  sideContent?: ReactNode;
  scrollBehavior?: ScrollBehavior;
  value?: string;
}

function getInitialValue(
  sections: ObjectPageLayoutSection[],
  value: string | undefined,
  defaultValue: string | undefined,
) {
  return value ?? defaultValue ?? sections[0]?.key ?? "";
}

function getResolvedCount(section: ObjectPageLayoutSection) {
  if (section.count !== undefined) {
    return section.count;
  }

  if (!section.subsections?.length) {
    return undefined;
  }

  return String(section.subsections.length).padStart(2, "0");
}

export function ObjectPageSubSection({
  actions,
  children,
  className,
  description,
  eyebrow,
  heading,
  ...props
}: ObjectPageSubSectionProps) {
  return (
    <section className={cx("ax-object-page-subsection", className)} {...props}>
      <header className="ax-object-page-subsection__header">
        <div className="ax-object-page-subsection__headline">
          {eyebrow ? (
            <span className="ax-object-page-subsection__eyebrow">{eyebrow}</span>
          ) : null}
          <h3 className="ax-object-page-subsection__heading">{heading}</h3>
          {description ? (
            <p className="ax-object-page-subsection__description">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="ax-object-page-subsection__actions">{actions}</div>
        ) : null}
      </header>

      <div className="ax-object-page-subsection__body">{children}</div>
    </section>
  );
}

export function ObjectPageLayout({
  anchorLabel = "Object page sections",
  className,
  defaultValue,
  header,
  onValueChange,
  scrollBehavior = "smooth",
  sections,
  sideContent,
  value,
  ...props
}: ObjectPageLayoutProps) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(() =>
    getInitialValue(sections, value, defaultValue),
  );
  const activeSection = value ?? internalValue;
  const sectionNodesRef = useRef<Record<string, HTMLElement | null>>({});
  const subSectionNodesRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (value !== undefined) {
      return;
    }

    if (sections.some((section) => section.key === internalValue)) {
      return;
    }

    const nextValue = getInitialValue(sections, value, defaultValue);

    if (nextValue) {
      setInternalValue(nextValue);
    }
  }, [defaultValue, internalValue, sections, value]);

  function updateActiveSection(nextValue: string) {
    if (!nextValue || nextValue === activeSection) {
      return;
    }

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleNavigationChange(nextValue: string) {
    updateActiveSection(nextValue);

    sectionNodesRef.current[nextValue]?.scrollIntoView({
      behavior: scrollBehavior,
      block: "start",
    });
  }

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let nextValue: string | undefined;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          nextValue =
            target.dataset.parentSectionKey ?? target.dataset.sectionKey ?? nextValue;
        });

        if (nextValue) {
          updateActiveSection(nextValue);
        }
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.12, 0.4, 0.72],
      },
    );

    const nodes = [
      ...Object.values(sectionNodesRef.current),
      ...Object.values(subSectionNodesRef.current),
    ].filter(Boolean) as HTMLElement[];

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [activeSection, sections, value]);

  return (
    <div className={cx("ax-object-page-layout", className)} {...props}>
      {header ? <div className="ax-object-page-layout__header">{header}</div> : null}

      <div className="ax-object-page-layout__body">
        <div className="ax-object-page-layout__main">
          <ObjectPageNav
            items={sections.map((section) => ({
              key: section.key,
              label: section.label,
              count: getResolvedCount(section),
            }))}
            listAriaLabel={anchorLabel}
            onValueChange={handleNavigationChange}
            value={activeSection}
          />

          <div className="ax-object-page-layout__sections">
            {sections.map((section) => (
              <div
                key={section.key}
                id={`${generatedId}-${section.key}`}
                ref={(node) => {
                  sectionNodesRef.current[section.key] = node;
                }}
                className="ax-object-page-layout__section-anchor"
                data-section-key={section.key}
              >
                <section className="ax-object-page-section ax-object-page-layout__section">
                  <header className="ax-object-page-section__header">
                    <div className="ax-object-page-section__headline">
                      <h2 className="ax-object-page-section__heading">
                        {section.heading}
                      </h2>
                      {section.description ? (
                        <p className="ax-object-page-section__description">
                          {section.description}
                        </p>
                      ) : null}
                    </div>

                    {section.actions ? (
                      <div className="ax-object-page-section__actions">
                        {section.actions}
                      </div>
                    ) : null}
                  </header>

                  <div className="ax-object-page-section__body">
                    {section.content}

                    {section.subsections?.length ? (
                      <div className="ax-object-page-layout__subsections">
                        {section.subsections.map((subsection) => (
                          <div
                            key={subsection.key}
                            ref={(node: HTMLElement | null) => {
                              subSectionNodesRef.current[
                                `${section.key}:${subsection.key}`
                              ] = node;
                            }}
                            data-parent-section-key={section.key}
                            data-subsection-key={subsection.key}
                            id={`${generatedId}-${section.key}-${subsection.key}`}
                          >
                            <ObjectPageSubSection
                              actions={subsection.actions}
                              className="ax-object-page-layout__subsection"
                              description={subsection.description}
                              eyebrow={subsection.eyebrow}
                              heading={subsection.heading}
                            >
                              {subsection.content}
                            </ObjectPageSubSection>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>
            ))}
          </div>
        </div>

        {sideContent ? (
          <aside className="ax-object-page-layout__side">{sideContent}</aside>
        ) : null}
      </div>
    </div>
  );
}
