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
  disableWarnings?: boolean;
}

export interface CSSinJSConfig {
  enabled?: boolean;
  libraries?: Array<"styled-components" | "emotion" | "stitches" | "all">;
  ignoreInterpolations?: boolean;
  showSource?: boolean;
}

export interface BaselineStoryParameters extends BaselineOptions {
  features?: string[];
  css?: string | string[];
  autoDetect?: boolean;
  ignoreWarnings?: boolean;
  autoDetectJS?: boolean;
  jsSource?: string;
  cssInJS?: CSSinJSConfig;
  autoDetectVue?: boolean;
  vueSource?: string;
}

export interface BaselineSummaryEventPayload {
  storyId: string;
  target: string;
  annotatedCount: number;
  detectedCount?: number;
  source: "manual" | "auto" | "none";
  features: string[];
  summary: BaselineStatusSummary | null;
}
