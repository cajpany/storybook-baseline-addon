import React from "react";
import { addons } from "storybook/preview-api";
import type {
  Renderer,
  StoryContext,
  PartialStoryFn as StoryFunction,
} from "storybook/internal/types";

import { computeBaselineSummary } from "./baseline";
import { parseCss, toFeatureUsages } from "./analyzer/css-analyzer";
import { parseJavaScript, combineExtractedCSS } from "./analyzer/js-analyzer";
import { parseVueSFC, combineVueCSS } from "./analyzer/vue-analyzer";
import { BaselineBadge } from "./components/BaselineBadge";
import {
  EVENTS,
  GLOBAL_KEY,
  DEFAULT_BASELINE_TARGET,
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
  const cssDetectedFeatures = shouldAutoDetect
    ? detectFeaturesFromCss(cssSources, context)
    : [];

  // Detect features from JavaScript/CSS-in-JS
  const cssInJSConfig = parameters?.cssInJS || {};
  const cssInJSEnabled = cssInJSConfig.enabled !== false;
  const shouldAutoDetectJS = (parameters?.autoDetectJS === true) && cssInJSEnabled;
  
  const jsDetectedFeatures = shouldAutoDetectJS && parameters?.jsSource
    ? detectFeaturesFromJS(parameters.jsSource, context, cssInJSConfig)
    : [];

  // Detect features from Vue SFC
  const shouldAutoDetectVue = parameters?.autoDetectVue === true;
  const vueDetectedFeatures = shouldAutoDetectVue && parameters?.vueSource
    ? detectFeaturesFromVue(parameters.vueSource, context)
    : [];

  // Combine CSS, JS, and Vue detected features
  const detectedFeatures = [...cssDetectedFeatures, ...jsDetectedFeatures, ...vueDetectedFeatures];
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
  
  if (hasNonBaseline && shouldWarn) {
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
      // eslint-disable-next-line no-console -- baseline analyzer diagnostics
      console.warn(
        `[baseline] Failed to analyze CSS for story ${context.id}:`,
        error,
      );
    }
  });

  return Array.from(detected);
}

function detectFeaturesFromJS(
  jsSource: string,
  context: StoryContext<Renderer>,
  config: any = {},
): string[] {
  try {
    const parsed = parseJavaScript(jsSource, {
      sourcePath: `${context.title ?? "story"}-${context.id}.tsx`,
    });

    if (parsed.errors.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[baseline] Errors parsing JavaScript for story ${context.id}:`,
        parsed.errors
      );
    }

    // Combine all extracted CSS
    const combinedCSS = combineExtractedCSS(parsed.extractedStyles);

    if (!combinedCSS.trim()) {
      return [];
    }

    // Parse the extracted CSS using existing CSS analyzer
    const cssParsed = parseCss(combinedCSS, {
      sourcePath: `${context.title ?? "story"}-${context.id}-js-extracted`,
    });

    const usages = toFeatureUsages(cssParsed);
    return usages.map((usage) => usage.featureId);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `[baseline] Failed to analyze JavaScript for story ${context.id}:`,
      error
    );
    return [];
  }
}

function detectFeaturesFromVue(
  vueSource: string,
  context: StoryContext<Renderer>,
): string[] {
  try {
    const parsed = parseVueSFC(vueSource, {
      sourcePath: `${context.title ?? "story"}-${context.id}.vue`,
    });

    if (parsed.errors.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[baseline] Errors parsing Vue SFC for story ${context.id}:`,
        parsed.errors
      );
    }

    // Combine all extracted CSS
    const combinedCSS = combineVueCSS(parsed.extractedStyles);

    if (!combinedCSS.trim()) {
      return [];
    }

    // Parse the extracted CSS using existing CSS analyzer
    const cssParsed = parseCss(combinedCSS, {
      sourcePath: `${context.title ?? "story"}-${context.id}-vue-extracted`,
    });

    const usages = toFeatureUsages(cssParsed);
    return usages.map((usage) => usage.featureId);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `[baseline] Failed to analyze Vue SFC for story ${context.id}:`,
      error
    );
    return [];
  }
}
