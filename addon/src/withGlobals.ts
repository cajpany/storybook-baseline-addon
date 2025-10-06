import React from "react";
import { addons } from "storybook/preview-api";
import type {
  Renderer,
  StoryContext,
  PartialStoryFn as StoryFunction,
} from "storybook/internal/types";

import { computeBaselineSummary } from "./baseline";
import { parseCss, toFeatureUsages } from "./analyzer/css-analyzer";
import { BaselineBadge } from "./components/BaselineBadge";
import {
  DEFAULT_BASELINE_TARGET,
  EVENTS,
  GLOBAL_KEY,
  PARAM_KEY,
} from "./constants";
import type {
  BaselineStoryParameters,
  BaselineSummaryEventPayload,
} from "./types";

interface BaselineDecoratorProps {
  storyFn: StoryFunction<Renderer>;
  context: StoryContext<Renderer>;
}

const channel = addons.getChannel();

function BaselineDecorator({
  storyFn,
  context,
}: BaselineDecoratorProps): React.ReactElement {
  const parameters = (context.parameters?.[PARAM_KEY] ?? {}) as
    | BaselineStoryParameters
    | undefined;
  const annotatedFeatures = Array.isArray(parameters?.features)
    ? parameters.features.filter((value): value is string => typeof value === "string")
    : [];

  const shouldAutoDetect = parameters?.autoDetect !== false;
  const cssSources = normalizeCssSources(parameters?.css);
  const detectedFeatures = shouldAutoDetect
    ? detectFeaturesFromCss(cssSources, context)
    : [];
  const detectedCount = detectedFeatures.length;

  const globalTarget =
    typeof context.globals?.[GLOBAL_KEY] === "string"
      ? (context.globals[GLOBAL_KEY] as string)
      : undefined;

  const target = parameters?.target ?? globalTarget ?? DEFAULT_BASELINE_TARGET;

  const hasAnnotated = annotatedFeatures.length > 0;
  const featuresForSummary = hasAnnotated ? annotatedFeatures : detectedFeatures;
  const source: BaselineSummaryEventPayload["source"] = hasAnnotated
    ? "manual"
    : detectedFeatures.length > 0
      ? "auto"
      : "none";

  const summary = featuresForSummary.length
    ? computeBaselineSummary(featuresForSummary, target)
    : null;

  // Log warnings to console in dev mode (synchronously)
  const hasNonBaseline = (summary?.nonCompliantCount ?? 0) > 0;
  const shouldWarn = parameters?.warnOnNonBaseline !== false && !parameters?.ignoreWarnings;
  
  if (hasNonBaseline && shouldWarn && process.env.NODE_ENV !== "production") {
    const nonCompliantFeatures = summary?.features.filter(
      (f) => f.support === "not"
    ) ?? [];
    
    if (nonCompliantFeatures.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Baseline] Story "${context.title}/${context.name}" uses ${nonCompliantFeatures.length} non-Baseline feature(s):`,
        nonCompliantFeatures.map((f) => f.featureId)
      );
    }
  }

  // Emit payload synchronously
  const payload: BaselineSummaryEventPayload = {
    storyId: context.id,
    target,
    annotatedCount: annotatedFeatures.length,
    detectedCount,
    source,
    features: featuresForSummary,
    summary,
  };

  channel.emit(EVENTS.SUMMARY, payload);

  // Return story without badge - badge rendering in preview causes React context issues
  // Badge information is available in the panel instead
  return storyFn(context);
}

export const withBaseline = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>,
): React.ReactElement => React.createElement(BaselineDecorator, { storyFn: StoryFn, context });

function normalizeCssSources(css: BaselineStoryParameters["css"] | undefined): string[] {
  if (!css) {
    return [];
  }

  const values = Array.isArray(css) ? css : [css];

  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function detectFeaturesFromCss(
  cssSources: string[],
  context: StoryContext<Renderer>,
): string[] {
  if (!cssSources.length) {
    return [];
  }

  const detected = new Set<string>();

  cssSources.forEach((css, index) => {
    try {
      const parsed = parseCss(css, {
        sourcePath: `${context.title ?? "story"}-${context.id}-css-${index}`,
      });
      const usages = toFeatureUsages(parsed);
      for (const usage of usages) {
        detected.add(usage.featureId);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console -- baseline analyzer diagnostics
        console.warn(
          `[baseline] Failed to analyze CSS for story ${context.id}:`,
          error,
        );
      }
    }
  });

  return Array.from(detected);
}
