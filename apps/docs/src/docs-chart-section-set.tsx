import { ChartLabDemoSections } from "./chart-lab/chart-lab-sections";
import {
  BulletMicroChartDemoSection,
  ChartPrimitivesDemoSection,
  DeltaMicroChartDemoSection,
  HarveyBallMicroChartDemoSection,
  InteractiveDonutChartDemoSection,
  InteractiveLineChartDemoSection,
  KpiCardDemoSection,
  RadialMicroChartDemoSection,
  StackedBarMicroChartDemoSection,
} from "./chart-primitives-sections";

export default function DocsChartSectionSet() {
  return (
    <>
      <ChartPrimitivesDemoSection />
      <BulletMicroChartDemoSection />
      <RadialMicroChartDemoSection />
      <DeltaMicroChartDemoSection />
      <HarveyBallMicroChartDemoSection />
      <StackedBarMicroChartDemoSection />
      <InteractiveDonutChartDemoSection />
      <InteractiveLineChartDemoSection />
      <KpiCardDemoSection />
      <ChartLabDemoSections />
    </>
  );
}
