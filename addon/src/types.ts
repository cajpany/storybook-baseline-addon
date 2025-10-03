export type BaselineSupportLevel = "widely" | "newly" | "not";

export type BaselineRawStatus = "high" | "low" | null;

export interface BaselineFeatureUsage {
  featureId: string;
  name: string;
  support: BaselineSupportLevel;
  baseline: BaselineRawStatus;
  browsers: string[];
  found: boolean;
  description?: string;
}

export interface BaselineStatusSummary {
  target: string;
  threshold: "high" | "low";
  totalCount: number;
  nonCompliantCount: number;
  compliantCount: number;
  features: BaselineFeatureUsage[];
}

export interface BaselineOptions {
  target?: string;
  warnOnNonBaseline?: boolean;
}

export interface BaselineStoryParameters extends BaselineOptions {
  features?: string[];
}

export interface BaselineSummaryEventPayload {
  storyId: string;
  target: string;
  annotatedCount: number;
  features: string[];
  summary: BaselineStatusSummary | null;
}
