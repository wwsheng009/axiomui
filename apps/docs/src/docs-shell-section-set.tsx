import type { LocaleCode } from "./docs-app-config";
import {
  BreadcrumbsDemoSection,
  DynamicPageDemoSection,
  FlexibleColumnLayoutDemoSection,
  ObjectDisplayPrimitivesDemoSection,
  ObjectPageDemoSection,
  SideNavigationDemoSection,
  SplitLayoutDemoSection,
  ToolPageDemoSection,
} from "./shell-page-sections";

interface DocsShellSectionSetProps {
  locale: LocaleCode;
}

export default function DocsShellSectionSet({
  locale,
}: DocsShellSectionSetProps) {
  return (
    <>
      <SideNavigationDemoSection />
      <ToolPageDemoSection locale={locale} />
      <FlexibleColumnLayoutDemoSection locale={locale} />
      <BreadcrumbsDemoSection />
      <ObjectDisplayPrimitivesDemoSection />
      <DynamicPageDemoSection />
      <ObjectPageDemoSection />
      <SplitLayoutDemoSection locale={locale} />
    </>
  );
}
